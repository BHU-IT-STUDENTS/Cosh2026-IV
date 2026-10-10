import type { ReactNode } from 'react';
import { WorkspaceLinks } from '@/components/workspace-links';
import { AdminAppNav } from '@/components/admin-app-nav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}<WorkspaceLinks /><AdminAppNav /></>;
}
