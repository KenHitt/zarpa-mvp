'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PhotoUpload } from './photo-upload';
import type { Experience } from '@/lib/types';

type Props = { experience?: Experience };

export function ExperienceForm({ experience }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(experience?.name ?? '');
  const [description, setDescription] = useState(experience?.description ?? '');
  const [price, setPrice] = useState(experience?.price?.toString() ?? '');
  const [duration, setDuration] = useState(experience?.duration ?? '');
  const [meetingPoint, setMeetingPoint] = useState(experience?.meeting_point ?? 'Plaza de Armas de Tingo María');
  const [category, setCategory] = useState(experience?.category ?? 'Naturaleza');
  const [status, setStatus] = useState(experience?.status ?? 'draft');
  const [isFeatured, setIsFeatured] = useState(experience?.is_featured ?? false);
  const [photos, setPhotos] = useState<string[]>(experience?.photos ?? []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const db = createClient();
    const payload = {
      name,
      description,
      price: Number(price),
      duration,
      meeting_point: meetingPoint,
      category,
      photos,
      status,
      is_featured: isFeatured,
    };
    const result = experience
      ? await db.from('experiences').update(payload).eq('id', experience.id)
      : await db.from('experiences').insert(payload).select('id').single();
    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    router.push('/admin/experiencias');
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
          Precio (S/)
          <input required type="number" min={0} step="0.01" className="mt-1 w-full rounded-md border p-2" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="block text-sm">
          Duración
          <input required className="mt-1 w-full rounded-md border p-2" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Día completo" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Categoría
          <input required className="mt-1 w-full rounded-md border p-2" value={category} onChange={(e) => setCategory(e.target.value)} />
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
        Punto de encuentro
        <input required className="mt-1 w-full rounded-md border p-2" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Destacar en la home
      </label>
      <PhotoUpload folder="experiencias" nameHint={name} photos={photos} onChange={setPhotos} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button disabled={saving} type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
          {saving ? 'Guardando…' : experience ? 'Guardar cambios' : 'Crear experiencia'}
        </button>
        <button type="button" className="text-sm text-slate-600 underline" onClick={() => router.push('/admin/experiencias')}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
