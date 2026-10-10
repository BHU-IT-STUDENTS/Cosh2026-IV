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

  return <><nav className="admin-app-nav" aria-label="Administrator navigation">
    {items.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? 'active' : ''}><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></Link>)}
    <button type="button" onClick={signOut}><span aria-hidden="true">⇥</span><small>Sign out</small></button>
    <style jsx global>{`
      .admin-app-nav { display:none; }
      @media (max-width:760px) {
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
