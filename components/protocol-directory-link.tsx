'use client';

import { useEffect } from 'react';

/** Adds the read-only VIP directory to the protocol navigation surfaces. */
export function ProtocolDirectoryLink() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.checkin-header > div');
    if (header && !header.querySelector('[data-directory-link]')) {
      const link = document.createElement('a');
      link.href = '/directory'; link.dataset.directoryLink = 'true'; link.textContent = 'VIP directory';
      header.insertBefore(link, header.querySelector('[data-protocol-signout]') || null);
    }
    const nav = document.querySelector<HTMLElement>('.protocol-bottom-nav');
    if (nav && !nav.querySelector('[data-directory-link]')) {
      const link = document.createElement('a');
      link.href = '/directory'; link.dataset.directoryLink = 'true';
      link.innerHTML = '<span class="protocol-directory-icon" aria-hidden="true">⌕</span><span>VIPs</span>';
      nav.insertBefore(link, nav.children[2] || null);
    }
  }, []);

  return <style jsx global>{`
    @media (max-width:800px) {
      .protocol-bottom-nav { grid-template-columns:repeat(5,1fr) !important; }
      .protocol-bottom-nav .protocol-directory-icon { font-size:23px; line-height:21px; }
    }
  `}</style>;
}
