// app/api/hub/host-verify/route.ts
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

    // Normalize phone number (strip non-digits and strip 91 country code if present to get 10-digit number)
    const digitsOnly = phone.replace(/\D/g, "");
    const cleanPhone = digitsOnly.length === 12 && digitsOnly.startsWith("91") 
      ? digitsOnly.substring(2) 
      : digitsOnly;

    // 1. Verify OTP from otp_events
    const { data: records, error: otpErr } = await supabase
      .from("otp_events")
      .select("*")
      .eq("phone", cleanPhone)
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

    // 2. Query host status
    const { data: host, error: hostErr } = await supabase
      .from("hosts")
      .select("id, full_name, phone, email, verified")
      .eq("phone", cleanPhone)
      .single();

    if (hostErr || !host) {
      return NextResponse.json({ error: "Access Denied: Not a registered host" }, { status: 403 });
    }

    // 3. Create Host JWT
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        aud: "authenticated",
        role: "host", // Host role
        sub: host.id, // Host ID as subject
        name: host.full_name,
        phone: host.phone,
        email: host.email,
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
      token, // Return token for backward compatibility
      admin: {
        id: host.id,
        name: host.full_name,
        role: "host",
        phone: host.phone,
        email: host.email
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
    console.error("Host verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
