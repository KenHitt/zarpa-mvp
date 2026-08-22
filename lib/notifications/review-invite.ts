import type { SupabaseClient } from '@supabase/supabase-js';
import { getBookingReviewProducts, getBookingTripEndDate, hoursSince } from '@/lib/bookings/review-products';
import { sendEmail } from './booking-emails';
import { sendWhatsAppToCustomer, whatsAppOutboundConfigured } from './whatsapp-outbound';

const MIN_HOURS_AFTER_TRIP = Number(process.env.REVIEW_INVITE_MIN_HOURS ?? 24);
// Techo amplio (14 días por defecto): evita envíos absurdos a reservas muy antiguas
// sin perder invitaciones si el cron estuvo caído más de un ciclo.
const MAX_HOURS_AFTER_TRIP = Number(process.env.REVIEW_INVITE_MAX_HOURS ?? 336);

type BookingRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  package_id: string;
  created_at: string;
  review_invite_email_sent_at: string | null;
  review_invite_whatsapp_sent_at: string | null;
};

function esc(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildReviewInviteMessage(name: string, products: { label: string; href: string }[]) {
  const links = products.map((p) => `• ${p.label}: ${p.href}`).join('\n');
  return [
    `Hola ${name}! 🌿`,
    '',
    '¿Cómo estuvo tu experiencia con Zarpa en Tingo María?',
    '',
    'Tu opinión ayuda a otros viajeros. Déjanos tu reseña aquí:',
    links,
    '',
    '¡Gracias por viajar con nosotros!',
    'Equipo Zarpa',
  ].join('\n');
}

export async function sendReviewInviteEmail(
  customerName: string,
  customerEmail: string,
  products: { label: string; href: string }[]
) {
  const linksHtml = products
    .map(
      (p) =>
        `<li style="margin:8px 0"><a href="${esc(p.href)}" style="color:#1F4D3A;font-weight:bold">${esc(p.label)}</a> · <span style="color:#666">dejar reseña ⭐</span></li>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#18251e;max-width:520px">
      <p style="color:#E0A430;font-size:11px;font-weight:bold;letter-spacing:.15em">ZARPA · TINGO MARÍA</p>
      <h1 style="font-size:22px;margin:8px 0">¿Cómo estuvo tu viaje?</h1>
      <p>Hola ${esc(customerName)}, esperamos que hayas disfrutado Tingo María con Zarpa.</p>
      <p>Tu reseña ayuda a otros viajeros y a los operadores locales. Solo toma un minuto:</p>
      <ul style="padding-left:18px">${linksHtml}</ul>
      <p style="font-size:14px;color:#555">Gracias por confiar en Zarpa 🌴</p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: 'Zarpa · Cuéntanos cómo estuvo tu experiencia ⭐',
    html,
  });
}

async function shouldSendInvite(db: SupabaseClient, booking: BookingRow): Promise<boolean> {
  const mode = process.env.REVIEW_INVITE_AFTER ?? 'booking';
  let reference: Date;

  if (mode === 'booking') {
    reference = new Date(booking.created_at);
  } else {
    const tripEnd = await getBookingTripEndDate(db, booking.package_id);
    reference = tripEnd ?? new Date(booking.created_at);
  }

  const elapsed = hoursSince(reference);
  return elapsed >= MIN_HOURS_AFTER_TRIP && elapsed <= MAX_HOURS_AFTER_TRIP;
}

export async function processReviewInvites(db: SupabaseClient) {
  const { data: bookings, error } = await db
    .from('bookings')
    .select('id,customer_name,customer_phone,customer_email,package_id,created_at,review_invite_email_sent_at,review_invite_whatsapp_sent_at')
    .or('review_invite_email_sent_at.is.null,review_invite_whatsapp_sent_at.is.null')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) throw error;

  const results = { checked: 0, emailSent: 0, whatsappSent: 0, skipped: 0 };

  for (const row of (bookings ?? []) as BookingRow[]) {
    results.checked++;
    const eligible = await shouldSendInvite(db, row);
    if (!eligible) {
      results.skipped++;
      continue;
    }

    const products = await getBookingReviewProducts(db, row.id);
    if (!products.length) {
      results.skipped++;
      continue;
    }

    const message = buildReviewInviteMessage(row.customer_name, products);
    const now = new Date().toISOString();

    if (!row.review_invite_email_sent_at) {
      const ok = await sendReviewInviteEmail(row.customer_name, row.customer_email, products);
      if (ok) {
        await db.from('bookings').update({ review_invite_email_sent_at: now }).eq('id', row.id);
        results.emailSent++;
      }
    }

    if (!row.review_invite_whatsapp_sent_at && whatsAppOutboundConfigured()) {
      const ok = await sendWhatsAppToCustomer(row.customer_phone, message);
      if (ok) {
        await db.from('bookings').update({ review_invite_whatsapp_sent_at: now }).eq('id', row.id);
        results.whatsappSent++;
      }
    }
  }

  return results;
}
