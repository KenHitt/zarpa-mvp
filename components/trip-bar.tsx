'use client';

import { usePathname } from 'next/navigation';
import { usePackage } from './package-provider';

const HIDDEN_ON = ['/checkout', '/reserva-confirmada'];

export function TripBar() {
  const pathname = usePathname();
  const { hotel, experiences, total, openDrawer, drawerOpen } = usePackage();
  const count = experiences.length + (hotel ? 1 : 0);

  if (!count || HIDDEN_ON.includes(pathname) || drawerOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 px-4">
      <button
        type="button"
        onClick={openDrawer}
        className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-forest px-4 py-3 text-white shadow-[0_16px_40px_rgba(17,50,35,.3)] transition hover:bg-[#173c2d]"
      >
        <div className="text-left">
          <p className="text-xs text-white/65">
            Tu reserva · {count} {count === 1 ? 'item' : 'items'}
          </p>
          <p className="mt-0.5 text-sm font-semibold">S/{total} total</p>
        </div>
        <span className="rounded-full bg-amber px-3 py-2 text-sm font-bold text-forest">Ver reserva</span>
      </button>
    </div>
  );
}
