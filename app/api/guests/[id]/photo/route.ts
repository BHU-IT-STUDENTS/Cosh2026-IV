import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const admin = createAdminClient();
    const { data: guest, error } = await admin.from('vip_guests').select('photo_path').eq('id', id).is('archived_at', null).maybeSingle();
    if (error || !guest?.photo_path) return NextResponse.json({ url: null });
    const { data, error: signedUrlError } = await admin.storage.from('guest-photos').createSignedUrl(guest.photo_path, 60 * 10);
    if (signedUrlError) throw signedUrlError;
    return NextResponse.json({ url: data.signedUrl });
  } catch {
    return NextResponse.json({ error: 'Staff authentication is required.' }, { status: 401 });
  }
}
