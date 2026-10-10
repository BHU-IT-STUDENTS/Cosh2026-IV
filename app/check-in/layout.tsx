import type { ReactNode } from 'react';
import { ProtocolDesktopSignout } from '@/components/protocol-desktop-signout';

export default function CheckInLayout({ children }: { children: ReactNode }) {
  return <>{children}<ProtocolDesktopSignout /></>;
}
