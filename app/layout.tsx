import './globals.css';
import { LayoutChrome } from '@/components/layout-chrome';

export const metadata = {
  title: 'Zarpa | Aventuras en Tingo María',
  description: 'Arma tu viaje a Tingo María',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
