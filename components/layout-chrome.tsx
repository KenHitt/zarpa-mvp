'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PackageProvider } from './package-provider';
import { ToastProvider } from './toast-provider';
import { Header } from './header';
import { TripBar } from './trip-bar';
import { AnalyticsPageView } from './analytics-page-view';

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanel = pathname.startsWith('/admin') || pathname.startsWith('/partner');

  if (isPanel) {
    return <>{children}</>;
  }

  return (
    <PackageProvider>
      <ToastProvider>
        <AnalyticsPageView />
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t border-forest/10 px-4 py-8 pb-24 text-center text-sm text-forest/70">
          Zarpa · Tingo María, Huánuco
          <span className="mx-2">·</span>
          <a className="underline" href="/partner/login">
            Operadores
          </a>
        </footer>
        <TripBar />
      </ToastProvider>
    </PackageProvider>
  );
}
