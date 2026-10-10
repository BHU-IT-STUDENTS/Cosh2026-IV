import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const schema = z.object({ full_name: z.string().trim().min(2).max(120), password: z.string().min(12).max(128).optional() });
export async function PATCH(request: NextRequest) {
  try {
    const { user, profile } = await requireUser(); const values = schema.parse(await request.json()); const admin = createAdminClient();
    const authUpdate = await admin.auth.admin.updateUserById(user.id, { password: values.password, user_metadata: { full_name: values.full_name } });
    if (authUpdate.error) throw authUpdate.error;
    const { error } = await admin.from('profiles').update({ full_name: values.full_name }).eq('id', user.id);
    if (error) throw error;
    await admin.from('audit_events').insert({ actor_id: user.id, action: 'personal_account_updated', details: { name_changed: profile.full_name !== values.full_name, password_changed: Boolean(values.password) } });
    return NextResponse.json({ profile: { ...profile, full_name: values.full_name } });
  } catch { return NextResponse.json({ error: 'Could not update your account. Passwords must have at least 12 characters.' }, { status: 400 }); }
}
