'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; message: string; hint?: string };

const ToastContext = createContext<(message: string, hint?: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, hint?: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, hint }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in pointer-events-auto max-w-sm rounded-2xl bg-forest px-4 py-3 text-center text-white shadow-lg"
            role="status"
          >
            <p className="text-sm font-semibold">{t.message}</p>
            {t.hint && <p className="mt-0.5 text-xs text-white/75">{t.hint}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
