'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  NotebookPen,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/i18n/LanguageContext';
import { useFont, Font } from '@/i18n/FontContext';
import { ToggleSwitch } from '@/components/ToggleSwitch';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { font, setFont } = useFont();

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className={`w-full transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl' : ''
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
              <span className="truncate text-[1.35rem] font-bold leading-none text-text sm:text-2xl">
                {t.navbar.brand}
              </span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <ToggleSwitch
                options={fontOptions}
                current={font}
                onChange={setFont}
                buttonLabel={t.navbar.font}
              />
              <ToggleSwitch
                options={languageOptions}
                current={language}
                onChange={setLanguage}
              />
              <Link
                href="/docs"
                className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/85 px-4 py-2 font-semibold text-text shadow-[0_10px_30px_rgba(14,165,233,0.16)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white hover:text-primary hover:shadow-[0_14px_34px_rgba(14,165,233,0.24)]"
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
                className="inline-flex min-h-10 min-w-[4.1rem] items-center justify-center rounded-2xl border border-border/50 bg-white/76 px-3 py-2 text-sm font-semibold text-text/70 backdrop-blur-md transition-colors hover:bg-white"
                aria-label="Toggle language"
              >
                {language === 'en' ? '中文' : 'EN'}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-border/50 bg-white/76 p-2.5 backdrop-blur-md transition-colors hover:bg-white"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-5 w-5 text-text" /> : <Menu className="h-5 w-5 text-text" />}
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
                <div className="space-y-3 rounded-3xl border border-white/50 bg-white/85 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                  <button
                    onClick={() => setFont(font === 'comic' ? 'puhui' : 'comic')}
                    className="flex min-h-11 w-full items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-left font-semibold text-text/75 transition-colors hover:bg-white"
                  >
                    <span>{t.navbar.font}</span>
                    <span className="text-sm text-text/55">{font === 'comic' ? 'Comic Neue' : 'PuHuiTi'}</span>
                  </button>

                  <Link
                    href="/docs"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white/90 px-4 py-3 font-semibold text-text shadow-[0_10px_28px_rgba(14,165,233,0.16)] backdrop-blur-md transition-colors hover:bg-white hover:text-primary"
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
