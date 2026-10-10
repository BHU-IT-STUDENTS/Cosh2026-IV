import type { ReactNode } from 'react';
import { WorkspaceLinks } from '@/components/workspace-links';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}<WorkspaceLinks /></>;
}
