'use client';

import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Github,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type ComponentType, type KeyboardEvent } from 'react';
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

  return (
    <section id="projects" className="relative overflow-x-clip pt-4 pb-8 sm:py-14 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-7 sm:gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-16 xl:gap-20">
          <div className="min-w-0 max-w-2xl text-left lg:max-w-xl xl:max-w-2xl">
            <div className="relative p-0 sm:overflow-hidden sm:rounded-[32px] sm:border sm:border-white/55 sm:bg-white/68 sm:p-7 sm:shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:backdrop-blur-xl lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
              <div className="pointer-events-none absolute inset-x-8 top-0 hidden h-24 rounded-full bg-primary/8 blur-3xl sm:block lg:hidden"></div>

              <div className="relative flex flex-col items-start gap-4 sm:gap-6 lg:gap-8">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/82 px-3 py-1.5 text-[13px] shadow-sm backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
                  <span className="truncate font-semibold text-primary">{t.hero.badge}</span>
                </div>

                <div className="w-full space-y-4 sm:space-y-6">
                  <p className="max-w-[7.8ch] text-[2.65rem] font-bold leading-[0.96] tracking-[-0.055em] text-text sm:max-w-[11ch] sm:text-5xl lg:text-[3.7rem]">
                    {t.hero.description}
                  </p>

                  <div className="w-full space-y-3 sm:max-w-lg sm:space-y-4">
                    <div className="flex items-center gap-2.5 text-[13px] font-medium text-text/48 sm:gap-3 sm:text-sm sm:font-semibold sm:text-text/55">
                      <div className="inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/72 text-primary shadow-sm backdrop-blur-md sm:h-10 sm:w-10 sm:bg-white/60">
                        <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <span>{t.hero.quickLinksTitle}</span>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3">
                      {t.hero.quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group flex min-h-[3.35rem] w-full items-center justify-between rounded-[1.35rem] border border-white/65 bg-white/74 px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/18 hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-[3.75rem] sm:rounded-2xl sm:bg-white/82 sm:px-4 sm:py-3 sm:shadow-sm"
                        >
                          <span className="text-[15px] font-semibold text-text/80 sm:text-base">{link.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-text/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
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
                  const projectLink = hasDemo ? project.demo : project.github;
                  const handleCardClick = () => {
                    if (projectLink && projectLink !== '#') {
                      window.open(projectLink, '_blank');
                    }
                  };
                  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
                    if ((event.key === 'Enter' || event.key === ' ') && projectLink && projectLink !== '#') {
                      event.preventDefault();
                      window.open(projectLink, '_blank');
                    }
                  };

                  return (
                    <div
                      key={project.id}
                      className={`block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        projectLink && projectLink !== '#' ? 'cursor-pointer' : ''
                      }`}
                      onClick={handleCardClick}
                      onKeyDown={handleCardKeyDown}
                      role={projectLink && projectLink !== '#' ? 'button' : undefined}
                      tabIndex={projectLink && projectLink !== '#' ? 0 : undefined}
                      aria-label={projectLink && projectLink !== '#' ? `Open ${translated.name}` : undefined}
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
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
                        <div className="flex shrink-0 gap-2 self-start sm:self-auto">
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
