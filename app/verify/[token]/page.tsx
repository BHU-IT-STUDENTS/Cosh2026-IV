'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Brand } from '@/components/brand';
import type { Guest } from '@/lib/types';

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/verify/${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async response => {
        const body = await response.json();
        if (!response.ok) setError(body.error || 'This VIP card could not be verified.');
        else setGuest(body.guest);
      })
      .catch(() => setError('This card needs an internet connection to confirm VIP access. Please show it to the protocol team.'));
  }, [token]);

  return <main className="verify-page"><Brand /><section className="public-verify vip-entrance-pass">
    {!guest && !error && <p>Confirming your VIP invitation…</p>}
    {error && <><p className="eyebrow">VIP CARD UNAVAILABLE</p><h1>{error}</h1><p>Please present this card to an authorized protocol officer for assistance.</p></>}
    {guest && <><p className="eyebrow">COMFORT WEDS SHAMMAH</p><p className="valid-pill">● VIP ENTRANCE PASS</p><h1>Welcome, {guest.full_name}.</h1><p className="vip-entrance-message">This card grants you VIP entrance. Kindly present it to the protocol team when you arrive.</p><p className="vip-entrance-note">We are delighted to celebrate with you. May your time with us be beautiful and memorable.</p></>}
  </section></main>;
}
