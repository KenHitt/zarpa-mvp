'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Algo salió mal</p>
      <h1 className="mt-4 font-display text-4xl text-forest sm:text-5xl">Tuvimos un problema al cargar la página</h1>
      <p className="mt-4 max-w-md leading-7 text-forest/70">
        Puedes intentarlo de nuevo. Si el problema sigue, escríbenos por WhatsApp y te ayudamos a reservar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="button">
          Intentar de nuevo
        </button>
        <Link
          href="/experiencias"
          className="inline-flex min-h-11 items-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest"
        >
          Ver experiencias
        </Link>
      </div>
    </section>
  );
}
