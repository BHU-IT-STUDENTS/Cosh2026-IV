'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

/** Directly rendered navigation for every Protocol screen. */
export function ProtocolAppNav() {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign('/login');
  }

  return <><nav className="protocol-top-actions" aria-label="Protocol desktop navigation"><Link href="/check-in">Check-in</Link><Link href="/directory">VIP directory</Link><Link href="/account">Account</Link><button type="button" onClick={signOut}>⇥ Sign out</button></nav><nav className="protocol-app-nav" aria-label="Protocol navigation"><Link href="/check-in"><span aria-hidden="true">▣</span><small>Scan</small></Link><Link href="/directory"><span aria-hidden="true">⌕</span><small>VIPs</small></Link><Link href="/account"><span aria-hidden="true">◉</span><small>Account</small></Link><button type="button" onClick={signOut}><span aria-hidden="true">⇥</span><small>Sign out</small></button></nav><style jsx global>{`
    .protocol-top-actions { position:fixed; z-index:100; top:19px; right:max(4vw,25px); display:flex; align-items:center; gap:15px; }
    .protocol-top-actions a, .protocol-top-actions button { border:0; background:transparent; color:#173d32; cursor:pointer; font:700 12px/1 inherit; text-decoration:none; }
    .protocol-top-actions button { display:inline-flex; align-items:center; gap:5px; padding:9px 12px; border:1px solid #d8c79f; border-radius:999px; background:#fffdf7; }
    .protocol-top-actions button:hover { color:#9f453b; border-color:#b88d47; }
    .protocol-app-nav { display:none; }
    @media (min-width:801px) {
      /* The app nav replaces the older inline account/name controls on
         desktop, preventing two navigation rows from occupying one header. */
      .checkin-header > div, .directory-top > div { display:none !important; }
    }
    @media (max-width:800px) {
      .protocol-top-actions, .protocol-desktop-signout, .protocol-bottom-nav { display:none !important; }
      .checkin { padding-bottom:78px !important; }
      .protocol-directory { padding-bottom:78px; }
      .directory-top > div { display:none !important; }
      .protocol-app-nav { position:fixed; z-index:100; right:0; bottom:0; left:0; display:grid; grid-template-columns:repeat(4,1fr); min-height:70px; padding:7px max(10px,env(safe-area-inset-right)) calc(7px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left)); background:rgba(255,253,247,.98); border-top:1px solid rgba(183,144,85,.34); box-shadow:0 -8px 24px rgba(21,61,50,.10); }
      .protocol-app-nav a, .protocol-app-nav button { display:grid; place-items:center; gap:3px; border:0; background:transparent; color:#536258; cursor:pointer; font:700 10px/1.1 inherit; text-decoration:none; }
      .protocol-app-nav span { color:#b79055; font-size:22px; line-height:1; }
      .protocol-app-nav small { font:inherit; }
      body:has(.protocol-detail-layer) .protocol-app-nav,
      body:has(.modal-layer) .protocol-app-nav { display:none !important; }
      .protocol-detail-layer, .modal-layer { z-index:1200 !important; }
    }
  `}</style></>;
}
