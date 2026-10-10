'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '@/components/brand';
import { createClient } from '@/lib/supabase/browser';

export default function Login() { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const router = useRouter();
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setMessage(''); const result = await createClient().auth.signInWithPassword({ email, password }); setBusy(false); if (result.error) return setMessage('Sign-in failed. Check your details or contact a wedding administrator.'); router.push('/admin'); router.refresh(); }
  return <main className="auth-page"><div className="auth-panel"><Brand /><p className="eyebrow">PRIVATE STAFF ACCESS</p><h1>Welcome back.</h1><p className="muted">Only accounts created by a CoSh2026 administrator can access this system.</p><form onSubmit={submit}><label>Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input required minLength={8} type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>{message && <p className="form-message">{message}</p>}<button className="button full" disabled={busy}>{busy ? 'Please wait…' : 'Sign in'}</button></form></div></main>; }
