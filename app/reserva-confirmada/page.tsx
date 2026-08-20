import Link from 'next/link';
import { TrustStrip } from '@/components/trust-strip';

export default function Confirmation() {
  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber/20 text-3xl" aria-hidden>
        ✓
      </div>
      <p className="eyebrow mt-6">Reserva registrada</p>
      <h1 className="mt-2 font-display text-4xl text-forest">¡Tu aventura en Tingo María empieza aquí!</h1>
      <p className="mt-4 leading-7 text-forest/70">
        Recibimos tu solicitud. Un operador local confirmará tu pago pronto y te escribirá al teléfono o correo que
        dejaste.
      </p>
      <TrustStrip compact />
      <Link className="button mt-8" href="/experiencias" prefetch>
        Seguir explorando
      </Link>
    </section>
  );
}
