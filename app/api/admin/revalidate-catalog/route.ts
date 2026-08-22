import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminSession } from '@/lib/admin';

export async function POST() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  revalidateTag('catalog-experiences');
  revalidateTag('catalog-hotels');
  revalidateTag('reviews');

  for (const path of ['/', '/experiencias', '/hoteles', '/sitemap.xml']) {
    revalidatePath(path);
  }
  revalidatePath('/experiencias', 'layout');
  revalidatePath('/experiencias/[slug]', 'page');
  revalidatePath('/hoteles/[id]', 'page');

  return NextResponse.json({ ok: true });
}
