import type { Hotel, PackageExperience, PackageState } from '@/lib/types';

type SharePayload = {
  v: 1;
  hotel: Omit<Hotel, 'photos' | 'amenities'> | null;
  checkIn: string;
  checkOut: string;
  experiences: Omit<PackageExperience, 'photos'>[];
};

function stripForShare(state: PackageState): SharePayload {
  return {
    v: 1,
    hotel: state.hotel
      ? {
          id: state.hotel.id,
          name: state.hotel.name,
          description: state.hotel.description,
          price_per_night: state.hotel.price_per_night,
          location: state.hotel.location,
          status: state.hotel.status,
        }
      : null,
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    experiences: state.experiences.map(({ photos: _photos, ...rest }) => rest),
  };
}

function toBase64Url(value: string) {
  const base64 =
    typeof btoa !== 'undefined'
      ? btoa(value)
      : Buffer.from(value, 'utf8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return typeof atob !== 'undefined'
    ? atob(padded)
    : Buffer.from(padded, 'base64').toString('utf8');
}

export function encodePackageShare(state: PackageState) {
  return toBase64Url(JSON.stringify(stripForShare(state)));
}

export function decodePackageShare(token: string): PackageState | null {
  try {
    const payload = JSON.parse(fromBase64Url(token)) as SharePayload;
    if (payload.v !== 1) return null;

    return {
      hotel: payload.hotel
        ? { ...payload.hotel, photos: [], amenities: [] }
        : null,
      checkIn: payload.checkIn ?? '',
      checkOut: payload.checkOut ?? '',
      experiences: payload.experiences.map((item) => ({ ...item, photos: [] })),
    };
  } catch {
    return null;
  }
}

export function buildPackageShareUrl(state: PackageState) {
  const base = (
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || ''
  ).replace(/\/$/, '');

  return `${base}/mi-paquete?p=${encodePackageShare(state)}`;
}
