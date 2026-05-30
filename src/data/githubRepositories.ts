import type { Project } from './projects';
import { projects as fallbackProjects } from './projects';

type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
};

const GITHUB_REPOSITORIES_URL = 'https://api.github.com/users/0xSnickers/repos';
const GITHUB_USERNAME = '0xSnickers';

const accents = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-indigo-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-orange-400',
  'from-sky-500 to-violet-400',
  'from-amber-500 to-lime-400',
];

const iconByLanguage: Record<string, Project['icon']> = {
  TypeScript: 'Code2',
  JavaScript: 'Code2',
  Solidity: 'Database',
  Vue: 'Palette',
  CSS: 'Palette',
  HTML: 'Globe',
};

function mapRepositoryToProject(repo: GitHubRepository, index: number): Project {
  const tags = [
    repo.language,
    ...(repo.topics ?? []),
    repo.archived ? 'archived' : undefined,
    repo.fork ? 'fork' : undefined,
  ].filter(Boolean) as string[];

  const displayTags = tags.length > 0 ? tags.slice(0, 4) : ['github'];
  const stack = repo.language ?? 'GitHub Repository';
  const description = repo.description ?? 'GitHub repository by 0xSnickers.';
  const homepage = repo.homepage?.trim();

  return {
    id: repo.id,
    icon: repo.language ? iconByLanguage[repo.language] ?? 'Code2' : 'Github',
    accent: accents[index % accents.length],
    github: repo.html_url,
    demo: homepage || '',
    name: {
      en: repo.name,
      zh: repo.name,
    },
    description: {
      en: description,
      zh: description,
    },
    stack: {
      en: stack,
      zh: stack,
    },
    tags: {
      en: displayTags,
      zh: displayTags,
    },
  };
}

export async function getGitHubRepositoryProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return fallbackProjects;
  }

  try {
    const response = await fetch(
      `${GITHUB_REPOSITORIES_URL}?per_page=100&sort=pushed&direction=desc`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      return fallbackProjects;
    }

    const repositories = (await response.json()) as GitHubRepository[];

    return repositories
      .filter((repository) => repository.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
      .sort((a, b) => {
        const left = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
        const right = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;

        return right - left;
      })
      .map(mapRepositoryToProject);
  } catch {
    return fallbackProjects;
  }
}
