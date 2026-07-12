// app/api/hub/bookings/extend/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromAuthHeader } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const dynamic = 'force-dynamic';

/**
 * Convert a local datetime string (e.g. "2026-04-14T09:00") to face-value ISO.
 * This stores the exact time the admin typed — no timezone conversion.
 */
function toFaceValueISO(localDateTimeStr: string): string {
  const [datePart, timePart] = localDateTimeStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = (timePart || "00:00:00").split(":").map(Number);

  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second || 0));
  return utc.toISOString();
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const admin = getUserFromAuthHeader(authHeader);

    if (!admin || admin.role !== "hub_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, newEndTime, type } = await req.json(); // newEndTime is local string "YYYY-MM-DDTHH:mm"

    if (!bookingId || !newEndTime || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // RBAC: Operators can only extend offline/maintenance bookings, not online bookings
    if (admin.admin_role === 'operator' && type === 'online') {
      return NextResponse.json({ error: "Operators cannot extend online bookings" }, { status: 403 });
    }

    const isoNewEnd = toFaceValueISO(newEndTime);
    const table = type === 'online' ? 'bookings' : 'maintenance_logs';
    
    // 1. Get current booking info
    const { data: booking, error: fetchErr } = await supabase
      .from(table)
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Validate current status (Only ongoing or upcoming)
    const now = new Date();
    const currentEnd = new Date(booking.end_time || (booking.booking_range ? booking.booking_range.split(',')[1].replace(/[}\)]/, '') : null));
    
    if (now > currentEnd && type === 'offline') {
        return NextResponse.json({ error: "Cannot extend a completed booking" }, { status: 400 });
    }
    
    if (type === 'online' && (booking.status === 'completed' || booking.status === 'cancelled')) {
        return NextResponse.json({ error: "Cannot extend a completed or cancelled booking" }, { status: 400 });
    }

    const vehicle_id = booking.vehicle_id;
    const start_time = booking.start_time || (booking.booking_range ? booking.booking_range.split(',')[0].replace(/[\[\()]/, '') : null);

    // 3. Validate new end time is after current end time
    const newEnd = new Date(isoNewEnd);
    if (newEnd <= currentEnd) {
        return NextResponse.json({ error: "New end time must be after the current end time" }, { status: 400 });
    }

    // 4. Check for overlap using the RPC
    const { data: hasOverlap, error: overlapErr } = await supabase.rpc("check_car_overlap", {
        p_vehicle_id: vehicle_id,
        p_start_time: start_time,
        p_end_time: isoNewEnd,
        p_exclude_booking_id: type === 'online' ? bookingId : null,
        p_exclude_maintenance_id: type === 'offline' ? bookingId : null
    });

    if (overlapErr) {
        console.error("Overlap check error:", overlapErr);
        return NextResponse.json({ error: "Database error during overlap check" }, { status: 500 });
    }

    if (hasOverlap) {
        return NextResponse.json({ 
            error: "Cannot extend: This car has another booking or maintenance scheduled (including 3h buffer)." 
        }, { status: 409 });
    }

    // 5. Perform the update
    const updateData: any = {};
    
    if (type === 'online') {
        // For online bookings, we update both end_time and the booking_range (TSTZRANGE)
        const isoStart = new Date(start_time).toISOString();
        updateData.booking_range = `[${isoStart},${isoNewEnd})`;
        updateData.end_time = isoNewEnd;
    } else {
        updateData.end_time = isoNewEnd;
    }

    const { error: updateErr } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", bookingId);

    if (updateErr) {
        console.error("Update error:", updateErr);
        return NextResponse.json({ error: "Failed to update booking in database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Booking extended successfully" });

  } catch (err) {
    console.error("Extend booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
