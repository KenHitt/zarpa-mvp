/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Evita que el sitio se cargue dentro de un <iframe> de otro dominio (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Evita que el navegador intente adivinar el tipo de un archivo distinto al declarado.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No filtra la URL completa de origen al navegar a otros sitios (solo el origen).
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Desactiva por defecto APIs sensibles del navegador que la web no usa.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-inline' es necesario por el script inline de inicialización de GA4.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default nextConfig;
