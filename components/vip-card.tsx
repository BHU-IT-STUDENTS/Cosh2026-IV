'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { Guest } from '@/lib/types';

export function VipCard({ guest, verificationUrl, photoUrl }: { guest: Guest; verificationUrl: string; photoUrl?: string | null }) {
  const [qr, setQr] = useState('');
  useEffect(() => { QRCode.toDataURL(verificationUrl, { width: 500, margin: 3, errorCorrectionLevel: 'H', color: { dark: '#142b25', light: '#fffdf7' } }).then(setQr); }, [verificationUrl]);
  return <article className="vip-card" id={`vip-card-${guest.id}`}>
    <div className="card-portrait" aria-hidden="true"><img src="/couple-portrait.jpg" alt="" /><div /></div>
    <header className="card-header"><div><p>Comfort <i>Weds</i> Shammah</p><small>17 October 2026 <b>·</b> Reception</small></div></header>
    <section className="card-identity card-identity-centered">
      <div><p className="guest-name">{guest.full_name}</p>{guest.designation && <p className="designation">{guest.designation}</p>}<p className="vip-number">VIP</p></div>
    </section>
    <section className="card-bottom card-qr-centered">{qr ? <img className="qr" src={qr} alt={`QR verification code for ${guest.full_name}`} /> : <div className="qr loading">Preparing<br />QR</div>}</section>
    <footer>Thank you for honouring our special day. May God’s abundant blessings rest upon you always.</footer>
  </article>;
}
