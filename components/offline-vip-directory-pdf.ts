"use client";

export type OfflineDirectoryGuest = {
  vip_id: string;
  full_name: string;
  designation?: string | null;
  table_number?: string | number | null;
  seat_number?: string | number | null;
  status?: string | null;
  first_checked_in_at?: string | null;
  photo_url?: string | null;
};

/**
 * Opens a print-ready directory. Browsers expose this as "Save as PDF", which
 * keeps the resulting file available without an internet connection.
 */
export function openOfflineVipDirectory(guests: OfflineDirectoryGuest[]) {
  // The action is already opened in its own tab. Reuse that tab when a browser
  // blocks a second automatic pop-up after the directory data has loaded.
  const popup = window.open("", "_blank", "noopener,noreferrer") || window;
  const now = new Intl.DateTimeFormat("en-NG", { dateStyle: "full", timeStyle: "short" }).format(new Date());
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" };
  const safe = (value: unknown) => String(value ?? "—").replace(/[&<>'\"]/g, (character) => entities[character]);
  const cards = guests.map((guest, index) => {
    const image = guest.photo_url ? `<img src="${safe(guest.photo_url)}" alt="${safe(guest.full_name)}" />` : `<div class="portrait placeholder">No photo provided</div>`;
    const attendance = guest.status === "checked_in" ? "Checked in" : "Awaiting arrival";
    const checkedAt = guest.first_checked_in_at ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(guest.first_checked_in_at)) : "Not checked in";
    return `<article class="guest-card"><div class="card-number">VIP ${String(index + 1).padStart(3, "0")}</div><div class="guest-content">${image}<div class="details"><p class="eyebrow">VIP GUEST</p><h2>${safe(guest.full_name)}</h2><p class="designation">${safe(guest.designation || "VIP guest")}</p><p class="vip-id">${safe(guest.vip_id)}</p><dl><div><dt>Attendance</dt><dd>${attendance}</dd></div><div><dt>Check-in record</dt><dd>${safe(checkedAt)}</dd></div><div><dt>Table</dt><dd>${safe(guest.table_number)}</dd></div><div><dt>Seat</dt><dd>${safe(guest.seat_number)}</dd></div></dl></div></div></article>`;
  }).join("");
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>CoSh2026 VIP Offline Directory</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#133c32;font-family:Arial,sans-serif}.cover{padding:18px 22px 16px;border:2px solid #c39a4e;border-bottom:5px solid #c39a4e;background:linear-gradient(135deg,#123c32,#235b4c);color:#fff}.cover .eyebrow,.eyebrow{font-size:9px;letter-spacing:.2em;font-weight:700;color:#bc9348}.cover .eyebrow{color:#e6c987}.cover h1{font-family:Georgia,serif;font-size:29px;margin:7px 0}.cover p{font-size:12px;line-height:1.45;max-width:600px;margin:5px 0}.generated{font-size:10px!important;opacity:.85}.guest-card{break-inside:avoid;page-break-inside:avoid;margin:10px 0;padding:12px 14px;border:1px solid #d7cfbd;border-left:4px solid #c39a4e;background:#fffdf8;box-shadow:0 2px 8px rgba(25,57,47,.06)}.card-number{font-size:9px;letter-spacing:.18em;color:#a77827;font-weight:700;border-bottom:1px solid #e5dccb;padding-bottom:6px}.guest-content{display:flex;gap:15px;padding-top:10px}.guest-content img,.portrait{width:110px;height:132px;object-fit:cover;border:2px solid #c89d52;border-radius:6px;background:#eef0e9}.placeholder{display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;color:#66766e;font-size:11px}.details{flex:1;min-width:0}.details h2{font:700 22px Georgia,serif;margin:2px 0;color:#133c32}.designation{margin:0;color:#5c7168;font-size:12px}.vip-id{color:#976b22;font-weight:bold;font-size:12px;margin:10px 0}dl{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px;margin:0}dt{font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#718078}dd{margin:2px 0 0;font-weight:700;font-size:11px;color:#183d34}@media print{body{background:#fff}.no-print{display:none!important}}@media(max-width:600px){.guest-content{gap:10px}.guest-content img,.portrait{width:90px;height:112px}.details h2{font-size:18px}dl{grid-template-columns:1fr}}</style></head><body><section class="cover"><p class="eyebrow">COMFORT WEDS SHAMMAH</p><h1>VIP Offline Directory</h1><p>A complete, printable guest directory for reception operations. Keep this saved PDF on a device for use when the network is unavailable.</p><p><strong>${guests.length}</strong> VIP guest${guests.length === 1 ? "" : "s"} included.</p><p class="generated">Generated ${safe(now)}</p><button class="no-print" onclick="window.print()" style="padding:12px 18px;border:0;border-radius:6px;font-weight:bold;cursor:pointer">Save as PDF / Print</button></section>${cards}<script>window.onload=()=>{const images=Array.from(document.images);Promise.all(images.map(image=>image.complete?Promise.resolve():new Promise(resolve=>{image.onload=image.onerror=resolve}))).then(()=>setTimeout(()=>window.print(),150))}</script></body></html>`);
  popup.document.close();
}
