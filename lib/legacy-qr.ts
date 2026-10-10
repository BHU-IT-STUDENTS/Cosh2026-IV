import 'server-only';
import { createHmac } from 'crypto';

/**
 * Compatibility token for databases created before qr_credentials.token
 * existed. It is deterministically derived on the server, never stored in a
 * browser record, and remains stable across every re-download.
 */
export function stableLegacyQrToken(guestId: string) {
  const secret = process.env.QR_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('QR signing secret is not configured.');
  return createHmac('sha256', secret).update(`cosh2026:legacy-qr:v1:${guestId}`).digest('base64url');
}
