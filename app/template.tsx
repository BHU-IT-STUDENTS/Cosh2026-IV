"use client";

import type { ReactNode } from "react";
import { MobileExperiencePolish } from "@/components/mobile-experience-polish";
import { VipCardUsherNote } from "@/components/vip-card-usher-note";

export default function AppTemplate({ children }: { children: ReactNode }) {
  return <><MobileExperiencePolish /><VipCardUsherNote />{children}</>;
}
