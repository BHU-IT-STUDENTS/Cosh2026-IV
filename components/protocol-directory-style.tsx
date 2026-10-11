'use client';

export function ProtocolDirectoryStyle() {
  return <style jsx global>{`
    .protocol-directory { min-height:100vh; background:#faf8f1; color:#173d32; }
    .directory-top { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:18px clamp(20px,4vw,60px); background:#fffdf7; border-bottom:1px solid #e7decc; }
    .directory-top > div { display:flex; align-items:center; gap:14px; font-weight:700; }
    .directory-top a, .directory-top button { border:0; background:transparent; color:#173d32; cursor:pointer; font:inherit; text-decoration:none; }
    .directory-top button { color:#9f453b; }
    .directory-content { max-width:1360px; margin:0 auto; padding:52px clamp(20px,4vw,60px) 80px; }
    .directory-content h1 { margin:4px 0 8px; font-size:clamp(34px,5vw,58px); }
    .directory-toolbar { display:flex; justify-content:space-between; align-items:center; gap:18px; margin:34px 0 20px; }
    .directory-toolbar input { width:min(460px,100%); padding:14px 2px; border:0; border-bottom:1px solid #d8d1c1; background:transparent; color:#173d32; font:inherit; font-size:16px; outline:none; }
    .directory-toolbar span { color:#69766d; font-size:13px; font-weight:700; }
    .protocol-directory-table { overflow-x:auto; border:1px solid #e3dccd; background:#fffdf7; }
    .protocol-directory-table table { min-width:860px; width:100%; border-collapse:collapse; }
    .protocol-directory-table th { padding:15px 18px; color:#788178; font-size:11px; letter-spacing:.14em; text-align:left; text-transform:uppercase; }
    .protocol-directory-table td { padding:16px 18px; border-top:1px solid #e8e1d4; vertical-align:middle; }
    .protocol-directory-table tbody tr { cursor:pointer; transition:background .18s ease; }
    .protocol-directory-table tbody tr:hover { background:#f6f1e5; }
    .protocol-directory-table td b, .protocol-directory-table td small { display:block; }
    .protocol-directory-table td small { margin-top:4px; color:#778078; }
    .redownload { padding:9px 11px; border:1px solid #d6bd82; border-radius:8px; background:#fffdf7; color:#173d32; cursor:pointer; font:700 13px/1 inherit; white-space:nowrap; }
    .redownload:disabled { opacity:.55; cursor:wait; }
    /* Match the composed Admin identity dialog: an identifiable portrait
       alongside concise, scan-friendly guest information. */
    .directory-detail { display:grid; grid-template-columns:210px minmax(0,1fr); align-items:center; gap:28px; }
    .directory-detail-photo { width:210px; height:260px; min-height:0; overflow:hidden; border:3px solid #d6b16e; border-radius:8px; background:var(--sage-pale); box-shadow:0 12px 27px rgba(21,61,50,.18); display:grid; place-items:center; color:#173d32; font:600 72px var(--serif); }
    .directory-detail-photo img { display:block; width:210px; height:260px; min-height:0; object-fit:cover; }
    .directory-detail h2 { margin:0; font-size:38px; line-height:1.04; }
    .directory-detail p { margin:6px 0; color:#657169; }
    .directory-detail code { display:inline-block; margin:10px 0 0; color:#88693b; font:500 11px var(--mono); }
    .directory-detail .detail-seating { margin-top:22px; }
    .directory-detail .button { margin-top:16px; }
    @media (max-width:760px) {
      .directory-top { align-items:flex-start; padding:14px 18px; }
      .directory-top > div { flex-wrap:wrap; justify-content:flex-end; gap:8px 12px; font-size:12px; }
      .directory-content { padding:34px 18px 104px; }
      .directory-toolbar { align-items:stretch; flex-direction:column; margin:24px 0 16px; }
      .directory-toolbar input { width:100%; }
      .directory-detail { grid-template-columns:1fr; gap:18px; }
      .directory-detail-photo, .directory-detail-photo img { width:100%; height:min(55vh,390px); }
      .directory-detail h2 { font-size:33px; }
    }
  `}</style>;
}
