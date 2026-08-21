import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Río Derrepente · Catarata Derrepente Tingo María',
  description: 'Información sobre el río Derrepente y la catarata Derrepente en Tingo María. Reserva tu tour con operadores locales.',
  path: '/guia/rio-derrepente',
  keywords: ['rio derrepente', 'catarata derrepente', 'derrepente tingo maria'],
});

export default function RioDerrepenteRedirect() {
  redirect('/guia/catarata-derrepente');
}
