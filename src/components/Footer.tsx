'use client';

import { Github, Twitter, Send } from 'lucide-react';
import { useHomeTheme } from '@/components/home/HomeThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { socials as socialsData } from '@/data/projects';

export default function Footer({ variant = 'default' }: { variant?: 'default' | 'homeDark' }) {
  const { t } = useLanguage();
  const { isHome, homeTheme } = useHomeTheme();
  const isHomeDark = isHome ? homeTheme === 'dark' : variant === 'homeDark';

  const socials = [
    { icon: Github, name: 'GitHub', url: socialsData.github || '#' },
    { icon: Twitter, name: 'X', url: socialsData.twitter || '#' },
    { icon: Send, name: 'Telegram', url: socialsData.telegram || '#' },
  ];

  const visibleSocials = socials.filter((social) => social.url && social.url !== '#');

  return (
    <footer className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={isHomeDark ? 'text-slate-400' : 'text-text/60'}>
            {t.footer.copyright}
          </p>

          <div className="flex items-center gap-3">
            {visibleSocials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:-translate-y-1 hover:text-primary ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/52 text-slate-300 hover:border-sky-300/24 hover:bg-sky-400/10'
                    : 'border border-border/50 bg-white/80 text-text/70 hover:border-primary/20 hover:bg-primary/5'
                }`}
                aria-label={social.name}
              >
                <social.icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
