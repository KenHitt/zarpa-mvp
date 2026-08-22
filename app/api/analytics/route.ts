import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'experience_added',
  'hotel_selected',
  'checkout_started',
  'booking_created',
  'whatsapp_reserve',
  'whatsapp_share',
  'whatsapp_contact',
]);

export async function POST(request: Request) {
  try {
    // Límite generoso (navegación real genera muchos eventos): protege contra
    // flood de bots sin afectar el uso normal de un visitante.
    const allowed = await checkRateLimit(`analytics:${clientIp(request)}`, 120, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });
    }

    const data = await request.json();

    if (!ALLOWED_EVENTS.has(data.event_name) || typeof data.session_id !== 'string' || typeof data.path !== 'string') {
      return NextResponse.json({ error: 'Evento inválido' }, { status: 400 });
    }

    const db = createAdminClient();
    const { error } = await db.from('analytics_events').insert({
      session_id: data.session_id,
      event_name: data.event_name,
      path: data.path.slice(0, 200),
      entity_id: typeof data.entity_id === 'string' ? data.entity_id : null,
      metadata: typeof data.metadata === 'object' && data.metadata ? data.metadata : {},
    });
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'No se pudo registrar' }, { status: 400 });
  }
}
