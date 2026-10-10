import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const attempts = new Map<string, { count: number; reset: number }>();
function allowed(ip: string) {
  const now = Date.now(); const current = attempts.get(ip);
  if (!current || current.reset < now) { attempts.set(ip, { count: 1, reset: now + 60_000 }); return true; }
  current.count += 1; return current.count <= 30;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allowed(ip)) return NextResponse.json({ error: 'Too many verification attempts. Please wait a minute.' }, { status: 429 });
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{40,}$/.test(token)) return NextResponse.json({ error: 'Invalid QR credential.' }, { status: 404 });
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const admin = createAdminClient();
  const { data: credential } = await admin.from('qr_credentials').select('guest_id,revoked_at').eq('token_hash', tokenHash).maybeSingle();
  if (!credential) return NextResponse.json({ error: 'Invalid or unknown QR credential.' }, { status: 404 });
  if (credential.revoked_at) return NextResponse.json({ error: 'This QR credential has been revoked.' }, { status: 410 });
  const { data: guest } = await admin.from('vip_guests').select('id,vip_id,full_name,designation,photo_path,table_number,seat_number,status,first_checked_in_at,created_at').eq('id', credential.guest_id).is('archived_at', null).maybeSingle();
  if (!guest) return NextResponse.json({ error: 'This VIP record is no longer active.' }, { status: 404 });
  let photo_url: string | null = null;
  if (guest.photo_path) { const { data } = await admin.storage.from('guest-photos').createSignedUrl(guest.photo_path, 60 * 10); photo_url = data?.signedUrl || null; }
  return NextResponse.json({ guest: { ...guest, photo_url } });
}
