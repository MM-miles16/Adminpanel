// app/api/hub/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppOTP } from "../../../auth/utils/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function hashOTP(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOTP() {
  const length = Number(process.env.OTP_LENGTH || 4);
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  return crypto.randomInt(min, max).toString();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

    // 1. SECURITY: STRICT ADMIN CHECK
    // We check the whitelist BEFORE even generating or sending an OTP
    const { data: admin, error: adminErr } = await supabase
      .from("admin_users")
      .select("phone, is_active")
      .eq("phone", phone)
      .eq("is_active", true)
      .single();

    if (adminErr || !admin) {
      console.warn(`Blocked OTP request for non-admin: ${phone}`);
      // return 403 to indicate they aren't allowed to even ask for an OTP
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // 2. Generate and Store OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    await supabase.from("otp_events").insert({
      phone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    // 3. Send via WhatsApp
    const sent = await sendWhatsAppOTP(phone, otp);

    if (!sent) {
      return NextResponse.json({ error: "Message provider error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Secure OTP sent" });
  } catch (err) {
    console.error("Secure admin OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
