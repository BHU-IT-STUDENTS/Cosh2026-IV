'use client';

import { useEffect } from 'react';

function greetingForJosTime() {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Africa/Lagos' }).format(new Date()));
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Jos and the rest of Nigeria use West Africa Time (Africa/Lagos). */
export function TimeAwareGreeting() {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('.admin-header h1');
    if (!heading) return;
    const name = heading.textContent?.replace(/^Good (morning|afternoon|evening),\s*/i, '').replace(/\.$/, '') || 'Admin';
    heading.textContent = `${greetingForJosTime()}, ${name}.`;
  }, []);
  return null;
}
