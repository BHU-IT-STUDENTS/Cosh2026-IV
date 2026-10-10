'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function WorkspaceLinks() {
  const path = usePathname();
  if (path === '/admin') return <aside className="workspace-links" aria-label="Administrator shortcuts"><span>ADMIN SHORTCUTS</span><Link href="/admin/staff">Staff &amp; access <b>→</b></Link><Link href="/account">My profile <b>→</b></Link></aside>;
  if (path === '/check-in') return <aside className="workspace-links protocol-link" aria-label="Protocol officer shortcut"><Link href="/account">My account <b>→</b></Link></aside>;
  return null;
}
