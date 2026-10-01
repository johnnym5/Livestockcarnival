'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import InitialLoadOverlay from '@/components/InitialLoadOverlay';

const LiveChatWidget = dynamic(() => import('@/components/LiveChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <SmoothScroll enabled={!isAdminRoute && pathname !== '/'}>
      <InitialLoadOverlay isHomePage={pathname === '/'} />
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <LiveChatWidget />}
    </SmoothScroll>
  );
}
