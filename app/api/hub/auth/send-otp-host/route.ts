// app/api/hub/auth/send-otp-host/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppOTP } from "@/app/api/auth/utils/whatsapp";

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

    // Normalize phone number (strip non-digits and strip 91 country code if present to get 10-digit number)
    const digitsOnly = phone.replace(/\D/g, "");
    const cleanPhone = digitsOnly.length === 12 && digitsOnly.startsWith("91") 
      ? digitsOnly.substring(2) 
      : digitsOnly;

    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: "Enter a valid 10-digit phone number" }, { status: 400 });
    }

    // 1. Check if host exists in hosts table
    const { data: host, error: hostErr } = await supabase
      .from("hosts")
      .select("phone, verified, full_name")
      .eq("phone", cleanPhone)
      .single();

    if (hostErr || !host) {
      console.warn(`Blocked OTP request for non-host: ${cleanPhone}`);
      return NextResponse.json({ error: "Access Denied: Not a registered host" }, { status: 403 });
    }

    // Cooldown check: Limit OTP generation to once every 60 seconds per phone number
    const { data: lastOtp } = await supabase
      .from("otp_events")
      .select("created_at")
      .eq("phone", cleanPhone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (lastOtp && lastOtp.length > 0) {
      const timeDiff = Date.now() - new Date(lastOtp[0].created_at).getTime();
      if (timeDiff < 60000) {
        const waitTime = Math.ceil((60000 - timeDiff) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitTime} seconds before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    // 2. Generate and Store OTP (stored under cleanPhone)
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    await supabase.from("otp_events").insert({
      phone: cleanPhone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    // 3. Send via WhatsApp (prepending 91 for international format)
    const whatsappDestination = `91${cleanPhone}`;
    const sent = await sendWhatsAppOTP(whatsappDestination, otp);

    if (!sent) {
      return NextResponse.json({ error: "Message provider error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Secure OTP sent" });
  } catch (err) {
    console.error("Host OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
