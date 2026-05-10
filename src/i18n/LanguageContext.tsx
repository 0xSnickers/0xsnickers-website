'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, zh, Translation } from './translations';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  t: Translation;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('language') as Language;
      if (saved && (saved === 'en' || saved === 'zh')) {
        setLanguageState(saved);
      } else {
        localStorage.setItem('language', 'en');
      }
    } catch (e) {
      console.error('Failed to access localStorage:', e);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguageState(newLang);
    try {
      localStorage.setItem('language', newLang);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const t = language === 'en' ? en : zh;

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
