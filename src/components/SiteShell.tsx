'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ShapeGridBackground from '@/components/home/ShapeGridBackground';
import { HomeThemeProvider, type HomeTheme } from '@/components/home/HomeThemeContext';
import { LanguageProvider } from '@/i18n/LanguageContext';

type ShellVariant = 'default' | 'homeDark';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const isHome = pathname === '/';
  const [homeTheme, setHomeTheme] = useState<HomeTheme>('dark');

  useEffect(() => {
    if (!isHome) return;

    try {
      const savedTheme = localStorage.getItem('home-theme') as HomeTheme | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setHomeTheme(savedTheme);
      } else {
        localStorage.setItem('home-theme', 'dark');
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, [isHome]);

  const updateHomeTheme = (theme: HomeTheme) => {
    setHomeTheme(theme);

    try {
      localStorage.setItem('home-theme', theme);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const toggleHomeTheme = () => {
    updateHomeTheme(homeTheme === 'dark' ? 'light' : 'dark');
  };

  const shellVariant: ShellVariant = isHome && homeTheme === 'dark' ? 'homeDark' : 'default';

  if (isDocs) {
    return children;
  }

  return (
    <HomeThemeProvider value={{ isHome, homeTheme, setHomeTheme: updateHomeTheme, toggleHomeTheme }}>
      <div className={`relative min-h-[100dvh] overflow-x-clip ${shellVariant === 'homeDark' ? 'bg-slate-950' : ''}`}>
        <div className={`pointer-events-none fixed inset-0 z-0 ${shellVariant === 'homeDark' ? 'home-dark-aurora-bg' : 'aurora-bg'}`}></div>
        {isHome ? <ShapeGridBackground /> : null}
        <div className={`pointer-events-none fixed inset-0 z-0 ${shellVariant === 'homeDark' ? 'home-dark-aurora-overlay' : ''}`}></div>
        <div className={`relative z-10 ${shellVariant === 'homeDark' ? 'home-dark-shell text-slate-50' : ''}`}>
          <LanguageProvider>
            <Navbar variant={shellVariant} />
            {children}
          </LanguageProvider>
        </div>
      </div>
    </HomeThemeProvider>
  );
}
