import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';


export async function GET(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Try to use service role for admin operations, fallback to anon
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch vehicles and join with hosts table
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        id,
        make,
        model,
        model_year,
        registration_number,
        available_status,
        location_name,
        host_id,
        hosts (
          id,
          full_name,
          phone
        ),
        vehicle_images (
          id,
          image_url,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('Unexpected error in cars API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { vehicleId, available_status } = await request.json();

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update({ available_status })
      .eq('id', vehicleId)
      .select();

    if (error) {
      console.error('Error updating car status:', error);
      return NextResponse.json({ error: 'Failed to update car status' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    });

  } catch (error) {
    console.error('Unexpected error in cars PATCH API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
