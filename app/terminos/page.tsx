import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CANCELLATION_POLICY } from '@/lib/copy';
import { pageMetadata } from '@/lib/seo/metadata';
import { businessInfo, siteName } from '@/lib/seo/site';

export const metadata: Metadata = pageMetadata({
  title: 'Términos y Condiciones',
  description: `Condiciones de reserva, pago y cancelación para tours y hospedaje reservados a través de ${siteName}.`,
  path: '/terminos',
});

export default function TermsAndConditions() {
  return (
    <article className="shell max-w-2xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Términos y Condiciones' }]} />
      <p className="eyebrow mt-6">Legal</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">Términos y Condiciones</h1>
      <p className="mt-4 text-sm text-forest/60">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

      <div className="mt-8 space-y-6 text-base leading-7 text-forest/80">
        <section>
          <h2 className="font-display text-2xl text-forest">1. Qué es {siteName}</h2>
          <p className="mt-3">
            {siteName} es un marketplace que conecta viajeros con operadores locales verificados de tours y
            hospedaje en Tingo María, Perú. Los servicios (transporte, guiado, hospedaje) los presta
            directamente el operador correspondiente; {siteName} facilita el descubrimiento, la reserva y el
            pago.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">2. Precios y moneda</h2>
          <p className="mt-3">
            Todos los precios se muestran en soles peruanos (S/) e incluyen lo indicado en cada experiencia u
            hospedaje. Los precios pueden cambiar sin previo aviso hasta que confirmes tu reserva.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">3. Proceso de reserva y pago</h2>
          <p className="mt-3">
            Actualmente aceptamos pagos mediante Yape o Plin. Al completar el formulario de reserva y subir tu
            comprobante de pago, tu cupo queda <strong>pendiente de confirmación</strong>: el operador
            correspondiente valida el pago y te contacta por correo o teléfono para confirmar. Si viajas desde
            fuera de Perú y no puedes pagar con Yape o Plin, escríbenos por WhatsApp para coordinar una
            alternativa antes de reservar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">4. Cambios y cancelaciones</h2>
          <p className="mt-3">{CANCELLATION_POLICY}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">5. Responsabilidad</h2>
          <p className="mt-3">
            Los servicios de transporte, guiado y hospedaje son prestados por operadores locales
            independientes. {siteName} verifica a sus operadores, pero no es responsable por eventos fuera de
            su control (clima, fuerza mayor, decisiones del operador durante el tour). Recomendamos viajar con
            seguro de viaje.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">6. Reseñas</h2>
          <p className="mt-3">
            Las reseñas publicadas son enviadas por viajeros y revisadas antes de publicarse para evitar spam
            o contenido inapropiado. Reflejan la opinión de quien las escribe, no la de {siteName}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">7. Contacto</h2>
          <p className="mt-3">
            Para consultas sobre estos términos, escríbenos a{' '}
            <a className="font-semibold text-forest underline" href={`mailto:${businessInfo.email}`}>
              {businessInfo.email}
            </a>{' '}
            o al {businessInfo.phone}.
          </p>
        </section>
      </div>
    </article>
  );
}
