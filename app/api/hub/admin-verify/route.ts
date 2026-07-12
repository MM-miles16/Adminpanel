// app/api/hub/admin-verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function hashOTP(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });
    }

    // 1. Verify OTP from otp_events
    const { data: records, error: otpErr } = await supabase
      .from("otp_events")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpErr || !records?.length) {
      return NextResponse.json({ error: "No OTP found" }, { status: 400 });
    }

    const record = records[0];

    // Check expiry
    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Already used?
    if (record.consumed) {
      return NextResponse.json({ error: "OTP already used" }, { status: 400 });
    }

    // Check hash with 3-strikes lock
    if (hashOTP(otp) !== record.otp_hash) {
      (global as any).otpAttempts = (global as any).otpAttempts || {};
      const attempts = ((global as any).otpAttempts[record.id] || 0) + 1;
      (global as any).otpAttempts[record.id] = attempts;

      if (attempts >= 3) {
        // Lock OTP permanently in DB by marking consumed
        await supabase.from("otp_events").update({ consumed: true }).eq("id", record.id);
        delete (global as any).otpAttempts[record.id];
        return NextResponse.json({ 
          error: "Invalid OTP. This verification code has been locked due to too many failed attempts." 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        error: `Invalid OTP. ${3 - attempts} attempt(s) remaining.` 
      }, { status: 400 });
    }

    // Mark consumed
    await supabase.from("otp_events").update({ consumed: true }).eq("id", record.id);

    // 2. Re-verify admin status
    const { data: admin, error: adminErr } = await supabase
      .from("admin_users")
      .select("id, name, user_id, role")
      .eq("phone", phone)
      .eq("is_active", true)
      .single();

    if (adminErr || !admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // 3. Update last login
    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    // 4. Create Admin JWT
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        aud: "authenticated",
        role: "hub_admin",
        admin_role: admin.role || "admin",
        sub: admin.user_id || admin.id,
        name: admin.name,
        phone: phone,
        iat: now,
        exp: now + 8 * 60 * 60, // 8 hours session
      },
      process.env.SUPABASE_JWT_SECRET!
    );

    // Clean up attempts
    if ((global as any).otpAttempts) {
      delete (global as any).otpAttempts[record.id];
    }

    const response = NextResponse.json({
      success: true,
      token, // Keep token in body for client backward compatibility
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role || "admin",
        phone: phone
      }
    });

    // Set secure HttpOnly cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err) {
    console.error("Admin verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
