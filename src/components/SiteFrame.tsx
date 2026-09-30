'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <SmoothScroll enabled={!isAdminRoute}>
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </SmoothScroll>
  );
}