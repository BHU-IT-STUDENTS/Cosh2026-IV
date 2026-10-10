import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { verificationUrl } from '@/lib/card';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params; const admin = createAdminClient();
    const regenerate = new URL(request.url).searchParams.get('regenerate') === '1';
    const { data: current, error: currentError } = await admin.from('qr_credentials').select('token,revoked_at').eq('guest_id', id).maybeSingle();
    if (currentError) throw currentError;
    if (!regenerate && current?.token && !current.revoked_at) return NextResponse.json({ verification_url: verificationUrl(current.token), reused: true });
    const token = randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
    const { error } = await admin.from('qr_credentials').upsert({ guest_id: id, token, token_hash: tokenHash, revoked_at: null, regenerated_by: user.id }, { onConflict: 'guest_id' });
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'qr_regenerated', guest_id: id });
    return NextResponse.json({ verification_url: verificationUrl(token) });
  } catch { return NextResponse.json({ error: 'Could not regenerate this QR card.' }, { status: 400 }); }
}
