'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Font = 'comic' | 'puhui';

type FontContextType = {
  font: Font;
  toggleFont: () => void;
  setFont: (font: Font) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<Font>('comic');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('font') as Font;
      if (saved && (saved === 'comic' || saved === 'puhui')) {
        setFontState(saved);
      }
    } catch (e) {
      console.error('Failed to access localStorage:', e);
    }
  }, []);

  const toggleFont = () => {
    const newFont = font === 'comic' ? 'puhui' : 'comic';
    setFontState(newFont);
    try {
      localStorage.setItem('font', newFont);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const setFont = (newFont: Font) => {
    setFontState(newFont);
    try {
      localStorage.setItem('font', newFont);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  return (
    <FontContext.Provider value={{ font, toggleFont, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
