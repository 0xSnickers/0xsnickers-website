import { Code2, Palette, Terminal, Globe, Database, Layers, Github } from 'lucide-react';
import projectsJson from './projects.json';

export interface Project {
  id: number;
  logo?: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  stack: {
    en: string;
    zh: string;
  };
  accent: string;
  icon: string;
  tags: {
    en: string[];
    zh: string[];
  };
  github?: string;
  demo?: string;
}

export interface Socials {
  github?: string;
  twitter?: string;
  telegram?: string;
}

export interface ProjectsData {
  socials: Socials;
  projects: Project[];
}

const iconMap = {
  Code2,
  Palette,
  Terminal,
  Globe,
  Database,
  Layers,
  Github,
};

const data: ProjectsData = projectsJson as ProjectsData;

export const projects: Project[] = data.projects;
export const socials: Socials = data.socials;

export function getIconComponent(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] || Code2;
}

export function getProjectByLanguage(project: Project, lang: 'en' | 'zh') {
  return {
    ...project,
    name: project.name[lang],
    description: project.description[lang],
    stack: project.stack[lang],
    tags: project.tags[lang],
  };
}
