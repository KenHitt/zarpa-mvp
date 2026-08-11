const STEPS = ['Exploras', 'Revisas', 'Pagas'] as const;

export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Pasos de reserva" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-forest/50">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const active = step === current;
        const done = step < current;
        return (
          <span key={label} className="flex items-center gap-2">
            {i > 0 && <span className="text-forest/25">→</span>}
            <span
              className={
                active
                  ? 'rounded-full bg-forest px-2.5 py-1 text-white'
                  : done
                    ? 'text-forest'
                    : 'text-forest/40'
              }
            >
              {step}. {label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
