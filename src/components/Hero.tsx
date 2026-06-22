'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { useState, type ComponentType } from 'react';
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
    <section id="projects" className="relative overflow-x-clip py-12 sm:py-14 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10"
        >
          <div className="max-w-2xl text-left">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-3.5 py-2 backdrop-blur-md sm:mb-6 sm:px-4"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate font-semibold text-primary">{t.hero.badge}</span>
            </motion.div>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-text sm:text-5xl md:mb-5 md:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-text/70 sm:text-lg md:mb-10 md:text-xl">
              {t.hero.description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => void 0}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="aurora-button inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                {t.hero.browseProjects}
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative min-w-0"
          >
            <div className="pointer-events-none absolute -left-3 top-8 h-24 w-24 rounded-full bg-primary/20 blur-3xl sm:-left-6 sm:top-10 sm:h-40 sm:w-40"></div>
            <div className="pointer-events-none absolute -right-3 bottom-4 h-24 w-24 rounded-full bg-cta/20 blur-3xl sm:-right-6 sm:bottom-6 sm:h-40 sm:w-40"></div>

            <div className="relative overflow-hidden rounded-[24px] border border-white/40 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:rounded-[32px]">
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
                {projects.map((project, index) => {
                  const translated = getProjectByLanguage(project, language);
                  const IconComponent = getIconComponent(project.icon);
                  const hasDemo = project.demo && project.demo !== '';
                  const projectLink = hasDemo ? project.demo : project.github;
                  const handleCardClick = () => {
                    if (projectLink && projectLink !== '#') {
                      window.open(projectLink, '_blank');
                    }
                  };
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.06 }}
                      className={`block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-white/20 hover:bg-white/[0.08] ${
                        projectLink && projectLink !== '#' ? 'cursor-pointer' : ''
                      }`}
                      onClick={handleCardClick}
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
                              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {hasDemo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
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
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
