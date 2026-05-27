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
      <div className="fixed inset-0 aurora-bg opacity-20 pointer-events-none z-0"></div>
      <div className="fixed inset-0 aurora-overlay pointer-events-none z-0"></div>
      <div className="relative z-10">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </div>
    </>
  );
}
