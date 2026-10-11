"use client";

import type { ReactNode } from "react";
import { MobileExperiencePolish } from "@/components/mobile-experience-polish";

export default function AppTemplate({ children }: { children: ReactNode }) {
  return <><MobileExperiencePolish />{children}</>;
}
