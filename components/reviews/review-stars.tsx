type Props = {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' } as const;

/** Estrellas de solo lectura (soporta medias estrellas). */
export function ReviewStars({ value, size = 'md', className = '' }: Props) {
  const dimension = SIZE[size];
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return <Star key={i} fill={fill} className={dimension} />;
      })}
    </span>
  );
}

function Star({ fill, className }: { fill: number; className: string }) {
  const id = `star-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f5a524" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e1d8" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 17.27 5.82 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z"
      />
    </svg>
  );
}
