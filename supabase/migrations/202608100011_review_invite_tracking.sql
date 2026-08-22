-- Seguimiento de invitaciones a reseñar (email + WhatsApp).

alter table public.bookings
  add column if not exists review_invite_email_sent_at timestamptz,
  add column if not exists review_invite_whatsapp_sent_at timestamptz;

create index if not exists bookings_review_invite_pending_idx
  on public.bookings (created_at)
  where review_invite_email_sent_at is null;
