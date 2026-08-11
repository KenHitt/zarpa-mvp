'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Experience, Hotel, PackageState } from '@/lib/types';

type Context = PackageState & {
  setHotel: (hotel: Hotel, inDate: string, outDate: string) => void;
  removeHotel: () => void;
  addExperience: (x: Experience, date?: string) => void;
  setExperienceDate: (id: string, date: string) => void;
  removeExperience: (id: string) => void;
  clear: () => void;
  nights: number;
  total: number;
};

const PackageContext = createContext<Context | null>(null);
const empty: PackageState = { hotel: null, checkIn: '', checkOut: '', experiences: [] };

export function PackageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PackageState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('zarpa-package');
    if (stored) setState(JSON.parse(stored));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('zarpa-package', JSON.stringify(state));
  }, [state, ready]);

  const value = useMemo<Context>(() => {
    const nights =
      state.checkIn && state.checkOut
        ? Math.max(0, Math.round((new Date(state.checkOut).getTime() - new Date(state.checkIn).getTime()) / 86400000))
        : 0;
    const total =
      (state.hotel ? Number(state.hotel.price_per_night) * nights : 0) +
      state.experiences.reduce((s, x) => s + Number(x.price) * x.quantity, 0);

    return {
      ...state,
      nights,
      total,
      setHotel: (hotel: Hotel, checkIn: string, checkOut: string) =>
        setState((s) => ({ ...s, hotel, checkIn, checkOut })),
      removeHotel: () => setState((s) => ({ ...s, hotel: null, checkIn: '', checkOut: '' })),
      addExperience: (experience: Experience, date?: string) =>
        setState((s) =>
          s.experiences.some((x) => x.id === experience.id)
            ? s
            : {
                ...s,
                experiences: [
                  ...s.experiences,
                  {
                    ...experience,
                    date: date || s.checkIn || new Date().toISOString().slice(0, 10),
                    quantity: 1,
                  },
                ],
              }
        ),
      setExperienceDate: (id: string, date: string) =>
        setState((s) => ({
          ...s,
          experiences: s.experiences.map((x) => (x.id === id ? { ...x, date } : x)),
        })),
      removeExperience: (id: string) =>
        setState((s) => ({ ...s, experiences: s.experiences.filter((x) => x.id !== id) })),
      clear: () => setState(empty),
    };
  }, [state]);

  return <PackageContext.Provider value={value}>{children}</PackageContext.Provider>;
}

export const usePackage = () => {
  const c = useContext(PackageContext);
  if (!c) throw Error('PackageProvider missing');
  return c;
};
