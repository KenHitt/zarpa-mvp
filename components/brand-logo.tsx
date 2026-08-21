import Link from 'next/link';
import Image from 'next/image';

type Props = {
  href?: string;
  variant?: 'full' | 'mark';
  className?: string;
  priority?: boolean;
};

const assets = {
  full: { src: '/brand/logotipo.png', width: 168, height: 44, className: 'h-10 w-auto sm:h-11' },
  mark: { src: '/brand/icono.png', width: 44, height: 44, className: 'h-10 w-10 object-contain' },
} as const;

export function BrandLogo({ href = '/', variant = 'full', className = '', priority = false }: Props) {
  const asset = assets[variant];

  const image = (
    <Image
      src={asset.src}
      alt="Zarpa · Turismo en Tingo María"
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={`${asset.className} ${className}`.trim()}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} prefetch className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
