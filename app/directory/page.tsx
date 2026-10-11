'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toPng } from 'html-to-image';
import { Brand } from '@/components/brand';
import { VipCard } from '@/components/vip-card';
import { createClient } from '@/lib/supabase/browser';
import type { Guest, Profile } from '@/lib/types';

export default function ProtocolDirectory() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [details, setDetails] = useState<Guest | null>(null);
  const [preview, setPreview] = useState<{ guest: Guest; url: string } | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { (async () => {
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) { window.location.assign('/login'); return; }
    const [{ data: me }, response] = await Promise.all([
      client.from('profiles').select('id,full_name,role').eq('id', user.id).maybeSingle(),
      fetch('/api/guests', { cache: 'no-store' }),
    ]);
    if (me) setProfile(me as Profile);
    if (!response.ok) { setNotice('The VIP directory is unavailable. Please check your connection and try again.'); return; }
    const body = await response.json() as { guests: Guest[] };
    setGuests(body.guests);
  })(); }, []);

  useEffect(() => { let active = true; Promise.all(guests.filter(g => g.photo_path).map(async g => {
    const response = await fetch(`/api/guests/${g.id}/photo`);
    const body = response.ok ? await response.json() as { url?: string } : null;
    return [g.id, body?.url] as const;
  })).then(entries => { if (active) setPhotos(Object.fromEntries(entries.filter((entry): entry is [string, string] => Boolean(entry[1])))); }); return () => { active = false; }; }, [guests]);

  const filtered = useMemo(() => guests.filter(guest => `${guest.full_name} ${guest.vip_id} ${guest.table_number} ${guest.seat_number}`.toLowerCase().includes(query.toLowerCase())), [guests, query]);

  async function prepareDownload(guest: Guest) {
    setBusy(true); setNotice('');
    const response = await fetch(`/api/guests/${guest.id}/credential`);
    const body = await response.json();
    setBusy(false);
    if (!response.ok) { setNotice(body.error || 'Could not prepare this VIP card.'); return; }
    setPreview({ guest, url: body.verification_url });
  }

  async function downloadCard() {
    if (!preview) return;
    const card = document.getElementById(`vip-card-${preview.guest.id}`);
    if (!card) return;
    const image = await toPng(card, { pixelRatio: 3, backgroundColor: '#fffdf7', cacheBust: true });
    const link = document.createElement('a'); link.href = image; link.download = `${preview.guest.vip_id}-CoSh2026.png`; link.click();
  }

  async function signOut() { await createClient().auth.signOut(); window.location.assign('/login'); }
  if (!profile) return <main className="center-page"><Brand /><p>Opening the secure VIP directory…</p></main>;

  return <main className="protocol-directory"><header className="directory-top"><Brand /><div><span className="staff-dot" /> {profile.full_name || 'Protocol officer'} <Link href="/check-in">Check-in</Link><Link href="/account">Account</Link><button onClick={signOut}>Sign out</button></div></header><section className="directory-content"><p className="eyebrow">GUEST DIRECTORY</p><h1>VIP guest list</h1><p className="muted">Tap any VIP row to open their full identity details and photograph.</p>{notice && <p className="notice">{notice}<button onClick={() => setNotice('')}>×</button></p>}<div className="directory-toolbar"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, VIP ID, table…" aria-label="Search VIP directory" /><span>{filtered.length} VIP{filtered.length === 1 ? '' : 's'}</span></div><div className="protocol-directory-table"><table><thead><tr><th>Guest</th><th>VIP ID</th><th>Seating</th><th>Attendance</th><th>Photo</th><th /></tr></thead><tbody>{filtered.map(guest => <tr key={guest.id} onClick={() => setDetails(guest)}><td><b>{guest.full_name}</b><small>{guest.designation || 'VIP guest'}</small></td><td><code>{guest.vip_id}</code></td><td>Table {guest.table_number} · Seat {guest.seat_number}</td><td><span className={`status ${guest.status}`}>{guest.status === 'checked_in' ? 'Checked in' : 'Awaiting'}</span></td><td>{photos[guest.id] ? <img className="directory-photo" src={photos[guest.id]} alt={`Photo of ${guest.full_name}`} /> : <span className="no-photo">No photo</span>}</td><td onClick={event => event.stopPropagation()}><button className="redownload" onClick={() => prepareDownload(guest)} disabled={busy}>Re-download</button></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="empty">No VIPs match that search.</td></tr>}</tbody></table></div></section>{details && <div className="protocol-detail-layer" role="dialog" aria-modal="true" aria-label={`VIP details for ${details.full_name}`}><div className="protocol-detail-modal"><button className="modal-close" onClick={() => setDetails(null)} aria-label="Close details">×</button><p className="eyebrow">VIP IDENTITY DETAILS</p><div className="directory-detail"><div className="directory-detail-photo">{photos[details.id] ? <img src={photos[details.id]} alt={`Photo of ${details.full_name}`} /> : <span>{details.full_name.slice(0, 1)}</span>}</div><div><h2>{details.full_name}</h2><p>{details.designation || 'VIP guest'}</p><code>{details.vip_id}</code><div className="detail-seating"><span>TABLE <b>{details.table_number.padStart(2, '0')}</b></span><i /><span>SEAT <b>{details.seat_number.padStart(2, '0')}</b></span></div><p className={`detail-status ${details.status}`}>{details.status === 'checked_in' ? 'Checked in' : 'Awaiting first check-in'}</p><button className="button" onClick={() => prepareDownload(details)} disabled={busy}>Re-download VIP card</button></div></div></div></div>}{preview && <div className="modal-layer" role="dialog" aria-modal="true"><div className="card-modal"><button className="modal-close" onClick={() => setPreview(null)} aria-label="Close card">×</button><p className="eyebrow">READY TO DOWNLOAD</p><VipCard guest={preview.guest} verificationUrl={preview.url} /><div className="card-tools"><button className="button" onClick={downloadCard}>Download PNG</button><button className="outline-button" onClick={() => window.print()}>Print / save PDF</button></div></div></div>}</main>;
}
