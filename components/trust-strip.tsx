export function TrustStrip({ compact = false }: { compact?: boolean }) {
  const items = [
    'Operadores locales verificados',
    'Pago Yape, Plin o tarjeta',
    'Confirmación en pocas horas',
  ];

  return (
    <ul
      className={
        compact
          ? 'flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-forest/55'
          : 'mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-forest/55'
      }
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
