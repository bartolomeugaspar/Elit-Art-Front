'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply AdminLayout to login, forgot-password and reset-password pages
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password';
  
  return (
    <>
      {isAuthPage ? children : <AdminLayout>{children}</AdminLayout>}
      <Toaster position="top-right" />
    </>
  );
}
