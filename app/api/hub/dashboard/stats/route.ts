import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(request) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Use service role key for admin operations, fallback to anon
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If host is logged in, calculate host-specific stats
    if (user.role === 'host') {
      // 1. Fetch all host's vehicle IDs
      const { data: vehicles, error: vError } = await supabase
        .from('vehicles')
        .select('id, registration_number, available_status')
        .eq('host_id', user.sub);

      if (vError) {
        console.error('Error fetching host vehicles for stats:', vError);
        return NextResponse.json({ error: 'Failed to fetch host stats' }, { status: 500 });
      }

      const vehicleIds = vehicles?.map(v => v.id) || [];

      if (vehicleIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            revenue: { last_day_revenue: 0, last_week_revenue: 0, last_month_revenue: 0 },
            latestTransaction: 0,
            occupancy: { cars_on_trip_now: 0, future_booked_cars: 0, sales_this_week: 0, sales_last_month: 0, cars_in_maintenance_now: 0 },
            inventory: { available_vehicles: 0 }
          }
        });
      }

      // 2. Fetch bookings for these vehicles from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: bookings, error: bError } = await supabase
        .from('bookings')
        .select('total_amount, created_at, start_time, end_time, status')
        .in('vehicle_id', vehicleIds)
        .eq('status', 'confirmed')
        .gte('start_time', thirtyDaysAgo.toISOString());

      if (bError) {
        console.error('Error fetching host bookings for stats:', bError);
      }

      // Compute revenue stats
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let last_day_revenue = 0;
      let last_week_revenue = 0;
      let last_month_revenue = 0;
      let sales_this_week = 0;
      let sales_last_month = bookings?.length || 0;

      bookings?.forEach(b => {
        const bStart = new Date(b.start_time);
        const amount = b.total_amount || 0;
        if (bStart >= oneDayAgo) last_day_revenue += amount;
        if (bStart >= oneWeekAgo) last_week_revenue += amount;
        last_month_revenue += amount;

        if (bStart >= oneWeekAgo) sales_this_week++;
      });

      const revenue = {
        last_day_revenue,
        last_week_revenue,
        last_month_revenue
      };

      // 3. Fetch latest transaction amount
      const { data: latestTxData } = await supabase
        .from('bookings')
        .select('total_amount')
        .in('vehicle_id', vehicleIds)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(1);

      const latestTransaction = latestTxData?.[0]?.total_amount || 0;

      // 4. Fetch occupancy stats
      const nowStr = now.toISOString();
      const { count: cars_on_trip_now } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .in('vehicle_id', vehicleIds)
        .eq('status', 'confirmed')
        .lte('start_time', nowStr)
        .gte('end_time', nowStr);

      const { count: future_booked_cars } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .in('vehicle_id', vehicleIds)
        .eq('status', 'confirmed')
        .gt('start_time', nowStr);

      const { count: cars_in_maintenance_now } = await supabase
        .from('maintenance_logs')
        .select('id', { count: 'exact', head: true })
        .in('vehicle_id', vehicleIds)
        .lte('start_time', nowStr)
        .gte('end_time', nowStr);

      const occupancy = {
        cars_on_trip_now: cars_on_trip_now || 0,
        future_booked_cars: future_booked_cars || 0,
        sales_this_week,
        sales_last_month,
        cars_in_maintenance_now: cars_in_maintenance_now || 0
      };

      // 5. Fetch inventory stats
      const available_vehicles = vehicles.filter(v => v.available_status === true).length;
      const inventory = {
        available_vehicles
      };

      return NextResponse.json({
        success: true,
        data: {
          revenue,
          latestTransaction,
          occupancy,
          inventory
        }
      });
    }

    // Fetch Revenue Stats
    const { data: revenueData, error: revenueError } = await supabase.rpc('get_confirmed_revenue_stats');

    if (revenueError) {
      console.error('Error fetching revenue stats:', revenueError);
      return NextResponse.json({ error: 'Failed to fetch revenue stats' }, { status: 500 });
    }

    // The RPC returns an array with one object, extract it
    const revenue = revenueData?.[0] || {
      last_day_revenue: 0,
      last_week_revenue: 0,
      last_month_revenue: 0
    };

    // Fetch Last Transaction
    const { data: latestTxData, error: latestTxError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (latestTxError) {
      console.error('Error fetching latest transaction:', latestTxError);
    }

    const latestTransaction = latestTxData?.[0]?.total_amount || 0;

    // Fetch Occupancy Stats
    const { data: occData, error: occError } = await supabase.rpc('get_detailed_occupancy_stats');
    if (occError) console.error('Error fetching occupancy stats:', occError);
    const occupancy = occData?.[0] || {
      cars_on_trip_now: 0,
      future_booked_cars: 0,
      sales_this_week: 0,
      sales_last_month: 0,
      cars_in_maintenance_now: 0
    };

    // Fetch Inventory Stats
    const { data: invData, error: invError } = await supabase.rpc('get_vehicle_inventory_stats');
    if (invError) console.error('Error fetching inventory stats:', invError);
    const inventory = invData?.[0] || { available_vehicles: 0, total_vehicles: 0 };

    return NextResponse.json({
      success: true,
      data: {
        revenue,
        latestTransaction,
        occupancy,
        inventory
      }
    });

  } catch (error) {
    console.error('Unexpected error in dashboard stats API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
