'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/i18n/LanguageContext';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');

  if (isDocs) {
    return children;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 aurora-bg"></div>
      <div className="pointer-events-none fixed inset-0 z-0 aurora-overlay"></div>
      <div className="relative z-10">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </div>
    </>
  );
}
