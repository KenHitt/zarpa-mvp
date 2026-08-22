'use client';

import { getStoredConsent } from '@/lib/cookie-consent';

const STORAGE_KEY = 'zarpa-session-id';

type EventName =
  | 'page_view'
  | 'experience_added'
  | 'hotel_selected'
  | 'checkout_started'
  | 'booking_created'
  | 'whatsapp_reserve'
  | 'whatsapp_share'
  | 'whatsapp_contact';

function sessionId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function track(
  event_name: EventName,
  entity_id?: string,
  metadata: Record<string, string | number | boolean> = {}
) {
  // Respeta la elección del banner de cookies: sin aceptación explícita, no registramos nada.
  if (getStoredConsent() !== 'accepted') return;

  try {
    fetch('/api/analytics', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId(),
        event_name,
        entity_id,
        path: window.location.pathname,
        metadata,
      }),
    });

    if (event_name !== 'page_view' && typeof window.gtag === 'function') {
      window.gtag('event', event_name, { entity_id, ...metadata });
    }
  } catch {
    // Analytics nunca debe romper la experiencia del usuario.
  }
}
