'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

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
      /* The direct AdminAppNav owns phone navigation. Keeping the desktop
         sidebar out of this layout prevents it covering dashboard content. */
      .dashboard .sidebar { display:none !important; }
    }
  `}</style>;
}
