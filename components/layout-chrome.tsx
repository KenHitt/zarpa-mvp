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
import { GoogleAnalytics } from './analytics-ga';
import { CookieConsent } from './cookie-consent';
import { BrandLogo } from './brand-logo';
import { businessInfo } from '@/lib/seo/site';

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
        <GoogleAnalytics />
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t border-forest/10 px-4 py-8 pb-24 text-center text-sm text-forest/70">
          <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
            <BrandLogo href="/" variant="full" className="h-16 sm:h-[4.5rem]" />
            <p>Tingo María, Huánuco</p>
            <p>
              <a className="underline hover:text-forest" href={`mailto:${businessInfo.email}`}>
                {businessInfo.email}
              </a>
              <span className="mx-2">·</span>
              <a className="underline hover:text-forest" href={`tel:${businessInfo.phone}`}>
                {businessInfo.phone}
              </a>
            </p>
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <a
              className="underline hover:text-amber"
              href="https://www.tiktok.com/@zarpa.travel"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <span>·</span>
            <a className="underline hover:text-forest" href="/guia">
              Guías de viaje
            </a>
            <span>·</span>
            <a className="underline hover:text-forest" href="/privacidad">
              Privacidad
            </a>
            <span>·</span>
            <a className="underline hover:text-forest" href="/terminos">
              Términos
            </a>
            <span>·</span>
            <a className="underline hover:text-forest" href="/partner/login">
              Operadores
            </a>
          </p>
        </footer>
        <TripBar />
        <ReservationDrawer />
        <WhatsAppFloat />
        <CookieConsent />
      </ToastProvider>
    </PackageProvider>
  );
}
