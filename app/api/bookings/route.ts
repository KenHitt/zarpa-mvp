import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { notifyBookingCreated } from '@/lib/notifications/booking-created';

export const runtime = 'nodejs';

type Payload = {
  hotelId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  nights: number;
  experiences: { id: string; date: string; quantity: number }[];
};

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const raw = form.get('payload');
    if (typeof raw !== 'string') throw Error('Datos de viaje inválidos');

    const payload = JSON.parse(raw) as Payload;
    const name = form.get('customer_name');
    const phone = form.get('customer_phone');
    const email = form.get('customer_email');
    const method = form.get('payment_method');
    const hasHotel = !!payload.hotelId;

    const expectedNights =
      hasHotel && payload.checkIn && payload.checkOut
        ? Math.round((Date.parse(payload.checkOut) - Date.parse(payload.checkIn)) / 86400000)
        : 0;

    const invalidExperiences = payload.experiences.some(
      (x) =>
        !x.id ||
        !Number.isInteger(x.quantity) ||
        x.quantity < 1 ||
        x.quantity > 30 ||
        !x.date ||
        (hasHotel &&
          payload.checkIn &&
          payload.checkOut &&
          (x.date < payload.checkIn || x.date >= payload.checkOut))
    );

    if (
      !name ||
      !phone ||
      !email ||
      !['yape', 'plin'].includes(String(method)) ||
      (!hasHotel && !payload.experiences.length) ||
      (hasHotel && (expectedNights < 1 || payload.nights !== expectedNights)) ||
      (!hasHotel && payload.nights !== 0) ||
      invalidExperiences
    ) {
      throw Error('Completa los datos del viaje correctamente');
    }

    const proof = form.get('proof');
    if (!(proof instanceof File) || !proof.size) throw Error('Sube tu comprobante de pago');

    const db = createAdminClient();

    let hotel: null | { id: string; price_per_night: number; name: string } = null;
    if (hasHotel) {
      const result = await db
        .from('hotels')
        .select('id,price_per_night,name')
        .eq('id', payload.hotelId!)
        .eq('status', 'active')
        .single();
      hotel = result.data;
      if (!hotel) throw Error('El hotel ya no está disponible');
    }

    const ids = payload.experiences.map((x) => x.id);
    if (new Set(ids).size !== ids.length) throw Error('No repitas una experiencia en la reserva');

    const { data: experiences } = ids.length
      ? await db.from('experiences').select('id,price,name').in('id', ids).eq('status', 'active')
      : { data: [] };

    if ((experiences || []).length !== ids.length) throw Error('Una experiencia ya no está disponible');

    const total =
      (hotel ? Number(hotel.price_per_night) * payload.nights : 0) +
      (experiences || []).reduce(
        (s, x) => s + Number(x.price) * (payload.experiences.find((e) => e.id === x.id)?.quantity || 1),
        0
      );

    const { data: pkg, error: pkgError } = await db
      .from('packages')
      .insert({
        hotel_id: hotel?.id || null,
        check_in: payload.checkIn,
        check_out: payload.checkOut,
        nights: payload.nights,
        total_price: total,
      })
      .select()
      .single();

    if (pkgError) throw pkgError;

    if (ids.length) {
      const { error } = await db.from('package_experiences').insert(
        payload.experiences.map((x) => ({
          package_id: pkg.id,
          experience_id: x.id,
          date: x.date,
          quantity: x.quantity,
        }))
      );
      if (error) throw error;
    }

    const { data: booking, error: bookError } = await db
      .from('bookings')
      .insert({
        package_id: pkg.id,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        payment_method: method,
        total,
      })
      .select()
      .single();

    if (bookError) throw bookError;

    if (proof instanceof File && proof.size) {
      if (proof.size > 5_000_000) throw Error('El comprobante no puede superar 5 MB');
      const ext = proof.name.split('.').pop() || 'jpg';
      const path = `${booking.id}/comprobante.${ext}`;
      const { error: upError } = await db.storage.from('payment-proofs').upload(path, proof, {
        contentType: proof.type,
        upsert: false,
      });
      if (upError) throw upError;
      const { error } = await db.from('bookings').update({ payment_proof_url: path }).eq('id', booking.id);
      if (error) throw error;
    }

    const experienceDetails = payload.experiences.map((x) => {
      const exp = experiences?.find((e) => e.id === x.id);
      return {
        id: x.id,
        name: exp?.name ?? 'Experiencia',
        date: x.date,
        quantity: x.quantity,
      };
    });

    notifyBookingCreated({
      db,
      bookingId: booking.id,
      customerName: String(name),
      customerPhone: String(phone),
      customerEmail: String(email),
      paymentMethod: String(method),
      total,
      hotelId: hotel?.id ?? null,
      hotelName: hotel?.name,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights: payload.nights,
      experiences: experienceDetails,
    }).catch((err) => console.error('[notify] booking emails failed', err));

    return NextResponse.json({ id: booking.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'No se pudo crear la reserva' },
      { status: 400 }
    );
  }
}
