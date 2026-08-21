'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type Props = {
  folder: 'hoteles' | 'experiencias';
  nameHint: string;
  photos: string[];
  onChange: (photos: string[]) => void;
};

export function PhotoUpload({ folder, nameHint, photos, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const db = createClient();
      const base = slugify(nameHint) || 'item';
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${folder}/${base}/${Date.now()}.${ext}`;
      const { error: upError } = await db.storage.from('catalog').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upError) throw upError;
      const { data } = db.storage.from('catalog').getPublicUrl(path);
      onChange([...photos, data.publicUrl]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Fotos
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1 block w-full text-sm"
          disabled={uploading}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {uploading && <p className="text-sm text-slate-500">Subiendo…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {photos.length > 0 && (
        <ul className="space-y-2">
          {photos.map((url, i) => (
            <li key={url} className="flex items-center gap-3 rounded-lg border border-slate-200 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-14 w-20 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-slate-500">{url}</p>
                {i === 0 && <p className="text-xs font-medium text-emerald-700">Portada (primera foto)</p>}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    className="text-xs font-medium text-emerald-700"
                    onClick={() => onChange([photos[i], ...photos.filter((_, j) => j !== i)])}
                  >
                    Usar como portada
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => onChange(photos.filter((_, j) => j !== i))}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
