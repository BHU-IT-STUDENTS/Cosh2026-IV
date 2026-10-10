'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Brand } from '@/components/brand';
import { createClient } from '@/lib/supabase/browser';
import type { Profile } from '@/lib/types';

export default function AccountPage() { const [profile, setProfile] = useState<Profile | null>(null); const [name, setName] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { (async () => { const { data: { user } } = await createClient().auth.getUser(); if (!user) return location.href = '/login'; const { data } = await createClient().from('profiles').select('id,full_name,role').eq('id', user.id).single(); if (data) { setProfile(data as Profile); setName(data.full_name || ''); } })(); }, []);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setMessage(''); const response = await fetch('/api/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: name, ...(password ? { password } : {}) }) }); const body = await response.json(); setBusy(false); if (!response.ok) return setMessage(body.error || 'Could not update your account.'); setProfile(body.profile); setPassword(''); setMessage('Your account details have been updated.'); }
  if (!profile) return <main className="center-page"><Brand /><p>Loading your secure account…</p></main>;
  return <main className="auth-page"><div className="auth-panel"><Brand /><Link className="text-link" href={profile.role === 'admin' ? '/admin' : '/check-in'}>← Back to workspace</Link><p className="eyebrow account-eyebrow">MY ACCOUNT</p><h1>Personal details</h1><p className="muted">You are signed in as an <b>{profile.role}</b>. Leave password blank to keep the current one.</p><form onSubmit={submit}><label>Display name<input required value={name} onChange={e => setName(e.target.value)} /></label><label>New password<input type="password" minLength={12} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /><small>Use at least 12 characters.</small></label>{message && <p className="form-message">{message}</p>}<button className="button full" disabled={busy}>{busy ? 'Updating…' : 'Save account changes'}</button></form></div></main>;
}
