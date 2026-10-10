import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { verificationUrl } from '@/lib/card';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params; const admin = createAdminClient();
    const token = randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
    const { error: revokeError } = await admin.from('qr_credentials').update({ revoked_at: new Date().toISOString() }).eq('guest_id', id).is('revoked_at', null);
    if (revokeError) throw revokeError;
    const { error } = await admin.from('qr_credentials').upsert({ guest_id: id, token_hash: tokenHash, revoked_at: null, regenerated_by: user.id });
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'qr_regenerated', guest_id: id });
    return NextResponse.json({ verification_url: verificationUrl(token) });
  } catch { return NextResponse.json({ error: 'Could not regenerate this QR card.' }, { status: 400 }); }
}
