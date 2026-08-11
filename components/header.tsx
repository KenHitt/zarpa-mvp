'use client';

import Link from 'next/link';
import { usePackage } from './package-provider';

export function Header() {
  const { hotel, experiences } = usePackage();
  const items = experiences.length + (hotel ? 1 : 0);

  return (
    <header className="sticky top-0 z-20 border-b border-forest/10 bg-[#f7f7f4]/90 backdrop-blur">
      <nav className="shell flex h-[72px] items-center justify-between gap-3">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-forest sm:text-3xl">
          Zarpa
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold text-forest sm:gap-5">
          <Link className="hover:text-amber" href="/experiencias">
            Experiencias
          </Link>
          <Link className="hover:text-amber" href="/hoteles">
            Hospedaje
          </Link>
          <Link
            href="/mi-paquete"
            className="rounded-full border border-forest/15 px-3 py-2 transition hover:border-forest sm:px-3.5"
          >
            Tu reserva{items ? ` · ${items}` : ''}
          </Link>
        </div>
      </nav>
    </header>
  );
}
