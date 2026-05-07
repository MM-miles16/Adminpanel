import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';


export async function GET(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Use service role key for admin operations, fallback to anon
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
