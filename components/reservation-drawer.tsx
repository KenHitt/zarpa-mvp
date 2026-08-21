'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePackage } from '@/components/package-provider';
import { ReservationPanel } from '@/components/reservation-panel';

const HIDDEN_ON = ['/checkout', '/reserva-confirmada'];

export function ReservationDrawer() {
  const pathname = usePathname();
  const { drawerOpen, closeDrawer } = usePackage();

  useEffect(() => {
    if (HIDDEN_ON.includes(pathname)) closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-forest/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu reserva"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#f7f7f4] shadow-[-12px_0_40px_rgba(17,50,35,.15)] transition-transform duration-300 ease-out sm:max-w-lg ${
          drawerOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-forest/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber">Tu viaje</p>
            <h2 className="font-display text-xl text-forest">Reserva</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest transition hover:bg-white"
            aria-label="Cerrar reserva"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ReservationPanel compact onNavigate={closeDrawer} />
        </div>
      </aside>
    </>
  );
}
