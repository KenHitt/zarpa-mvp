'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { decodePackageShare } from '@/lib/package-share';
import type { Experience, Hotel, PackageState } from '@/lib/types';

type Context = PackageState & {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  setHotel: (hotel: Hotel, inDate: string, outDate: string) => void;
  removeHotel: () => void;
  addExperience: (x: Experience, date?: string, quantity?: number) => void;
  setExperienceDate: (id: string, date: string) => void;
  setExperienceQuantity: (id: string, quantity: number) => void;
  removeExperience: (id: string) => void;
  clear: () => void;
  nights: number;
  total: number;
};

const PackageContext = createContext<Context | null>(null);
const empty: PackageState = { hotel: null, checkIn: '', checkOut: '', experiences: [] };

// Tope alineado con la validación de /api/bookings.
function clampQuantity(quantity: number) {
  return Math.min(30, Math.max(1, Math.round(quantity) || 1));
}

export function PackageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PackageState>(empty);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('p');

    if (shared) {
      const decoded = decodePackageShare(shared);
      if (decoded) {
        setState(decoded);
        localStorage.setItem('zarpa-package', JSON.stringify(decoded));
        sessionStorage.setItem('zarpa-imported-share', '1');
        setDrawerOpen(true);
      }
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const stored = localStorage.getItem('zarpa-package');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as PackageState;
          if (parsed && Array.isArray(parsed.experiences)) {
            setState({
              hotel: parsed.hotel ?? null,
              checkIn: parsed.checkIn ?? '',
              checkOut: parsed.checkOut ?? '',
              experiences: parsed.experiences,
            });
          }
        } catch {
          localStorage.removeItem('zarpa-package');
        }
      }
    }

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
      drawerOpen,
      openDrawer,
      closeDrawer,
      nights,
      total,
      setHotel: (hotel: Hotel, checkIn: string, checkOut: string) =>
        setState((s) => ({ ...s, hotel, checkIn, checkOut })),
      removeHotel: () => setState((s) => ({ ...s, hotel: null, checkIn: '', checkOut: '' })),
      addExperience: (experience: Experience, date?: string, quantity = 1) =>
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
                    quantity: clampQuantity(quantity),
                  },
                ],
              }
        ),
      setExperienceDate: (id: string, date: string) =>
        setState((s) => ({
          ...s,
          experiences: s.experiences.map((x) => (x.id === id ? { ...x, date } : x)),
        })),
      setExperienceQuantity: (id: string, quantity: number) =>
        setState((s) => ({
          ...s,
          experiences: s.experiences.map((x) => (x.id === id ? { ...x, quantity: clampQuantity(quantity) } : x)),
        })),
      removeExperience: (id: string) =>
        setState((s) => ({ ...s, experiences: s.experiences.filter((x) => x.id !== id) })),
      clear: () => setState(empty),
    };
  }, [state, drawerOpen, openDrawer, closeDrawer]);

  return <PackageContext.Provider value={value}>{children}</PackageContext.Provider>;
}

export const usePackage = () => {
  const c = useContext(PackageContext);
  if (!c) throw Error('PackageProvider missing');
  return c;
};
