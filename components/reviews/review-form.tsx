'use client';

import { useState } from 'react';

type Props = {
  experienceId?: string;
  hotelId?: string;
  productName: string;
};

export function ReviewForm({ experienceId, hotelId, productName }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!rating) {
      setError('Elige cuántas estrellas le das.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ experienceId, hotelId, authorName, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error || 'No se pudo enviar la reseña');
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la reseña');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div className="mt-4 rounded-2xl border border-[#25D366]/25 bg-[#25D366]/10 p-5 text-sm text-forest">
        <strong>¡Gracias por tu reseña!</strong> La revisaremos y se publicará muy pronto.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest"
      >
        Escribir una reseña
      </button>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={submit} className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest/10">
      <p className="font-semibold text-forest">Cuéntanos tu experiencia en {productName}</p>

      <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            className="p-0.5"
            aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
            aria-pressed={rating === n}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
              <path
                fill={n <= shown ? '#f5a524' : '#e5e1d8'}
                d="M12 17.27 5.82 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z"
              />
            </svg>
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium text-forest">
        Tu nombre
        <input
          className="input mt-1"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Ej. María de Lima"
          maxLength={80}
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-forest">
        Tu comentario
        <textarea
          className="input mt-1"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te gustó? ¿Cómo estuvo el guía, el transporte, el paisaje?"
          maxLength={1000}
          required
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="button min-h-11 disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando…' : 'Enviar reseña'}
        </button>
        <button type="button" className="text-sm text-forest/60 underline" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
      <p className="mt-3 text-xs text-forest/50">
        Tu reseña se publica tras una revisión rápida para evitar spam.
      </p>
    </form>
  );
}
