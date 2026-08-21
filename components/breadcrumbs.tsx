import Link from 'next/link';

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-forest/60">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="font-medium text-forest/70 hover:text-forest hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-forest">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
