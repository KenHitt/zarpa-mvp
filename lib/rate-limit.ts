import { createAdminClient } from '@/lib/supabase/server';

/** IP del cliente detrás de Vercel/proxy. 'unknown' agrupa a quienes no la envían. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Ventana deslizante simple respaldada en Supabase (rate_limit_hits).
 * Si falla la infraestructura, permite la request (fail-open): preferimos
 * arriesgar spam a bloquear reservas reales por un error de conexión.
 */
export async function checkRateLimit(bucket: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    const db = createAdminClient();
    const since = new Date(Date.now() - windowMs).toISOString();

    // Limpieza perezosa: evita que la tabla crezca sin control para este bucket.
    await db.from('rate_limit_hits').delete().eq('bucket', bucket).lt('created_at', since);

    const { count } = await db
      .from('rate_limit_hits')
      .select('id', { count: 'exact', head: true })
      .eq('bucket', bucket)
      .gte('created_at', since);

    if ((count ?? 0) >= limit) return false;

    await db.from('rate_limit_hits').insert({ bucket });
    return true;
  } catch (error) {
    console.error('[rate-limit] error verificando límite, se permite por defecto', error);
    return true;
  }
}
