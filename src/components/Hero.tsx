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
      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} overflow-hidden`}
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={alt}
          width={44}
          height={44}
          className="h-11 w-11 object-cover"
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
    <section id="projects" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="max-w-2xl text-left">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{t.hero.badge}</span>
            </motion.div>

            <h1 className="mb-5 text-5xl font-bold leading-tight text-text md:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>

            <p className="mb-10 max-w-xl text-lg text-text/70 md:text-xl">
              {t.hero.description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => void 0}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="aurora-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white"
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
            className="relative"
          >
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -right-6 bottom-6 h-40 w-40 rounded-full bg-cta/20 blur-3xl pointer-events-none"></div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xl font-bold">{t.hero.projectsTitle}</p>
                </div>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              <div className="max-h-[520px] overflow-y-auto space-y-4 p-5">
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
                      className={`block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:bg-white/[0.08] hover:border-white/20 ${
                        projectLink && projectLink !== '#' ? 'cursor-pointer' : ''
                      }`}
                      onClick={handleCardClick}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <ProjectLogo
                            logo={project.logo}
                            accent={project.accent}
                            alt={translated.name}
                            IconComponent={IconComponent}
                          />
                          <div>
                            <p className="text-lg font-bold text-white">
                              {translated.name}
                            </p>
                            <p className="text-sm text-white/60">
                              {translated.stack}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
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
                              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="mb-4 text-sm text-white/70">
                        {translated.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {translated.tags.map((tag) => (
                          <div
                            key={tag}
                            className="rounded-xl bg-white/[0.04] px-3 py-2 text-center text-xs text-white/70"
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
