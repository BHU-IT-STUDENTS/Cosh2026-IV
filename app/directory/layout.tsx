import type { ReactNode } from 'react';
import { ProtocolDirectoryStyle } from '@/components/protocol-directory-style';
import { ProtocolAppNav } from '@/components/protocol-app-nav';

export default function DirectoryLayout({ children }: { children: ReactNode }) {
  return <>{children}<ProtocolDirectoryStyle /><ProtocolAppNav /></>;
}
