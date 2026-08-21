export async function revalidatePublicCatalog() {
  try {
    const res = await fetch('/api/admin/revalidate-catalog', { method: 'POST' });
    if (!res.ok) {
      console.warn('[catalog] No se pudo refrescar la web pública');
    }
  } catch {
    console.warn('[catalog] No se pudo refrescar la web pública');
  }
}
