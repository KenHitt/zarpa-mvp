const CONSENT_KEY = 'zarpa-cookie-consent';
const CONSENT_EVENT = 'zarpa-consent-change';

export type ConsentValue = 'accepted' | 'rejected';

/** null = el visitante todavía no eligió (banner debe mostrarse). */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setStoredConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_KEY, value);
  // storage event no dispara en la misma pestaña; este evento sí, para que
  // GA4 y el tracking de eventos reaccionen sin recargar la página.
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(callback: (value: ConsentValue) => void) {
  function handler(event: Event) {
    callback((event as CustomEvent<ConsentValue>).detail);
  }
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
