import type { PackageState } from '@/lib/types';
import { buildPackageShareUrl } from '@/lib/package-share';

export function whatsappPhone(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  return digits || null;
}

export function whatsappUrl(message: string) {
  const phone = whatsappPhone();
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function whatsappContactMessage() {
  return 'Hola Zarpa 👋 Tengo una consulta sobre tours en Tingo María.';
}

export function whatsappContactUrl() {
  return whatsappUrl(whatsappContactMessage());
}

export function hasWhatsApp() {
  return Boolean(whatsappPhone());
}

function fmtDate(iso: string) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const monthLabel = months[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthLabel}${year ? ` ${year}` : ''}`;
}

function nights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000));
}

function formatPackageLines(state: PackageState, total: number) {
  const lines: string[] = [];

  if (state.hotel) {
    const stayNights = nights(state.checkIn, state.checkOut);
    const hotelTotal = Number(state.hotel.price_per_night) * stayNights;
    lines.push(
      `🏨 ${state.hotel.name}`,
      `   ${fmtDate(state.checkIn)} → ${fmtDate(state.checkOut)} · ${stayNights} noche(s) · S/${hotelTotal}`
    );
  } else {
    lines.push('🏨 Sin hospedaje');
  }

  if (state.experiences.length) {
    lines.push('🌿 Experiencias:');
    for (const item of state.experiences) {
      lines.push(`• ${item.name} · ${fmtDate(item.date)} · S/${Number(item.price) * item.quantity}`);
    }
  } else {
    lines.push('🌿 Sin experiencias');
  }

  lines.push(`💰 Total estimado: S/${total}`);
  return lines;
}

export function buildReserveMessage(state: PackageState, total: number) {
  return [
    'Hola Zarpa 👋 Quiero reservar este viaje a Tingo María:',
    '',
    ...formatPackageLines(state, total),
    '',
    '¿Me ayudan a confirmar cupo y forma de pago?',
  ].join('\n');
}

export function buildShareMessage(state: PackageState, total: number) {
  const shareUrl = buildPackageShareUrl(state);
  return [
    'Mira el viaje que armé para Tingo María con Zarpa 🌴',
    '',
    ...formatPackageLines(state, total),
    '',
    `Abre el paquete aquí: ${shareUrl}`,
    '',
    '¿Te sumas?',
  ].join('\n');
}
