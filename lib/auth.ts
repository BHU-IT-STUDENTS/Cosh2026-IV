import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Profile } from '@/lib/types';

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  const { data: profile } = await createAdminClient().from('profiles').select('id, full_name, role').eq('id', user.id).single();
  if (!profile) throw new Error('UNAUTHORIZED');
  return { user, profile: profile as Profile };
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (auth.profile.role !== 'admin') throw new Error('FORBIDDEN');
  return auth;
}
