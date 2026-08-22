import Link from 'next/link';
import { TrustStrip } from '@/components/trust-strip';
import { createAdminClient } from '@/lib/supabase/server';
import { getBookingReviewProducts } from '@/lib/bookings/review-products';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string } };

export default async function Confirmation({ searchParams }: Props) {
  const db = createAdminClient();
  const products = searchParams.id ? await getBookingReviewProducts(db, searchParams.id) : [];

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

      {products.length > 0 && (
        <div className="mt-10 rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-forest/10">
          <p className="font-display text-xl text-forest">Cuando vivas tu experiencia, ¡cuéntanos! ⭐</p>
          <p className="mt-2 text-sm leading-6 text-forest/70">
            Te enviaremos un recordatorio por correo y WhatsApp para dejar tu reseña. También puedes usar estos
            enlaces:
          </p>
          <ul className="mt-4 space-y-2">
            {products.map((product) => (
              <li key={product.label}>
                <Link
                  href={product.path}
                  className="flex items-center justify-between gap-3 rounded-xl border border-forest/10 px-4 py-3 text-sm font-semibold text-forest transition hover:border-forest/25 hover:bg-cream/40"
                >
                  {product.label}
                  <span className="text-amber">Reseñar →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link className="button mt-8" href="/experiencias" prefetch>
        Seguir explorando
      </Link>
    </section>
  );
}
