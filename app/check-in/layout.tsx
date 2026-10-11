import type { ReactNode } from 'react';
import { ProtocolAppNav } from '@/components/protocol-app-nav';

export default function CheckInLayout({ children }: { children: ReactNode }) {
  return <>{children}<ProtocolAppNav /></>;
}
