import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { normalizeIndianPhone } from '@/lib/phone';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const hashOTP = (otp: string) => crypto.createHash('sha256').update(otp).digest('hex');

export async function POST(request: Request) {
  try {
    const { phone, otp, role } = await request.json();
    const normalized = normalizeIndianPhone(phone);
    if (!normalized || !otp || !['admin', 'host'].includes(role)) return NextResponse.json({ error: 'Phone number, role, and OTP are required' }, { status: 400 });

    const { data: records, error: otpError } = await supabase.from('otp_events').select('*').eq('phone', normalized.e164).order('created_at', { ascending: false }).limit(1);
    const record = records?.[0];
    if (otpError || !record) return NextResponse.json({ error: 'No OTP found. Request a new code.' }, { status: 400 });
    if (record.consumed) return NextResponse.json({ error: 'This OTP has already been used' }, { status: 400 });
    if (new Date(record.expires_at) < new Date()) return NextResponse.json({ error: 'OTP expired. Request a new code.' }, { status: 400 });
    if (hashOTP(otp) !== record.otp_hash) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

    let identity: any;
    if (role === 'host') {
      const { data, error } = await supabase.from('hosts').select('id, full_name, phone, email').in('phone', normalized.candidates).eq('verified', true).maybeSingle();
      if (error || !data) return NextResponse.json({ error: 'Host access is no longer available' }, { status: 403 });
      identity = { id: data.id, name: data.full_name, phone: data.phone, email: data.email, role: 'host' };
    } else {
      const { data, error } = await supabase.from('admin_users').select('id, name, user_id, phone, role').in('phone', normalized.candidates).eq('is_active', true).maybeSingle();
      if (error || !data) return NextResponse.json({ error: 'Admin access is no longer available' }, { status: 403 });
      identity = { id: data.id, subject: data.user_id || data.id, name: data.name, phone: data.phone, role: data.role || 'admin' };
      await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', data.id);
    }

    await supabase.from('otp_events').update({ consumed: true }).eq('id', record.id);
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(role === 'host'
      ? { aud: 'authenticated', role: 'host', sub: identity.id, name: identity.name, phone: identity.phone, email: identity.email, iat: now, exp: now + 8 * 60 * 60 }
      : { aud: 'authenticated', role: 'hub_admin', admin_role: identity.role, sub: identity.subject, name: identity.name, phone: identity.phone, iat: now, exp: now + 8 * 60 * 60 }, process.env.SUPABASE_JWT_SECRET!);

    const response = NextResponse.json({ success: true, admin: { id: identity.id, name: identity.name, role: identity.role, phone: identity.phone, email: identity.email } });
    response.cookies.set('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'strict', maxAge: 8 * 60 * 60 });
    return response;
  } catch (error) {
    console.error('Unified OTP verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
