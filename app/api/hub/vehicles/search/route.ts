// app/api/hub/vehicles/search/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromAuthHeader } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const admin = getUserFromAuthHeader(authHeader);

    if (!admin || admin.role !== "hub_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ vehicles: [] });
    }

    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select(`
        id,
        make,
        model,
        registration_number,
        vehicle_type,
        fuel_type
      `)
      .ilike("registration_number", `%${query}%`)
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ vehicles });
  } catch (err) {
    console.error("Vehicle search error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
