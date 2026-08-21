'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PackageProvider } from './package-provider';
import { ToastProvider } from './toast-provider';
import { Header } from './header';
import { TripBar } from './trip-bar';
import { WhatsAppFloat } from './whatsapp-float';
import { ReservationDrawer } from './reservation-drawer';
import { AnalyticsPageView } from './analytics-page-view';
import { BrandLogo } from './brand-logo';

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
          <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
            <BrandLogo href="/" variant="full" className="h-16 sm:h-[4.5rem]" />
            <p>Tingo María, Huánuco</p>
          </div>
          <p className="mt-4">
            <a
              className="underline hover:text-amber"
              href="https://www.tiktok.com/@zarpa.travel"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <span className="mx-2">·</span>
            <a className="underline hover:text-forest" href="/partner/login">
              Operadores
            </a>
          </p>
        </footer>
        <TripBar />
        <ReservationDrawer />
        <WhatsAppFloat />
      </ToastProvider>
    </PackageProvider>
  );
}
