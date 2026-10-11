import type { ReactNode } from 'react';
import { ProtocolDesktopSignout } from '@/components/protocol-desktop-signout';
import { ProtocolDirectoryLink } from '@/components/protocol-directory-link';

export default function CheckInLayout({ children }: { children: ReactNode }) {
  return <>{children}<ProtocolDesktopSignout /><ProtocolDirectoryLink /></>;
}
