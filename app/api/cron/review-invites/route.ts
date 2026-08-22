import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { processReviewInvites } from '@/lib/notifications/review-invite';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === 'development';

  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

/** Cron horario: envía invitaciones a reseñar ~24h después del viaje. */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const db = createAdminClient();
    const results = await processReviewInvites(db);
    return NextResponse.json({ ok: true, ...results });
  } catch (e) {
    console.error('[cron/review-invites]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error procesando invitaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
