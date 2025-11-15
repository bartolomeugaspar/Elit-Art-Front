'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply AdminLayout to login and forgot-password pages
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
    return children;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}
