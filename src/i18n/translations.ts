export type Translation = {
  navbar: {
    brand: string;
    font: string;
    docs: string;
    donate: string;
    themeDark: string;
    themeLight: string;
  };
  hero: {
    badge: string;
    description: string;
    quickLinksTitle: string;
    quickLinks: Array<{
      label: string;
      href: string;
    }>;
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
  notFound: {
    home: string;
    docs: string;
  };
};

export const en: Translation = {
  navbar: {
    brand: '0xsnickers.lol',
    font: 'Font',
    docs: 'Logbook',
    donate: 'Donate',
    themeDark: 'Dark',
    themeLight: 'Light',
  },
  hero: {
    badge: "🐱 0xsnickers' notes",
    description: 'I build small toys and notes.',
    quickLinksTitle: 'Browse by topic',
    quickLinks: [
      { label: 'Daily', href: '/docs/daily' },
      { label: 'Frontend', href: '/docs/frontend' },
      { label: 'Backend', href: '/docs/backend' },
      { label: 'Solidity', href: '/docs/solidity' },
    ],
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
    projectsTitle: 'GitHub repositories',
    projectsSubtitle: '',
  },
  footer: {
    copyright: '👨‍💻 All accumulation is building strength for the future.',
  },
  notFound: {
    home: 'Back home',
    docs: 'View docs',
  },
};

export const zh: Translation = {
  navbar: {
    brand: '0xsnickers.lol',
    font: '字体',
    docs: '日常',
    donate: '打赏',
    themeDark: '暗色',
    themeLight: '浅色',
  },
  hero: {
    badge: "🐱 0xsnickers' notes",
    description: '分享平时做的一些小项目和笔记记录。',
    quickLinksTitle: '按主题浏览',
    quickLinks: [
      { label: '日常', href: '/docs/daily' },
      { label: '前端', href: '/docs/frontend' },
      { label: '后端', href: '/docs/backend' },
      { label: 'Solidity', href: '/docs/solidity' },
    ],
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
    projectsTitle: 'GitHub 仓库',
    projectsSubtitle: '',
  },
  footer: {
    copyright: '👨‍💻 所有的积累都是在为未来积蓄力量。',
  },
  notFound: {
    home: '返回首页',
    docs: '查看文档',
  },
};
