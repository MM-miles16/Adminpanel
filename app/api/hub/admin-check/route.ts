// app/api/hub/admin-check/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Check if phone exists in admin_users and is active
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("phone, is_active")
      .eq("phone", phone)
      .eq("is_active", true)
      .single();

    if (error || !admin) {
      console.warn(`Unauthorized admin access attempt for phone: ${phone}`);
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    return NextResponse.json({ success: true, isAdmin: true });
  } catch (err) {
    console.error("Admin check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
