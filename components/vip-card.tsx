'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import type { Guest } from '@/lib/types';
import { displaySeat } from '@/lib/card';

export function VipCard({ guest, verificationUrl, photoUrl }: { guest: Guest; verificationUrl: string; photoUrl?: string | null }) {
  const [qr, setQr] = useState('');
  useEffect(() => { QRCode.toDataURL(verificationUrl, { width: 500, margin: 3, errorCorrectionLevel: 'H', color: { dark: '#142b25', light: '#fffdf7' } }).then(setQr); }, [verificationUrl]);
  return <article className="vip-card" id={`vip-card-${guest.id}`}>
    <div className="card-topline" /><div className="card-corner">VIP INVITÉ</div>
    <header><span className="card-logo"><Image src="/wedding-logo.png" alt="CoSh2026 logo" width={72} height={72} /></span><div><p>Comfort Weds Shammah</p><small>17 October 2026 · Reception</small></div></header>
    <section className="card-identity">
      {photoUrl ? <img className="guest-photo" src={photoUrl} alt="" /> : <div className="guest-photo initials" aria-label="No guest photo">{guest.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>}
      <div><p className="guest-name">{guest.full_name}</p>{guest.designation && <p className="designation">{guest.designation}</p>}<p className="vip-number">{guest.vip_id}</p></div>
    </section>
    <section className="card-bottom"><div className="seating"><span>TABLE <b>{displaySeat(guest.table_number)}</b></span><i /><span>SEAT <b>{displaySeat(guest.seat_number)}</b></span></div>{qr ? <img className="qr" src={qr} alt={`QR verification code for ${guest.full_name}`} /> : <div className="qr loading">Preparing<br />QR</div>}</section>
    <footer>Present this card for respectful VIP verification.</footer>
  </article>;
}
