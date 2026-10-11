"use client";

import { useEffect, useState } from "react";
import { openOfflineVipDirectory, type OfflineDirectoryGuest } from "@/components/offline-vip-directory-pdf";

type GuestResponse = { id: string; vip_id: string; full_name: string; designation?: string | null; table_number?: string | number | null; seat_number?: string | number | null; status?: string | null; first_checked_in_at?: string | null; photo_path?: string | null };

export default function OfflineDirectoryPage() {
  const [message, setMessage] = useState("Preparing the current VIP directory…");
  useEffect(() => {
    let active = true;
    async function createDirectory() {
      try {
        const response = await fetch("/api/guests", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load the VIP list.");
        const payload = await response.json();
        const guests: GuestResponse[] = Array.isArray(payload) ? payload : payload.guests ?? [];
        if (!guests.length) throw new Error("There are no VIPs in the directory yet.");
        if (active) setMessage(`Adding ${guests.length} VIP${guests.length === 1 ? "" : "s"} and their available photos…`);
        const directoryGuests: OfflineDirectoryGuest[] = await Promise.all(guests.map(async (guest) => {
          let photo_url: string | null = null;
          if (guest.photo_path) {
            try {
              const photoResponse = await fetch(`/api/guests/${guest.id}/photo`, { cache: "no-store" });
              if (photoResponse.ok) photo_url = (await photoResponse.json()).url ?? null;
            } catch { /* A missing image must not prevent an offline directory. */ }
          }
          return { ...guest, photo_url };
        }));
        if (!active) return;
        openOfflineVipDirectory(directoryGuests);
        setMessage("Your print dialog is open. Choose “Save as PDF” to keep the directory offline, then you may close this tab.");
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "The offline directory could not be prepared.");
      }
    }
    void createDirectory();
    return () => { active = false; };
  }, []);
  return <main style={{ minHeight: "100vh", padding: "8rem 1.5rem", background: "#f6f3eb", color: "#133c32", textAlign: "center" }}><p style={{ color: "#a77827", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".18em" }}>OFFLINE OPERATIONS</p><h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 7vw, 3.5rem)", margin: ".5rem 0 1rem" }}>Preparing VIP directory</h1><p style={{ maxWidth: 540, margin: "auto", color: "#53665e", lineHeight: 1.6 }}>{message}</p><button type="button" onClick={() => window.close()} style={{ marginTop: "2rem", padding: ".8rem 1.2rem", border: "1px solid #133c32", borderRadius: 8, background: "transparent", color: "#133c32", fontWeight: 700 }}>Close this tab</button></main>;
}
