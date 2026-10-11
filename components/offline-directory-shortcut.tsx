"use client";

import { useEffect } from "react";

/** Upgrades the legacy ZIP control until the directory screen itself is simplified. */
export function OfflineDirectoryShortcut() {
  useEffect(() => {
    const upgrade = () => {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
      const legacy = buttons.find((button) => /download\s+(selected\s+)?zip/i.test(button.textContent || ""));
      if (!legacy || legacy.dataset.offlineDirectory === "true") return;
      legacy.dataset.offlineDirectory = "true";
      legacy.textContent = "Download Offline VIP Directory (PDF)";
      legacy.setAttribute("aria-label", "Download Offline VIP Directory PDF");
      legacy.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.open("/admin/offline-directory", "_blank", "noopener,noreferrer");
      }, true);
    };
    upgrade();
    const observer = new MutationObserver(upgrade);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
