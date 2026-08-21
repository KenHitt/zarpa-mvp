'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePackage } from '@/components/package-provider';

/** Enlaces antiguos /mi-paquete abren el panel lateral en la home. */
export default function MyPackage() {
  const router = useRouter();
  const { openDrawer } = usePackage();

  useEffect(() => {
    openDrawer();
    router.replace('/');
  }, [openDrawer, router]);

  return null;
}
