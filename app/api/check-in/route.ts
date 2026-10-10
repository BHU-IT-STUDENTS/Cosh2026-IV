import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    await requireUser(); const { guest_id, note } = await request.json();
    if (typeof guest_id !== 'string') return NextResponse.json({ error: 'Guest is required.' }, { status: 400 });
    // Call with the officer's authenticated cookie session. The SQL function uses
    // auth.uid() to record exactly which officer confirmed this guest.
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('confirm_check_in', { p_guest_id: guest_id, p_note: typeof note === 'string' ? note.slice(0, 300) : null });
    if (error) throw error;
    return NextResponse.json({ guest: data });
  } catch (error) { const m = error instanceof Error ? error.message : ''; return NextResponse.json({ error: m === 'UNAUTHENTICATED' ? 'Sign in required.' : 'Check-in was not recorded. Confirm your connection and try again.' }, { status: m === 'UNAUTHENTICATED' ? 401 : 400 }); }
}
