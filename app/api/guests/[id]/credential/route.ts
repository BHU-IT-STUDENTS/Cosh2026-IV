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
    // Projects created before the re-download update do not have the private token
    // column yet. They still receive a functional replacement card until migrated.
    const legacyCredentialTable = Boolean(currentError && /token|column/i.test(currentError.message));
    if (currentError && !legacyCredentialTable) throw currentError;
    if (!legacyCredentialTable && !regenerate && current?.token && !current.revoked_at) return NextResponse.json({ verification_url: verificationUrl(current.token), reused: true });
    const token = randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
    const credential = { guest_id: id, token_hash: tokenHash, revoked_at: null, regenerated_by: user.id, ...(legacyCredentialTable ? {} : { token }) };
    const { error } = await admin.from('qr_credentials').upsert(credential, { onConflict: 'guest_id' });
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'qr_regenerated', guest_id: id });
    return NextResponse.json({ verification_url: verificationUrl(token), reissued: true, migration_needed: legacyCredentialTable });
  } catch (error) { const message = error instanceof Error ? error.message : ''; return NextResponse.json({ error: message || 'Could not regenerate this QR card.' }, { status: 400 }); }
}
