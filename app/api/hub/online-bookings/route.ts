// app/api/hub/online-bookings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromAuthHeader } from "@/lib/auth";

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

    // bookings → vehicles via vehicle_id FK (direct)
    // bookings → users via user_id FK (direct), but customer data is in 'customers' table
    // customers is linked via customers.user_id → users.id (not a direct FK from bookings)
    // So we fetch bookings + vehicles, then enrich with customer data separately.
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // bookings → vehicles via vehicle_id FK (direct)
    const { data: bookings, error, count } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        start_time,
        end_time,
        status,
        total_amount,
        created_at,
        vehicles (make, model, registration_number)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Fetch bookings error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ bookings: [], message: "No bookings found in database" });
    }

    // Get unique user_ids and fetch their customer records
    const userIds = [...new Set(bookings.map((b: any) => b.user_id).filter(Boolean))];

    let customerMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const { data: customers, error: custError } = await supabase
        .from("customers")
        .select("user_id, first_name, last_name, phone")
        .in("user_id", userIds);

      if (custError) {
        console.error("Enrichment error:", custError);
        // Continue without customer data if this fails, or return partial data
      }

      if (customers) {
        for (const c of customers) {
          customerMap[c.user_id] = c;
        }
      }
    }

    // Merge customer data into bookings
    const enrichedBookings = bookings.map((b: any) => ({
      ...b,
      customers: customerMap[b.user_id] || null,
    }));

    return NextResponse.json({ 
      bookings: enrichedBookings, 
      count: enrichedBookings.length,
      total: count,
      page,
      limit,
      hasMore: count ? (from + limit < count) : false
    });
  } catch (err: any) {
    console.error("Fetch online bookings fatal error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
