import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-4xl text-forest sm:text-5xl">No encontramos esta página</h1>
      <p className="mt-4 max-w-md leading-7 text-forest/70">
        El enlace puede estar roto o el contenido ya no existe. Te llevamos de vuelta a las experiencias de Tingo
        María.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/experiencias" className="button">
          Ver experiencias
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest"
        >
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
