// app/api/hub/bookings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromAuthHeader } from "@/lib/auth";

export const dynamic = 'force-dynamic';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Convert a local datetime string (e.g. "2026-04-14T09:00") to face-value ISO.
 * This stores the exact time the admin typed — no timezone conversion.
 * Example: "2026-04-14T09:00" → "2026-04-14T09:00:00.000Z"
 */
function toFaceValueISO(localDateTimeStr: string): string {
  // datetime-local gives "YYYY-MM-DDTHH:MM"
  // We construct a UTC date with the same face-value components
  const [datePart, timePart] = localDateTimeStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  return utc.toISOString();
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const admin = getUserFromAuthHeader(authHeader);

    if (!admin || admin.role !== "hub_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const reason = searchParams.get("reason") || "OFFLINE BOOKING";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: logs, error, count } = await supabase
      .from("maintenance_logs")
      .select(`
        id,
        start_time,
        end_time,
        reason,
        created_at,
        vehicles (make, model, registration_number)
      `, { count: "exact" })
      .eq("reason", reason)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({ 
      bookings: logs,
      total: count,
      page,
      limit,
      hasMore: count ? (from + limit < count) : false
    });
  } catch (err) {
    console.error("Fetch offline bookings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const admin = getUserFromAuthHeader(authHeader);

    if (!admin || admin.role !== "hub_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vehicle_id, start_time, end_time, reason } = await req.json();

    if (!vehicle_id || !start_time || !end_time) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const isoStart = toFaceValueISO(start_time);
    const isoEnd = toFaceValueISO(end_time);

    // Validate end > start
    if (new Date(isoEnd) <= new Date(isoStart)) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // Calculate end with 3-hour buffer for consistency with DB constraint
    const start = new Date(isoStart);
    const end = new Date(isoEnd);
    const endWithBuffer = new Date(end.getTime() + (3 * 60 * 60 * 1000));
    const isoEndWithBuffer = endWithBuffer.toISOString();

    // Check for overlapping bookings (both online and offline)
    const { data: overlaps, error: overlapErr } = await supabase
      .rpc("check_car_overlap", {
        p_vehicle_id: vehicle_id,
        p_start_time: isoStart,
        p_end_time: isoEnd
      });

    if (overlapErr) {
      console.error("Overlap check error:", overlapErr);
      // Fallback: manual overlap check for both tables
      // Use booking_range for bookings to account for existing buffers
      const { data: bookingOverlaps } = await supabase
        .from("bookings")
        .select("id")
        .eq("vehicle_id", vehicle_id)
        .eq("status", "confirmed")
        .filter('booking_range', 'ov', `[${isoStart},${isoEndWithBuffer})`);

      // For maintenance, check if our buffered range overlaps with their simple range
      const { data: maintenanceOverlaps } = await supabase
        .from("maintenance_logs")
        .select("id")
        .eq("vehicle_id", vehicle_id)
        .lt("start_time", isoEndWithBuffer)
        .gt("end_time", isoStart);

      if ((bookingOverlaps && bookingOverlaps.length > 0) || (maintenanceOverlaps && maintenanceOverlaps.length > 0)) {
        return NextResponse.json({
          error: "This vehicle already has a booking (online or offline) that overlaps with the selected time range"
        }, { status: 409 });
      }
    } else if (overlaps === true) {
      return NextResponse.json({
        error: "This vehicle already has a booking (online or offline) that overlaps with the selected time range"
      }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("maintenance_logs")
      .insert([
        {
          vehicle_id,
          start_time: isoStart,
          end_time: isoEnd,
          reason: reason || "OFFLINE BOOKING"
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, booking: data[0] });
  } catch (err) {
    console.error("Create offline booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const admin = getUserFromAuthHeader(authHeader);

    if (!admin || admin.role !== "hub_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const reason = searchParams.get("reason") || "OFFLINE BOOKING";

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("maintenance_logs")
      .delete()
      .eq("id", id)
      .eq("reason", reason);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete offline booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
