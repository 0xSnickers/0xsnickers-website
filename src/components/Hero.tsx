'use client';

import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Github,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type ComponentType } from 'react';
import { useHomeTheme } from '@/components/home/HomeThemeContext';
import { getIconComponent, getProjectByLanguage, type Project } from '@/data/projects';
import { useLanguage } from '@/i18n/LanguageContext';

type HeroProps = {
  projects: Project[];
};

type ProjectLogoProps = {
  logo?: string;
  accent: string;
  alt: string;
  IconComponent: ComponentType<{ className?: string }>;
};

function ProjectLogo({ logo, accent, alt, IconComponent }: ProjectLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const logoSrc = !imageFailed ? logo : undefined;

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${accent} sm:h-11 sm:w-11`}
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={alt}
          width={44}
          height={44}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <IconComponent className="h-5 w-5 text-white" />
      )}
    </div>
  );
}

export default function Hero({ projects }: HeroProps) {
  const { t, language } = useLanguage();
  const { homeTheme } = useHomeTheme();
  const isHomeDark = homeTheme === 'dark';

  return (
    <section id="projects" className="relative overflow-x-clip pt-4 pb-8 sm:py-14 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-7 sm:gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-16 xl:gap-20">
          <div className="min-w-0 max-w-2xl text-left lg:max-w-xl xl:max-w-2xl">
            <div className="relative p-5 sm:p-7 lg:p-0">
              <div className="relative flex flex-col items-start gap-4 sm:gap-6 lg:gap-8">
                <div className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] shadow-sm backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm ${
                  isHomeDark
                    ? 'border border-white/10 bg-slate-950/52 shadow-[0_10px_28px_rgba(2,6,23,0.2)]'
                    : 'border border-primary/15 bg-white/82'
                }`}>
                  <span className={`truncate font-semibold ${isHomeDark ? 'text-sky-200' : 'text-primary'}`}>{t.hero.badge}</span>
                </div>

                <div className="w-full space-y-4 sm:space-y-6">
                  <p className={`w-full max-w-full text-[2.65rem] font-bold leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-[3.7rem] ${
                    isHomeDark ? 'text-white' : 'text-text'
                  }`}>
                    {t.hero.description}
                  </p>

                  <div className="w-full space-y-3 sm:max-w-lg sm:space-y-4">
                    <div className={`flex items-center gap-2.5 text-[13px] font-medium sm:gap-3 sm:text-sm sm:font-semibold ${
                      isHomeDark ? 'text-slate-400 sm:text-slate-400' : 'text-text/48 sm:text-text/55'
                    }`}>
                      <div className={`inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-md sm:h-10 sm:w-10 ${
                        isHomeDark
                          ? 'border-white/10 bg-white/8 text-sky-300 shadow-[0_12px_28px_rgba(2,6,23,0.18)] sm:bg-white/6'
                          : 'border-white/55 bg-white/72 text-primary sm:bg-white/60'
                      }`}>
                        <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <span>{t.hero.quickLinksTitle}</span>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3">
                      {t.hero.quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`group flex h-[4.25rem] w-full items-center justify-between rounded-[1.35rem] border px-4 text-left backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-[4.5rem] sm:px-5 ${
                            isHomeDark
                              ? 'border-white/10 bg-slate-950/46 shadow-[0_16px_34px_rgba(2,6,23,0.18)] hover:border-sky-300/24 hover:bg-slate-900/62 hover:shadow-[0_20px_40px_rgba(2,6,23,0.24)] sm:bg-slate-950/54'
                              : 'border-sky-200/65 bg-white/78 shadow-[0_10px_24px_rgba(14,116,144,0.08)] hover:border-sky-300/80 hover:bg-white hover:shadow-[0_14px_30px_rgba(14,116,144,0.13)]'
                          }`}
                        >
                          <span className={`text-[15px] font-semibold sm:text-base ${isHomeDark ? 'text-slate-100' : 'text-text/80'}`}>{link.label}</span>
                          <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                            isHomeDark
                              ? 'bg-white/5 text-slate-500 group-hover:bg-sky-300/10 group-hover:text-sky-300'
                              : 'bg-sky-50 text-sky-500/65 group-hover:bg-sky-100 group-hover:text-primary'
                          }`}>
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="pointer-events-none absolute -left-3 top-8 h-24 w-24 rounded-full bg-primary/10 blur-3xl sm:-left-6 sm:top-10 sm:h-40 sm:w-40"></div>

            <div id="github-repositories" className="relative overflow-hidden rounded-[24px] border border-white/40 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] sm:rounded-[28px]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold sm:text-xl">{t.hero.projectsTitle}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              <div className="max-h-[70vh] space-y-3 overflow-y-auto p-4 sm:max-h-[520px] sm:space-y-4 sm:p-5">
                {projects.map((project) => {
                  const translated = getProjectByLanguage(project, language);
                  const IconComponent = getIconComponent(project.icon);
                  const hasDemo = project.demo && project.demo !== '';
                  return (
                    <div
                      key={project.id}
                      className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3">
                            <ProjectLogo
                              logo={project.logo}
                              accent={project.accent}
                              alt={translated.name}
                              IconComponent={IconComponent}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-base font-bold text-white sm:text-lg">
                                {translated.name}
                              </p>
                              <p className="break-words text-sm leading-6 text-white/60">
                                {translated.stack}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2 self-start">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open ${translated.name} on GitHub`}
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {hasDemo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open ${translated.name} demo`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="mb-4 break-words text-sm leading-6 text-white/70">
                        {translated.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {translated.tags.map((tag) => (
                          <div
                            key={tag}
                            className="rounded-xl bg-white/[0.04] px-3 py-2 text-center text-xs leading-5 text-white/70 break-words"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
