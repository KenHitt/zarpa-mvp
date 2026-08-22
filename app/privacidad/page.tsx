import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/seo/metadata';
import { businessInfo, siteName } from '@/lib/seo/site';

export const metadata: Metadata = pageMetadata({
  title: 'Política de Privacidad',
  description: `Cómo ${siteName} recolecta, usa y protege tus datos personales al reservar tours y hospedaje en Tingo María.`,
  path: '/privacidad',
  noIndex: false,
});

export default function PrivacyPolicy() {
  return (
    <article className="shell max-w-2xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Política de Privacidad' }]} />
      <p className="eyebrow mt-6">Legal</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">Política de Privacidad</h1>
      <p className="mt-4 text-sm text-forest/60">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

      <div className="mt-8 space-y-6 text-base leading-7 text-forest/80">
        <p>
          En {siteName} nos toma en serio tu privacidad. Este documento explica qué información recolectamos
          cuando visitas nuestro sitio o reservas una experiencia u hospedaje en Tingo María, y cómo la
          usamos.
        </p>

        <section>
          <h2 className="font-display text-2xl text-forest">1. Datos que recolectamos</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Al reservar:</strong> nombre completo, teléfono, correo electrónico y el comprobante de
              pago (imagen) que subes para confirmar tu reserva.
            </li>
            <li>
              <strong>Al dejar una reseña:</strong> el nombre que decidas mostrar públicamente y tu comentario.
            </li>
            <li>
              <strong>De navegación:</strong> páginas visitadas, botones presionados (por ejemplo, "añadir
              experiencia" o "reservar por WhatsApp") y un identificador de sesión anónimo. No asociamos estos
              eventos a tu nombre, teléfono o correo.
            </li>
            <li>
              <strong>Cookies/analytics:</strong> usamos Google Analytics (GA4) para entender cómo se usa el
              sitio y mejorar la experiencia. Puedes rechazar estas cookies desde el aviso que aparece en tu
              primera visita.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">2. Para qué usamos tus datos</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>Procesar y confirmar tu reserva con el operador local correspondiente.</li>
            <li>Contactarte por correo o WhatsApp sobre el estado de tu reserva o para invitarte a dejar una reseña.</li>
            <li>Validar tu comprobante de pago con el operador (hotel o experiencia) que reservaste.</li>
            <li>Mejorar el sitio a partir de estadísticas agregadas y anónimas de uso.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">3. Con quién compartimos tus datos</h2>
          <p className="mt-3">
            Compartimos tus datos de contacto y comprobante de pago únicamente con el operador local (hotel o
            experiencia) de tu reserva, para que pueda confirmarla y coordinar tu visita. No vendemos ni
            alquilamos tus datos a terceros con fines publicitarios.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">4. Dónde se almacenan tus datos</h2>
          <p className="mt-3">
            Tus datos se almacenan en servidores de Supabase con acceso restringido por contraseña y
            políticas de seguridad a nivel de base de datos. El comprobante de pago se guarda en un espacio
            privado al que solo el operador de tu reserva y el equipo de {siteName} pueden acceder.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">5. Tus derechos</h2>
          <p className="mt-3">
            Puedes solicitar acceso, corrección o eliminación de tus datos personales escribiéndonos a{' '}
            <a className="font-semibold text-forest underline" href={`mailto:${businessInfo.email}`}>
              {businessInfo.email}
            </a>
            . Responderemos en un plazo razonable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">6. Contacto</h2>
          <p className="mt-3">
            Si tienes preguntas sobre esta política, escríbenos a{' '}
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
