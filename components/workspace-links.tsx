'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function WorkspaceLinks() {
  const path = usePathname();
  const [adminNav, setAdminNav] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (path !== '/admin') { setAdminNav(null); return; }
    const findNav = () => setAdminNav(document.querySelector<HTMLElement>('.sidebar nav'));
    findNav();
    const observer = new MutationObserver(findNav);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [path]);

  if (path === '/admin' && adminNav) return createPortal(<><Link href="/admin/staff">Staff &amp; access</Link><Link href="/account">My profile</Link></>, adminNav);
  if (path === '/check-in') return <aside className="workspace-links protocol-link" aria-label="Protocol officer shortcut"><Link href="/account">My account <b>→</b></Link></aside>;
  return null;
}
