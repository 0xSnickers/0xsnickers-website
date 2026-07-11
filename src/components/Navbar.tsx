'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Moon,
  NotebookPen,
  Sun,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/i18n/LanguageContext';
import { useFont, Font } from '@/i18n/FontContext';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { useHomeTheme } from '@/components/home/HomeThemeContext';

export default function Navbar({ variant = 'default' }: { variant?: 'default' | 'homeDark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { font, setFont } = useFont();
  const { isHome, homeTheme, toggleHomeTheme } = useHomeTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
  ];

  const fontOptions: { value: Font; label: string }[] = [
    { value: 'comic', label: 'Comic Neue' },
    { value: 'puhui', label: 'PuHuiTi' },
  ];
  const isHomeDark = variant === 'homeDark';
  const nextThemeLabel = homeTheme === 'dark' ? t.navbar.themeLight : t.navbar.themeDark;
  const ThemeIcon = homeTheme === 'dark' ? Sun : Moon;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className={`w-full transition-all duration-500 ${
        scrolled
          ? isHomeDark
            ? 'bg-slate-950/58 shadow-[0_18px_42px_-30px_rgba(2,6,23,0.95)] backdrop-blur-2xl'
            : 'bg-white/80 shadow-[0_18px_42px_-32px_rgba(14,116,144,0.32)] backdrop-blur-xl'
          : isHomeDark
            ? 'bg-transparent'
            : ''
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-4">
            <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setIsOpen(false)}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_10px_25px_rgba(14,165,233,0.28)] sm:h-11 sm:w-11">
                <Image
                  src="/images/favicon.jpg"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={`truncate text-[1.35rem] font-bold leading-none sm:text-2xl ${isHomeDark ? 'text-slate-50' : 'text-text'}`}>
                {t.navbar.brand}
              </span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <ToggleSwitch
                options={fontOptions}
                current={font}
                onChange={setFont}
                buttonLabel={t.navbar.font}
                variant={variant}
              />
              <ToggleSwitch
                options={languageOptions}
                current={language}
                onChange={setLanguage}
                variant={variant}
              />
              {isHome ? (
                <button
                  onClick={toggleHomeTheme}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold backdrop-blur-md transition-all hover:-translate-y-0.5 ${
                    isHomeDark
                      ? 'border border-white/10 bg-slate-950/48 text-slate-100 shadow-[0_16px_38px_rgba(2,6,23,0.24)] hover:border-sky-300/28 hover:bg-slate-900/62 hover:text-white'
                      : 'border border-primary/20 bg-white/85 text-text shadow-[0_10px_30px_rgba(14,165,233,0.16)] hover:border-primary/35 hover:bg-white hover:text-primary hover:shadow-[0_14px_34px_rgba(14,165,233,0.24)]'
                  }`}
                  aria-label={nextThemeLabel}
                  title={nextThemeLabel}
                >
                  <ThemeIcon className="h-4.5 w-4.5" />
                  <span>{nextThemeLabel}</span>
                </button>
              ) : null}
              <Link
                href="/docs"
                className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold backdrop-blur-md transition-all hover:-translate-y-0.5 ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/48 text-slate-100 shadow-[0_16px_38px_rgba(2,6,23,0.24)] hover:border-sky-300/28 hover:bg-slate-900/62 hover:text-white'
                    : 'border border-primary/20 bg-white/85 text-text shadow-[0_10px_30px_rgba(14,165,233,0.16)] hover:border-primary/35 hover:bg-white hover:text-primary hover:shadow-[0_14px_34px_rgba(14,165,233,0.24)]'
                }`}
                aria-label={t.navbar.docs}
                title={t.navbar.docs}
              >
                <NotebookPen className="h-4.5 w-4.5 transition-transform group-hover:-rotate-6" />
                <span>{t.navbar.docs}</span>
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 md:hidden">
              <button
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className={`inline-flex min-h-10 min-w-[4.1rem] items-center justify-center rounded-2xl px-3 py-2 text-sm font-semibold backdrop-blur-md transition-colors ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/48 text-slate-200 hover:bg-slate-900/62'
                    : 'border border-border/50 bg-white/76 text-text/70 hover:bg-white'
                }`}
                aria-label="Toggle language"
              >
                {language === 'en' ? '中文' : 'EN'}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl p-2.5 backdrop-blur-md transition-colors ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/48 hover:bg-slate-900/62'
                    : 'border border-border/50 bg-white/76 hover:bg-white'
                }`}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className={`h-5 w-5 ${isHomeDark ? 'text-slate-100' : 'text-text'}`} />
                ) : (
                  <Menu className={`h-5 w-5 ${isHomeDark ? 'text-slate-100' : 'text-text'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="px-4 pb-4 sm:px-6">
                <div className={`space-y-3 rounded-3xl p-3 backdrop-blur-xl ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/78 shadow-[0_22px_54px_rgba(2,6,23,0.42)]'
                    : 'border border-white/50 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.12)]'
                }`}>
                  <button
                    onClick={() => setFont(font === 'comic' ? 'puhui' : 'comic')}
                    className={`flex min-h-11 w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold transition-colors ${
                      isHomeDark
                        ? 'border border-white/10 bg-white/6 text-slate-100 hover:bg-white/10'
                        : 'border border-border/60 bg-white/80 text-text/75 hover:bg-white'
                    }`}
                  >
                    <span>{t.navbar.font}</span>
                    <span className={`text-sm ${isHomeDark ? 'text-slate-400' : 'text-text/55'}`}>{font === 'comic' ? 'Comic Neue' : 'PuHuiTi'}</span>
                  </button>

                  {isHome ? (
                    <button
                      onClick={toggleHomeTheme}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left font-semibold backdrop-blur-md transition-colors ${
                        isHomeDark
                          ? 'border border-white/10 bg-white/6 text-slate-100 hover:bg-white/10 hover:text-white'
                          : 'border border-primary/20 bg-white/90 text-text shadow-[0_10px_28px_rgba(14,165,233,0.16)] hover:bg-white hover:text-primary'
                      }`}
                    >
                      <span>{nextThemeLabel}</span>
                      <ThemeIcon className="h-4.5 w-4.5 shrink-0" />
                    </button>
                  ) : null}


                  <Link
                    href="/docs"
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold backdrop-blur-md transition-colors ${
                      isHomeDark
                        ? 'border border-white/10 bg-white/6 text-slate-100 hover:bg-white/10 hover:text-white'
                        : 'border border-primary/20 bg-white/90 text-text shadow-[0_10px_28px_rgba(14,165,233,0.16)] hover:bg-white hover:text-primary'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <NotebookPen className="h-4.5 w-4.5" />
                    <span>{t.navbar.docs}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
