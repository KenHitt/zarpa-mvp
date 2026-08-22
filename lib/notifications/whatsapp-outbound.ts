/** Envío de WhatsApp al cliente (Green API o Meta Cloud API). */

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('51')) return digits;
  if (digits.length === 9) return `51${digits}`;
  return digits;
}

/** Green API — popular en Perú/LATAM; enlaza tu WhatsApp Business una vez. */
async function sendViaGreenApi(phone: string, message: string): Promise<boolean> {
  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;
  if (!idInstance || !token) return false;

  const host = process.env.GREEN_API_HOST ?? 'https://7103.api.greenapi.com';
  const chatId = `${normalizePhone(phone)}@c.us`;

  const res = await fetch(`${host}/waInstance${idInstance}/sendMessage/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });

  if (!res.ok) {
    console.error('[whatsapp] Green API error:', await res.text());
    return false;
  }
  return true;
}

/** Meta WhatsApp Cloud API — requiere plantilla aprobada fuera de ventana 24h. */
async function sendViaMetaCloud(phone: string, message: string): Promise<boolean> {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const template = process.env.WHATSAPP_REVIEW_TEMPLATE;

  if (!token || !phoneNumberId) return false;

  const to = normalizePhone(phone);
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const body = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: { name: template, language: { code: 'es' } },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('[whatsapp] Meta Cloud error:', await res.text());
    return false;
  }
  return true;
}

export async function sendWhatsAppToCustomer(phone: string, message: string): Promise<boolean> {
  if (!phone?.trim()) return false;

  const viaGreen = await sendViaGreenApi(phone, message);
  if (viaGreen) return true;

  return sendViaMetaCloud(phone, message);
}

export function whatsAppOutboundConfigured() {
  return Boolean(
    (process.env.GREEN_API_ID_INSTANCE && process.env.GREEN_API_TOKEN) ||
      (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
  );
}
