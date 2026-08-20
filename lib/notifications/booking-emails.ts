type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn('[email] RESEND_API_KEY o EMAIL_FROM no configurados — correo omitido');
    return false;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error('[email] Error Resend:', await res.text());
    return false;
  }
  return true;
}

function esc(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type BookingEmailContext = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  total: number;
  hotelName?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  nights?: number;
  experiences: { name: string; date: string; quantity: number }[];
  partnerDashboardUrl: string;
};

export async function sendCustomerBookingConfirmation(ctx: BookingEmailContext) {
  const items: string[] = [];
  if (ctx.hotelName) {
    items.push(
      `<li><strong>Hospedaje:</strong> ${esc(ctx.hotelName)}${ctx.checkIn && ctx.checkOut ? ` (${esc(ctx.checkIn)} → ${esc(ctx.checkOut)}, ${ctx.nights} noche(s))` : ''}</li>`
    );
  }
  for (const exp of ctx.experiences) {
    items.push(
      `<li><strong>${esc(exp.name)}</strong> · ${esc(exp.date)} · ${exp.quantity} pax</li>`
    );
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#18251e;max-width:520px">
      <p style="color:#E0A430;font-size:11px;font-weight:bold;letter-spacing:.15em">ZARPA · TINGO MARÍA</p>
      <h1 style="font-size:22px;margin:8px 0">Recibimos tu reserva</h1>
      <p>Hola ${esc(ctx.customerName)}, tu solicitud ya está registrada. Un operador local confirmará tu pago pronto.</p>
      <ul style="padding-left:18px">${items.join('')}</ul>
      <p><strong>Total:</strong> S/${ctx.total.toFixed(2)} · <strong>Pago:</strong> ${esc(ctx.paymentMethod)}</p>
      <p style="font-size:14px;color:#555">Te contactaremos a este correo o al ${esc(ctx.customerPhone)} cuando validemos tu comprobante.</p>
      <p style="font-size:13px;color:#888;margin-top:24px">Gracias por elegir Zarpa.</p>
    </div>
  `;

  return sendEmail({
    to: ctx.customerEmail,
    subject: 'Zarpa · Recibimos tu reserva en Tingo María',
    html,
  });
}

export async function sendOperatorBookingAlert(ctx: BookingEmailContext, operatorEmails: string[]) {
  if (!operatorEmails.length) return false;

  const items: string[] = [];
  if (ctx.hotelName) items.push(`Hotel: ${ctx.hotelName}`);
  for (const exp of ctx.experiences) {
    items.push(`${exp.name} · ${exp.date} · ${exp.quantity} pax`);
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;max-width:520px">
      <h1 style="font-size:20px">Nueva reserva Zarpa</h1>
      <p><strong>${esc(ctx.customerName)}</strong> · S/${ctx.total.toFixed(2)} · ${esc(ctx.paymentMethod)}</p>
      <p>Tel: ${esc(ctx.customerPhone)} · Email: ${esc(ctx.customerEmail)}</p>
      <p style="margin:12px 0"><strong>Detalle:</strong><br/>${items.map(esc).join('<br/>')}</p>
      <p><a href="${esc(ctx.partnerDashboardUrl)}" style="display:inline-block;background:#1F4D3A;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">Confirmar en el panel</a></p>
      <p style="font-size:12px;color:#666">Reserva #${esc(ctx.bookingId.slice(0, 8))}…</p>
    </div>
  `;

  return sendEmail({
    to: operatorEmails,
    subject: `Nueva reserva · ${ctx.customerName} · S/${ctx.total}`,
    html,
  });
}
