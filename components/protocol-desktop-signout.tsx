'use client';

import { createClient } from '@/lib/supabase/browser';

/** Persistent desktop control; phones use the protocol bottom navigation. */
export function ProtocolDesktopSignout() {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign('/login');
  }

  return <><button type="button" className="protocol-desktop-signout" onClick={signOut}><span aria-hidden="true">⇥</span> Sign out</button><style jsx global>{`
    .protocol-desktop-signout { position:fixed; z-index:60; top:24px; right:28px; display:inline-flex; align-items:center; gap:7px; padding:10px 15px; border:1px solid #d8c79f; border-radius:999px; background:#fffdf7; color:#173d32; box-shadow:0 5px 16px rgba(26,48,38,.10); cursor:pointer; font:700 13px/1 inherit; }
    .protocol-desktop-signout span { color:#b88d47; font-size:19px; }
    .protocol-desktop-signout:hover { border-color:#b88d47; color:#9f453b; }
    @media (max-width:760px) { .protocol-desktop-signout { display:none; } }
  `}</style></>;
}
