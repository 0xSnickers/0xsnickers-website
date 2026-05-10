'use client';

import { useFont } from '@/i18n/FontContext';

export function FontBody({ children }: { children: React.ReactNode }) {
  const { font } = useFont();
  return (
    <body className={`min-h-screen bg-background font-${font} text-text antialiased overflow-x-hidden`}>
      {children}
    </body>
  );
}
