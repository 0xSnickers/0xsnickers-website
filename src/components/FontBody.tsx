'use client';

import { useFont } from '@/i18n/FontContext';

export function FontBody({ children }: { children: React.ReactNode }) {
  const { font } = useFont();
  const fontClass = font === 'puhui' ? 'font-puhui' : 'font-comic';

  return (
    <body className={`min-h-screen bg-background ${fontClass} text-text antialiased overflow-x-hidden`}>
      {children}
    </body>
  );
}
