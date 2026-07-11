'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type HomeTheme = 'dark' | 'light';

type HomeThemeContextType = {
  isHome: boolean;
  homeTheme: HomeTheme;
  setHomeTheme: (theme: HomeTheme) => void;
  toggleHomeTheme: () => void;
};

const HomeThemeContext = createContext<HomeThemeContextType | undefined>(undefined);

export function HomeThemeProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: HomeThemeContextType;
}) {
  return <HomeThemeContext.Provider value={value}>{children}</HomeThemeContext.Provider>;
}

export function useHomeTheme() {
  const context = useContext(HomeThemeContext);

  if (context === undefined) {
    throw new Error('useHomeTheme must be used within a HomeThemeProvider');
  }

  return context;
}
