'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PhotoUpload } from './photo-upload';
import type { Hotel } from '@/lib/types';

type Props = { hotel?: Hotel };

export function HotelForm({ hotel }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(hotel?.name ?? '');
  const [description, setDescription] = useState(hotel?.description ?? '');
  const [price, setPrice] = useState(hotel?.price_per_night?.toString() ?? '');
  const [location, setLocation] = useState(hotel?.location ?? "Tingo María, Huánuco");
  const [amenities, setAmenities] = useState(hotel?.amenities?.join(', ') ?? '');
  const [status, setStatus] = useState(hotel?.status ?? 'draft');
  const [photos, setPhotos] = useState<string[]>(hotel?.photos ?? []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const db = createClient();
    const payload = {
      name,
      description,
      price_per_night: Number(price),
      location,
      amenities: amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      photos,
      status,
    };
    const result = hotel
      ? await db.from('hotels').update(payload).eq('id', hotel.id)
      : await db.from('hotels').insert(payload).select('id').single();
    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    router.push('/admin/hoteles');
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <label className="block text-sm">
        Nombre
        <input required className="mt-1 w-full rounded-md border p-2" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">
        Descripción
        <textarea required rows={4} className="mt-1 w-full rounded-md border p-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Precio por noche (S/)
          <input required type="number" min={0} step="0.01" className="mt-1 w-full rounded-md border p-2" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="block text-sm">
          Estado
          <select className="mt-1 w-full rounded-md border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Borrador</option>
            <option value="active">Activo (visible en web)</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        Ubicación
        <input required className="mt-1 w-full rounded-md border p-2" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label className="block text-sm">
        Servicios (separados por coma)
        <input className="mt-1 w-full rounded-md border p-2" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Wi‑Fi, Desayuno, Piscina" />
      </label>
      <PhotoUpload folder="hoteles" nameHint={name} photos={photos} onChange={setPhotos} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button disabled={saving} type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
          {saving ? 'Guardando…' : hotel ? 'Guardar cambios' : 'Crear hotel'}
        </button>
        <button type="button" className="text-sm text-slate-600 underline" onClick={() => router.push('/admin/hoteles')}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
