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
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>CoSh2026 VIP Offline Directory</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#133c32;font-family:Arial,sans-serif}.cover{min-height:250px;padding:30px;border:2px solid #c39a4e;background:linear-gradient(145deg,#123c32,#1f5949);color:#fff}.cover .eyebrow,.eyebrow{font-size:10px;letter-spacing:.2em;font-weight:700;color:#bc9348}.cover .eyebrow{color:#e6c987}.cover h1{font-family:Georgia,serif;font-size:34px;margin:18px 0 8px}.cover p{font-size:14px;line-height:1.55;max-width:500px}.generated{margin-top:32px;font-size:11px;opacity:.85}.guest-card{break-before:page;page-break-before:always;padding:18px;border:1px solid #d7cfbd;background:#fffdf8;min-height:260px}.card-number{font-size:10px;letter-spacing:.18em;color:#a77827;font-weight:700;border-bottom:1px solid #ddd2ba;padding-bottom:8px}.guest-content{display:flex;gap:20px;padding-top:18px}.guest-content img,.portrait{width:155px;height:190px;object-fit:cover;border:2px solid #c89d52;border-radius:8px;background:#eef0e9}.placeholder{display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;color:#66766e;font-size:12px}.details{flex:1}.details h2{font:700 27px Georgia,serif;margin:5px 0;color:#133c32}.designation{margin:0;color:#5c7168}.vip-id{color:#976b22;font-weight:bold;margin:18px 0}dl{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0}dt{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#718078}dd{margin:4px 0 0;font-weight:700;font-size:13px;color:#183d34}@media print{body{background:#fff}.no-print{display:none!important}}@media(max-width:600px){.guest-content{gap:12px}.guest-content img,.portrait{width:105px;height:140px}.details h2{font-size:21px}dl{grid-template-columns:1fr}}</style></head><body><section class="cover"><p class="eyebrow">COMFORT WEDS SHAMMAH</p><h1>VIP Offline Directory</h1><p>A complete, printable guest directory for reception operations. Keep this saved PDF on a device for use when the network is unavailable.</p><p><strong>${guests.length}</strong> VIP guest${guests.length === 1 ? "" : "s"} included.</p><p class="generated">Generated ${safe(now)}</p><button class="no-print" onclick="window.print()" style="padding:12px 18px;border:0;border-radius:6px;font-weight:bold;cursor:pointer">Save as PDF / Print</button></section>${cards}<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
  popup.document.close();
}
