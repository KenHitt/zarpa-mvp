'use client';

import { track } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from './whatsapp-icon';

type Props = {
  message: string;
  productId?: string;
  label?: string;
};

/** Botón de WhatsApp con el mensaje prellenado del producto que está viendo el usuario. */
export function WhatsAppProductButton({ message, productId, label = 'Consultar por WhatsApp' }: Props) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_contact', productId, { context: 'product_page' })}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-white px-4 py-2 text-sm font-semibold text-[#128C4A] transition hover:border-[#25D366] hover:bg-[#25D366]/5 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}
