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
    // Try to use service role for admin operations, fallback to anon
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const from = (page - 1) * limit;
    const to = from + limit; // Fetch one extra to determine hasMore

    let dbQuery = supabase.rpc('get_admin_bookings');

    // If logged in as host, filter bookings to only those matching host's vehicles
    if (user.role === 'host') {
      const { data: vehicles, error: vError } = await supabase
        .from('vehicles')
        .select('registration_number')
        .eq('host_id', user.sub);

      if (vError) {
        console.error('Error fetching host vehicles for bookings list:', vError);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
      }

      const regNumbers = vehicles?.map(v => v.registration_number) || [];

      if (regNumbers.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          hasMore: false,
          page
        });
      }

      dbQuery = dbQuery.in('registration_number', regNumbers);
    }

    // Fetch bookings using a secure RPC function that bypasses RLS
    const { data, error } = await dbQuery.range(from, to);

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    const hasMore = data && data.length > limit;
    const bookings = hasMore ? data.slice(0, limit) : data;

    return NextResponse.json({
      success: true,
      data: bookings,
      hasMore,
      page
    });

  } catch (error) {
    console.error('Unexpected error in bookings list API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
