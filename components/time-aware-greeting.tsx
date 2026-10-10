'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';

/** A stable dashboard welcome that does not depend on client clock settings. */
export function TimeAwareGreeting() {
  useEffect(() => {
    let active = true;
    async function loadName() {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();
      if (!active || !user) return;
      const { data: profile } = await client.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      const suppliedName = profile?.full_name || (typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : '') || user.email?.split('@')[0] || 'Administrator';
      const firstName = suppliedName.trim().split(/\s+/)[0] || 'Administrator';
      document.documentElement.style.setProperty('--admin-welcome', JSON.stringify(`Welcome, ${firstName}.`));
    }
    loadName();
    return () => { active = false; };
  }, []);

  return <style jsx global>{`
    .admin-header h1 { font-size:0 !important; }
    .admin-header h1::after { content:var(--admin-welcome, 'Welcome, Administrator.'); color:#163c31; font-family:inherit; font-size:clamp(30px, 3vw, 48px); line-height:1.05; }
  `}</style>;
}
