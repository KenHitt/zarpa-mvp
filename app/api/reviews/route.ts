import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type Payload = {
  experienceId?: string | null;
  hotelId?: string | null;
  authorName?: string;
  rating?: number;
  comment?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;

    const experienceId = body.experienceId?.trim() || null;
    const hotelId = body.hotelId?.trim() || null;
    const authorName = body.authorName?.trim() ?? '';
    const rating = Number(body.rating);
    const comment = body.comment?.trim() ?? '';

    // Debe apuntar a exactamente un producto.
    if ((!experienceId && !hotelId) || (experienceId && hotelId)) {
      throw Error('Reseña inválida');
    }
    if (authorName.length < 2 || authorName.length > 80) {
      throw Error('Escribe tu nombre (2 a 80 caracteres)');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw Error('Elige una calificación de 1 a 5 estrellas');
    }
    if (comment.length < 5 || comment.length > 1000) {
      throw Error('Tu comentario debe tener entre 5 y 1000 caracteres');
    }

    const db = createAdminClient();

    // Verifica que el producto exista y esté activo.
    if (experienceId) {
      const { data } = await db.from('experiences').select('id').eq('id', experienceId).eq('status', 'active').maybeSingle();
      if (!data) throw Error('La experiencia no está disponible');
    } else if (hotelId) {
      const { data } = await db.from('hotels').select('id').eq('id', hotelId).eq('status', 'active').maybeSingle();
      if (!data) throw Error('El hospedaje no está disponible');
    }

    const { error } = await db.from('reviews').insert({
      experience_id: experienceId,
      hotel_id: hotelId,
      author_name: authorName,
      rating,
      comment,
      status: 'pending',
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'No se pudo enviar la reseña' },
      { status: 400 }
    );
  }
}
