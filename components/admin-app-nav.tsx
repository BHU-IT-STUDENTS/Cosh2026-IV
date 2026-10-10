'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

const items = [
  { href: '/admin', icon: '⌂', label: 'Home' },
  { href: '/admin#guest-form', icon: '＋', label: 'Add VIP' },
  { href: '/admin#guest-list', icon: '⌕', label: 'VIPs' },
  { href: '/admin/staff', icon: '♙', label: 'Staff' },
  { href: '/account', icon: '◉', label: 'Account' },
];

/** A direct mobile app dock: it does not rely on the desktop sidebar. */
export function AdminAppNav() {
  const pathname = usePathname();
  if (!pathname.startsWith('/admin')) return null;

  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign('/login');
  }

  return <><button type="button" className="admin-sidebar-signout" onClick={signOut}><span aria-hidden="true">⇥</span> Sign out</button><nav className="admin-app-nav" aria-label="Administrator navigation">
    {items.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? 'active' : ''}><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></Link>)}
    <button type="button" onClick={signOut}><span aria-hidden="true">⇥</span><small>Sign out</small></button>
    <style jsx global>{`
      .admin-sidebar-signout { position:fixed; z-index:100; left:24px; bottom:24px; display:inline-flex; align-items:center; gap:7px; padding:11px 16px; border:1px solid #d8c79f; border-radius:999px; background:#fffdf7; color:#173d32; box-shadow:0 6px 20px rgba(26,48,38,.14); cursor:pointer; font:700 13px/1 inherit; }
      .admin-sidebar-signout span { color:#b88d47; font-size:19px; }
      .admin-sidebar-signout:hover { border-color:#b88d47; color:#9f453b; }
      .admin-app-nav { display:none; }
      @media (max-width:760px) {
        .admin-sidebar-signout { display:none; }
        .dashboard { padding-bottom:94px !important; }
        .admin-app-nav { display:flex !important; position:fixed !important; z-index:999 !important; right:0; bottom:0; left:0; height:78px; align-items:stretch; overflow-x:auto; background:#fffdf7; border-top:1px solid #e8decb; box-shadow:0 -10px 28px rgba(18,47,38,.13); }
        .admin-app-nav::-webkit-scrollbar { display:none; }
        .admin-app-nav a, .admin-app-nav button { flex:0 0 16.6667% !important; min-width:0 !important; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border:0; background:transparent; color:#536358; cursor:pointer; font:inherit; text-decoration:none; }
        .admin-app-nav span { display:grid; place-items:center; width:25px; height:25px; color:#b88d47; font-size:23px; font-weight:700; line-height:1; }
        .admin-app-nav small { font-size:10px; font-weight:750; line-height:1.1; white-space:nowrap; }
        .admin-app-nav .active { color:#143f33; }
        .admin-app-nav .active span { color:#143f33; }
        /* Identity/card dialogs must be fully readable; navigation returns
           immediately when the protocol or admin closes the dialog. */
        body:has(.protocol-detail-layer) .admin-app-nav,
        body:has(.modal-layer) .admin-app-nav { display:none !important; }
        .protocol-detail-layer, .modal-layer { z-index:1200 !important; }
      }
    `}</style>
  </nav></>;
}
