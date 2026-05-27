'use client';

import { usePathname } from 'next/navigation';
import { useFont } from '@/i18n/FontContext';

export function FontBody({ children }: { children: React.ReactNode }) {
  const { font } = useFont();
  const pathname = usePathname();
  const fontClass = font === 'puhui' ? 'font-puhui' : 'font-comic';
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const themeClass = isDocs
    ? 'bg-fd-background text-fd-foreground'
    : 'bg-background text-text';

  return (
    <body className={`min-h-screen ${themeClass} ${fontClass} antialiased overflow-x-hidden`}>
      {children}
    </body>
  );
}
