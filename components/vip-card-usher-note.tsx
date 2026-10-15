"use client";

import { useEffect } from "react";

const noteText = "Please show this card to any usher wearing an event tag. They will be pleased to welcome you and guide you to your seat.";

/** Adds the seating guidance directly below the VIP label in rendered card previews. */
export function VipCardUsherNote() {
  useEffect(() => {
    const addNotes = () => {
      document.querySelectorAll<HTMLElement>("[class*='card']").forEach((card) => {
        if (card.querySelector(".vip-usher-note")) return;
        const label = Array.from(card.querySelectorAll<HTMLElement>("span, p, div, strong")).find((element) => element.children.length === 0 && element.textContent?.trim() === "VIP");
        if (!label) return;
        label.textContent = "VIP CARD";
        const note = document.createElement("p");
        note.className = "vip-usher-note";
        note.textContent = noteText;
        label.insertAdjacentElement("afterend", note);
      });
    };
    addNotes();
    const observer = new MutationObserver(addNotes);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <style>{`
    .vip-usher-note { max-width: 29rem; margin: .7rem auto 1rem; color: #456057; font-family: Georgia, serif; font-size: .78rem; line-height: 1.42; text-align: center; }
    @media (max-width: 600px) { .vip-usher-note { max-width: 22rem; margin: .55rem auto .8rem; font-size: .7rem; } }
  `}</style>;
}
