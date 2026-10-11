"use client";

import { OfflineDirectoryShortcut } from "@/components/offline-directory-shortcut";
import type { ReactNode } from "react";

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <><OfflineDirectoryShortcut />{children}</>;
}
