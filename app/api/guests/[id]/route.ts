import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { guestSchema } from '@/lib/validation';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params;
    const body = guestSchema.parse(await request.json());
    const admin = createAdminClient();
    const { data, error } = await admin.from('vip_guests').update({ ...body, designation: body.designation || null, email: body.email || null, phone: body.phone || null }).eq('id', id).is('archived_at', null).select().single();
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'guest_updated', guest_id: id, details: { table: data.table_number, seat: data.seat_number } });
    return NextResponse.json({ guest: data });
  } catch (error) { return respond(error); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireAdmin(); const { id } = await params;
    const admin = createAdminClient();
    const { error } = await admin.from('vip_guests').update({ archived_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'guest_archived', guest_id: id });
    return NextResponse.json({ ok: true });
  } catch (error) { return respond(error); }
}
function respond(error: unknown) { const m = error instanceof Error ? error.message : ''; return NextResponse.json({ error: m === 'UNAUTHENTICATED' ? 'Sign in required.' : m === 'FORBIDDEN' ? 'Administrator permission required.' : m.includes('duplicate key') ? 'That table and seat is already assigned.' : 'Unable to save the guest.' }, { status: m === 'UNAUTHENTICATED' ? 401 : m === 'FORBIDDEN' ? 403 : m.includes('duplicate key') ? 409 : 400 }); }
