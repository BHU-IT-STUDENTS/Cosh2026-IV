import type { Metadata } from 'next';
import './globals.css';
import { WorkspaceLinks } from '@/components/workspace-links';

export const metadata: Metadata = { title: 'CoSh2026 | VIP Smart Management', description: 'VIP seating, QR cards and check-in for Comfort Weds Shammah.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><WorkspaceLinks />{children}</body></html>; }
