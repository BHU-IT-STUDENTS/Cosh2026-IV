import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const staffSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(12).max(128),
  role: z.enum(['admin', 'officer']),
});

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await createAdminClient().from('profiles').select('id,full_name,role,created_at').order('created_at');
    if (error) throw error;
    return NextResponse.json({ staff: data });
  } catch { return NextResponse.json({ error: 'Administrator permission required.' }, { status: 403 }); }
}

export async function POST(request: NextRequest) {
  try {
    const { user: actor } = await requireAdmin();
    const values = staffSchema.parse(await request.json());
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({ email: values.email, password: values.password, email_confirm: true, user_metadata: { full_name: values.full_name } });
    if (error || !data.user) throw error || new Error('Could not create account');
    const { error: profileError } = await admin.from('profiles').upsert({ id: data.user.id, full_name: values.full_name, role: values.role });
    if (profileError) { await admin.auth.admin.deleteUser(data.user.id); throw profileError; }
    await admin.from('audit_events').insert({ actor_id: actor.id, action: 'staff_account_created', details: { created_user: data.user.id, role: values.role } });
    return NextResponse.json({ staff: { id: data.user.id, full_name: values.full_name, email: values.email, role: values.role } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = message === 'UNAUTHENTICATED' ? 401 : message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: message.includes('already') ? 'An account already exists for that email.' : 'Could not create the staff account. Use a unique email and a password of at least 12 characters.' }, { status });
  }
}
