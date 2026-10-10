import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { requireAdmin, requireUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { guestSchema } from '@/lib/validation';
import { verificationUrl } from '@/lib/card';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const newToken = () => randomBytes(32).toString('base64url');

export async function GET() {
  try {
    await requireUser();
    const { data, error } = await createAdminClient().from('vip_guests')
      .select('id,vip_id,full_name,designation,photo_path,table_number,seat_number,status,first_checked_in_at,created_at')
      .is('archived_at', null).order('table_number', { ascending: true }).order('seat_number', { ascending: true }).order('full_name', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ guests: data });
  } catch (error) { return respond(error); }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = guestSchema.parse(await request.json());
    const admin = createAdminClient();
    const { data: duplicate } = await admin.from('vip_guests').select('id,full_name').ilike('full_name', body.full_name).is('archived_at', null);
    const { data: guest, error } = await admin.from('vip_guests').insert({ ...body, designation: body.designation || null, email: body.email || null, phone: body.phone || null }).select().single();
    if (error) throw error;
    const token = newToken();
    const { error: credentialError } = await admin.from('qr_credentials').insert({ guest_id: guest.id, token, token_hash: hash(token), regenerated_by: user.id });
    if (credentialError) throw credentialError;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'guest_created', guest_id: guest.id, details: { table: guest.table_number, seat: guest.seat_number } });
    return NextResponse.json({ guest, verification_url: verificationUrl(token), duplicate_warning: duplicate?.length ? 'A guest with this exact name already exists. The new guest was saved as a separate record.' : null }, { status: 201 });
  } catch (error) { return respond(error); }
}

function respond(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  const status = message === 'UNAUTHENTICATED' ? 401 : message === 'FORBIDDEN' ? 403 : message.includes('duplicate key') ? 409 : message.includes('validation') ? 400 : 500;
  return NextResponse.json({ error: status === 500 ? 'Unable to complete that request. Please try again.' : message }, { status });
}
