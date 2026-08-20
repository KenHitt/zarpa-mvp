import './globals.css';
import { LayoutChrome } from '@/components/layout-chrome';

export const metadata = {
  title: 'Zarpa | Aventuras en Tingo María',
  description: 'Arma tu viaje a Tingo María',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
