'use client';

/** A stable dashboard welcome that does not depend on client clock settings. */
export function TimeAwareGreeting() {
  return <style jsx global>{`
    .admin-header h1 { font-size:0 !important; }
    .admin-header h1::after { content:'Welcome, Administrator.'; color:#163c31; font-family:inherit; font-size:clamp(30px, 3vw, 48px); line-height:1.05; }
  `}</style>;
}
