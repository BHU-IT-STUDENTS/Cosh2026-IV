import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { verificationUrl } from '@/lib/card';
import { readProtectedQrToken, saveProtectedQrToken } from '@/lib/protected-qr-token';

async function prepareCredential(id: string, userId: string, regenerate: boolean) {
  const admin = createAdminClient();
  const { data: current, error: currentError } = await admin.from('qr_credentials').select('token,revoked_at').eq('guest_id', id).maybeSingle();
  // Projects created before the re-download update do not have the private token
  // column yet. They still receive a functional replacement card until migrated.
  const legacyCredentialTable = Boolean(currentError && /token|column/i.test(currentError.message));
  if (currentError && !legacyCredentialTable) throw currentError;
  if (!legacyCredentialTable && !regenerate && current?.token && !current.revoked_at) return NextResponse.json({ verification_url: verificationUrl(current.token), reused: true });

  if (legacyCredentialTable) {
    const rememberedToken = !regenerate ? await readProtectedQrToken(id) : null;
    if (rememberedToken) return NextResponse.json({ verification_url: verificationUrl(rememberedToken), reused: true });
    const token = randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
    const { error } = await admin.from('qr_credentials').upsert({ guest_id: id, token_hash: tokenHash, revoked_at: null, regenerated_by: userId }, { onConflict: 'guest_id' });
    if (error) throw error;
    await saveProtectedQrToken(id, userId, token);
    await admin.from('audit_events').insert({ actor_id: userId, action: regenerate ? 'qr_regenerated' : 'qr_repaired', guest_id: id });
    return NextResponse.json({ verification_url: verificationUrl(token), reissued: regenerate, repaired: !regenerate });
  }

  // A database that has just received the optional column may contain old rows
  // with no stored token. Repair it once, then store and reuse it normally.
  if (!regenerate && !current?.token && !current?.revoked_at) {
    const token = await readProtectedQrToken(id) || randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
    const { error } = await admin.from('qr_credentials').upsert({ guest_id: id, token, token_hash: tokenHash, revoked_at: null, regenerated_by: userId }, { onConflict: 'guest_id' });
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: userId, action: 'qr_repaired', guest_id: id });
    return NextResponse.json({ verification_url: verificationUrl(token), repaired: true });
  }
  const token = randomBytes(32).toString('base64url'); const tokenHash = createHash('sha256').update(token).digest('hex');
  const credential = { guest_id: id, token_hash: tokenHash, revoked_at: null, regenerated_by: userId, ...(legacyCredentialTable ? {} : { token }) };
  const { error } = await admin.from('qr_credentials').upsert(credential, { onConflict: 'guest_id' });
  if (error) throw error;
  await admin.from('audit_events').insert({ actor_id: userId, action: 'qr_regenerated', guest_id: id });
  return NextResponse.json({ verification_url: verificationUrl(token), reissued: true, migration_needed: legacyCredentialTable });
}

/** Re-download is deliberately read-only: it always returns the existing active QR. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params;
    return await prepareCredential(id, user.id, false);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message || 'Could not prepare this QR card.' }, { status: 400 });
  }
}

/** A replacement is only created when the administrator explicitly asks for it. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params;
    const regenerate = new URL(request.url).searchParams.get('regenerate') === '1';
    return await prepareCredential(id, user.id, regenerate);
  } catch (error) { const message = error instanceof Error ? error.message : ''; return NextResponse.json({ error: message || 'Could not regenerate this QR card.' }, { status: 400 }); }
}
