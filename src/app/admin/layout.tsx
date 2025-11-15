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
  
  // Don't apply AdminLayout to login and forgot-password pages
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }
  
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster position="top-right" />
    </>
  );
}
