import type { Metadata } from 'next';
import { AdminProviders } from '@/components/admin/AdminProviders';

export const metadata: Metadata = {
  title: 'Admin Analytics',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
