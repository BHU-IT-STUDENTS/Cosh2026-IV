'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const icons: Record<string, string> = {
  '#dashboard': '⌂',
  '#guest-form': '＋',
  '#guest-list': '⌕',
  '/admin/staff': '♙',
  '/account': '◉',
  '/check-in': '▣',
};

/** Adds an app-style, icon-led navigation bar to the existing admin sidebar. */
export function WorkspaceLinks() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/admin')) return;
    const nav = document.querySelector<HTMLElement>('.dashboard .sidebar nav');
    if (!nav) return;
    nav.classList.add('role-nav');
    nav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (icons[href]) link.dataset.navIcon = icons[href];
    });
    if (nav.querySelector('[data-admin-signout]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-signout';
    button.dataset.adminSignout = 'true';
    button.dataset.navIcon = '⇥';
    button.textContent = 'Sign out';
    button.addEventListener('click', async () => {
      button.setAttribute('disabled', 'true');
      await createClient().auth.signOut();
      window.location.assign('/login');
    });
    nav.appendChild(button);
  }, [pathname]);

  return <style jsx global>{`
    .dashboard .role-nav a, .dashboard .role-nav .nav-signout { display:flex; align-items:center; gap:11px; }
    .dashboard .role-nav a::before, .dashboard .role-nav .nav-signout::before { content:attr(data-nav-icon); display:inline-grid; place-items:center; width:21px; height:21px; color:#bb914c; font-size:20px; font-weight:700; line-height:1; }
    .dashboard .role-nav .nav-signout { width:100%; padding:11px 0; border:0; background:transparent; color:inherit; cursor:pointer; font:inherit; text-align:left; }
    .dashboard .role-nav .nav-signout:hover { color:#b44b42; }
    @media (max-width:760px) {
      .dashboard { padding-bottom:104px !important; }
      .dashboard .sidebar { display:block !important; position:fixed !important; z-index:40 !important; right:0 !important; bottom:0 !important; left:0 !important; width:auto !important; min-height:82px !important; padding:0 !important; background:#fffdf7 !important; border-top:1px solid #e7decc !important; box-shadow:0 -10px 30px rgba(25,48,40,.10) !important; }
      .dashboard .sidebar > :not(.role-nav) { display:none !important; }
      .dashboard .role-nav { display:flex !important; align-items:stretch !important; gap:0 !important; width:100% !important; height:82px !important; overflow-x:auto !important; scrollbar-width:none; }
      .dashboard .role-nav::-webkit-scrollbar { display:none; }
      .dashboard .role-nav a, .dashboard .role-nav .nav-signout { flex:0 0 78px !important; justify-content:center !important; gap:4px !important; padding:9px 5px !important; color:#43554c !important; font-size:10px !important; font-weight:700 !important; line-height:1.12 !important; text-align:center !important; white-space:normal !important; }
      .dashboard .role-nav a::before, .dashboard .role-nav .nav-signout::before { width:auto !important; height:25px !important; font-size:23px !important; }
    }
  `}</style>;
}
