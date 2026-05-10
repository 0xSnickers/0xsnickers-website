export type Translation = {
  navbar: {
    brand: string;
    font: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    browseProjects: string;
    stats: {
      label1: string;
      sub1: string;
      label2: string;
      sub2: string;
      label3: string;
      sub3: string;
      label4: string;
      sub4: string;
    };
    projectsTitle: string;
    projectsSubtitle: string;
  };
  footer: {
    copyright: string;
  };
};

export const en: Translation = {
  navbar: {
    brand: '0xSnickers',
    font: 'Font',
  },
  hero: {
    badge: 'vibe coding for anything',
    title: 'Making fun stuff',
    titleHighlight: '',
    description: 'Meme projects, onchain toys, automation tools, and all sorts of half-baked ideas.',
    browseProjects: 'View Projects',
    stats: {
      label1: '20+',
      sub1: 'Projects',
      label2: '5+',
      sub2: 'Years',
      label3: 'Web3',
      sub3: 'Focus',
      label4: '∞',
      sub4: 'Vibes',
    },
    projectsTitle: 'vibe coding projects',
    projectsSubtitle: '',
  },
  footer: {
    copyright: '👨‍💻 All accumulation is building strength for the future.',
  },
};

export const zh: Translation = {
  navbar: {
    brand: '0xSnickers',
    font: '字体',
  },
  hero: {
    badge: 'vibe coding for anything',
    title: '造一些好玩的东西',
    titleHighlight: '',
    description: 'Meme 项目、链上玩具、自动化工具，还有各种半成品想法。',
    browseProjects: '浏览项目',
    stats: {
      label1: '20+',
      sub1: '项目',
      label2: '5+',
      sub2: '年',
      label3: 'Web3',
      sub3: '专注',
      label4: '∞',
      sub4: '氛围',
    },
    projectsTitle: 'vibe coding 项目',
    projectsSubtitle: '',
  },
  footer: {
    copyright: '👨‍💻 所有的积累都是在为未来积蓄力量。',
  },
};
