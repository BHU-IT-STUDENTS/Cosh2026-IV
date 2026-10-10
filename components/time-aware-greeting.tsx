'use client';

import { useEffect } from 'react';

/** A stable dashboard welcome that does not depend on client clock settings. */
export function TimeAwareGreeting() {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('.admin-header h1');
    if (!heading) return;
    const name = heading.textContent?.replace(/^Good (morning|afternoon|evening),\s*/i, '').replace(/\.$/, '').trim() || 'Administrator';
    heading.style.setProperty('--admin-welcome', JSON.stringify(`Welcome, ${name}.`));
  }, []);

  return <style jsx global>{`
    .admin-header h1 { font-size:0 !important; }
    .admin-header h1::after { content:var(--admin-welcome, 'Welcome, Administrator.'); color:#163c31; font-family:inherit; font-size:clamp(30px, 3vw, 48px); line-height:1.05; }
  `}</style>;
}
