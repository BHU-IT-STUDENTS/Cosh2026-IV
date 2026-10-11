import type { ReactNode } from 'react';
import { ProtocolDirectoryStyle } from '@/components/protocol-directory-style';

export default function DirectoryLayout({ children }: { children: ReactNode }) {
  return <>{children}<ProtocolDirectoryStyle /></>;
}
