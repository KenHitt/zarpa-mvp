import type { SupabaseClient } from '@supabase/supabase-js';
import {
  sendCustomerBookingConfirmation,
  sendOperatorBookingAlert,
  type BookingEmailContext,
} from './booking-emails';

type NotifyInput = {
  db: SupabaseClient;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  total: number;
  hotelId: string | null;
  hotelName?: string;
  checkIn: string | null;
  checkOut: string | null;
  nights: number;
  experiences: { id: string; name: string; date: string; quantity: number }[];
};

async function operatorEmailsForBooking(
  db: SupabaseClient,
  hotelId: string | null,
  experienceIds: string[]
): Promise<string[]> {
  const authIds = new Set<string>();

  if (hotelId) {
    const { data } = await db.from('operators').select('auth_user_id').eq('linked_hotel_id', hotelId);
    for (const row of data ?? []) authIds.add(row.auth_user_id);
  }

  for (const expId of experienceIds) {
    const { data } = await db.from('operators').select('auth_user_id').eq('linked_experience_id', expId);
    for (const row of data ?? []) authIds.add(row.auth_user_id);
  }

  const emails = new Set<string>();
  for (const authUserId of Array.from(authIds)) {
    const { data, error } = await db.auth.admin.getUserById(authUserId);
    if (!error && data.user?.email) emails.add(data.user.email);
  }

  const fallback = process.env.ZARPA_OPS_EMAIL;
  if (!emails.size && fallback) emails.add(fallback);

  return Array.from(emails);
}

export async function notifyBookingCreated(input: NotifyInput) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarpa-mvp.vercel.app';
  const ctx: BookingEmailContext = {
    bookingId: input.bookingId,
    customerName: String(input.customerName),
    customerPhone: String(input.customerPhone),
    customerEmail: String(input.customerEmail),
    paymentMethod: String(input.paymentMethod),
    total: Number(input.total),
    hotelName: input.hotelName,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    nights: input.nights,
    experiences: input.experiences,
    partnerDashboardUrl: `${siteUrl.replace(/\/$/, '')}/partner/dashboard`,
  };

  const operatorEmails = await operatorEmailsForBooking(
    input.db,
    input.hotelId,
    input.experiences.map((e) => e.id)
  );

  const [customerOk, operatorOk] = await Promise.all([
    sendCustomerBookingConfirmation(ctx),
    sendOperatorBookingAlert(ctx, operatorEmails),
  ]);

  return { customerOk, operatorOk, operatorCount: operatorEmails.length };
}
