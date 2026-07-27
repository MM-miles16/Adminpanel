import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.admin_role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can select a host' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('hosts')
    .select('id, full_name, phone, email, verified')
    .eq('verified', true)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Unable to fetch hosts:', error);
    return NextResponse.json({ error: 'Unable to load hosts' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
