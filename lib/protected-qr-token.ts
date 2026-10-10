import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const action = 'qr_token_protected';

function key() {
  const secret = process.env.QR_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('QR signing secret is not configured.');
  return createHash('sha256').update(secret).digest();
}

function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${data.toString('base64url')}`;
}

function decrypt(value: string) {
  const [ivValue, tagValue, dataValue] = value.split('.');
  if (!ivValue || !tagValue || !dataValue) return null;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivValue, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(dataValue, 'base64url')), decipher.final()]).toString('utf8');
  } catch { return null; }
}

/** Safely bridges pre-token-column rows; no raw QR bearer token is stored. */
export async function readProtectedQrToken(guestId: string) {
  const { data, error } = await createAdminClient().from('audit_events').select('details').eq('guest_id', guestId).eq('action', action).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  const encrypted = (data?.details as { encrypted_token?: unknown } | undefined)?.encrypted_token;
  const token = typeof encrypted === 'string' ? decrypt(encrypted) : null;
  return token && /^[A-Za-z0-9_-]{40,}$/.test(token) ? token : null;
}

export async function saveProtectedQrToken(guestId: string, actorId: string, token: string) {
  const { error } = await createAdminClient().from('audit_events').insert({ actor_id: actorId, action, guest_id: guestId, details: { version: 1, encrypted_token: encrypt(token) } });
  if (error) throw error;
}
