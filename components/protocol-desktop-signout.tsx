'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';

/** Persistent desktop control; phones use the protocol bottom navigation. */
export function ProtocolDesktopSignout() {
  useEffect(() => {
    const tools = document.querySelector<HTMLElement>('.checkin-header > div');
    if (!tools || tools.querySelector('[data-protocol-signout]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'protocol-desktop-signout';
    button.dataset.protocolSignout = 'true';
    button.innerHTML = '<span aria-hidden="true">⇥</span> Sign out';
    button.addEventListener('click', async () => {
      await createClient().auth.signOut();
      window.location.assign('/login');
    });
    tools.appendChild(button);
  }, []);

  return <style jsx global>{`
    .protocol-desktop-signout { display:inline-flex; align-items:center; gap:7px; margin-left:14px; padding:8px 12px; border:1px solid #d8c79f; border-radius:999px; background:#fffdf7; color:#173d32; cursor:pointer; font:700 13px/1 inherit; }
    .protocol-desktop-signout span { color:#b88d47; font-size:18px; }
    .protocol-desktop-signout:hover { border-color:#b88d47; color:#9f453b; }
    @media (max-width:760px) { .protocol-desktop-signout { display:none; } }
  `}</style>;
}
