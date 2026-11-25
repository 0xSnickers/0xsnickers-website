import { parse } from 'yaml';

const owner = '0xSnickers';
const repo = '0xsnickers-website';
const mainBranch = 'main';
const draftBranch = 'notes-draft';
const docsRoot = 'content/docs';

export class GithubNotesError extends Error {}

export type DocEntry = {
  path: string;
  title: string;
  category: string;
};

export type DocDraft = {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  body: string;
};

export type PublishState = {
  pending: boolean;
  ahead: number;
  diverged: boolean;
};

type RepoFile = {
  sha: string;
  text: string;
};

type GithubContent = {
  sha: string;
  content: string;
};

function token() {
  const value = process.env.PROJECT_GITHUB_TOKEN?.trim();
  if (!value) throw new GithubNotesError('缺少 PROJECT_GITHUB_TOKEN。');
  return value;
}

async function github(pathname: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      'User-Agent': '0xsnickers-notes-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init?.headers,
    },
    cache: 'no-store',
  });
  return response;
}

async function githubMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? '';
  } catch {
    return '';
  }
}

function fail(response: Response, message: string, detail = '') {
  if (response.status === 401 || response.status === 403) {
    throw new GithubNotesError('PROJECT_GITHUB_TOKEN 没有仓库内容的写入权限。请给这个令牌打开 Contents 的读写权限，变量名不用改。');
  }
  throw new GithubNotesError(detail ? `${message}（${detail}）` : message);
}

export function assertDocPath(input: string) {
  const path = input.trim().replace(/^\/+/, '');
  const invalid = !path.endsWith('.mdx')
    || path.includes('..')
    || path.includes('\\')
    || path.split('/').some((part) => !part || part === '.' || part === '..');
  if (invalid) throw new GithubNotesError('笔记路径无效。');
  return path;
}

export function editHref(path: string) {
  return `/admin/notes/edit/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function publicHref(path: string) {
  const withoutExt = path.replace(/\.mdx$/, '');
  const url = withoutExt.endsWith('/index') ? withoutExt.slice(0, -'/index'.length) : withoutExt;
  return `/docs/${url}`;
}

export function parseMdx(source: string) {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!match) return { title: '', description: '', publishedAt: '', body: text };
  try {
    const data = parse(match[1], { uniqueKeys: true, maxAliasCount: 0, schema: 'core' }) as Record<string, unknown>;
    return {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      publishedAt: typeof data.publishedAt === 'string' ? data.publishedAt.slice(0, 10) : '',
      body: text.slice(match[0].length).replace(/^\n/, ''),
    };
  } catch {
    return { title: '', description: '', publishedAt: '', body: text };
  }
}

export function buildMdx(input: { title: string; description: string; publishedAt: string; body: string }) {
  const title = input.title.trim();
  const description = input.description.trim();
  const publishedAt = input.publishedAt.trim();
  const body = input.body.replace(/\r\n/g, '\n').trim();
  if (!title) throw new GithubNotesError('请填写标题。');
  if (title.length > 160) throw new GithubNotesError('标题不能超过 160 个字符。');
  if (description.length > 400) throw new GithubNotesError('描述不能超过 400 个字符。');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) throw new GithubNotesError('发布日期格式应为 YYYY-MM-DD。');
  if (!body) throw new GithubNotesError('请填写正文。');
  if (body.length > 200_000) throw new GithubNotesError('正文过长。');
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\npublishedAt: "${publishedAt}"\n---\n\n${body}\n`;
}

async function branchSha(branch: string) {
  const response = await github(`/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
  if (response.status === 404) return null;
  if (!response.ok) fail(response, '无法读取仓库分支。', await githubMessage(response));
  const data = (await response.json()) as { object?: { sha?: string } };
  return data.object?.sha ?? null;
}

async function ensureDraftBranch() {
  const existing = await branchSha(draftBranch);
  if (existing) return;
  const main = await branchSha(mainBranch);
  if (!main) throw new GithubNotesError('找不到 main 分支。');
  const response = await github(`/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${draftBranch}`, sha: main }),
  });
  if (!response.ok && response.status !== 422) fail(response, '无法创建草稿分支。', await githubMessage(response));
}

async function workingBranch() {
  return (await branchSha(draftBranch)) ? draftBranch : mainBranch;
}

function contentPath(path: string, ref?: string) {
  const encoded = `${docsRoot}/${path}`.split('/').map(encodeURIComponent).join('/');
  const pathname = `/repos/${owner}/${repo}/contents/${encoded}`;
  return ref ? `${pathname}?ref=${encodeURIComponent(ref)}` : pathname;
}

async function readRepoFile(path: string, ref: string): Promise<RepoFile | null> {
  const response = await github(contentPath(path, ref));
  if (response.status === 404) return null;
  if (!response.ok) fail(response, '无法读取笔记文件。', await githubMessage(response));
  const data = (await response.json()) as GithubContent;
  return { sha: data.sha, text: Buffer.from(data.content, 'base64').toString('utf8') };
}

async function mapPool<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

type RepoTreeEntry = { path?: string; type?: string };

async function readDocumentTree(branch: string): Promise<RepoTreeEntry[]> {
  const response = await github(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  if (!response.ok) fail(response, '无法列出笔记。', await githubMessage(response));
  const data = (await response.json()) as { truncated?: boolean; tree?: RepoTreeEntry[] };
  if (data.truncated) throw new GithubNotesError('仓库文件太多，无法一次列出笔记。');
  return data.tree ?? [];
}

export async function listDocuments(): Promise<DocEntry[]> {
  const branch = await workingBranch();
  const paths = (await readDocumentTree(branch))
    .filter((item) => item.type === 'blob' && item.path?.startsWith(`${docsRoot}/`) && item.path.endsWith('.mdx'))
    .map((item) => item.path!.slice(docsRoot.length + 1))
    .sort((left, right) => left.localeCompare(right, 'zh'));

  return mapPool(paths, 6, async (path) => {
    const file = await readRepoFile(path, branch);
    const title = file ? parseMdx(file.text).title.trim() : '';
    return { path, title: title || path.replace(/\.mdx$/, '').split('/').at(-1) || path, category: path.split('/')[0] };
  });
}

export function documentFolders(entries: RepoTreeEntry[]) {
  return [...new Set(entries
    .filter((entry) => entry.type === 'tree' && entry.path?.startsWith(`${docsRoot}/`))
    .map((entry) => entry.path!.slice(docsRoot.length + 1)))]
    .sort((left, right) => left.localeCompare(right, 'zh'));
}

export async function listDocumentFolders(): Promise<string[]> {
  const draft = await branchSha(draftBranch);
  // A draft can lag behind main; include published and draft-only categories.
  const branches = draft ? [mainBranch, draft] : [mainBranch];
  const trees = await Promise.all(branches.map(readDocumentTree));
  return documentFolders(trees.flat());
}

export async function readDocument(path: string): Promise<DocDraft | null> {
  const safePath = assertDocPath(path);
  const file = await readRepoFile(safePath, await workingBranch());
  if (!file) return null;
  return { path: safePath, ...parseMdx(file.text) };
}

async function writeDocument(path: string, text: string, message: string) {
  await ensureDraftBranch();
  const current = await readRepoFile(path, draftBranch);
  const response = await github(contentPath(path), {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(text).toString('base64'),
      branch: draftBranch,
      ...(current ? { sha: current.sha } : {}),
    }),
  });
  if (!response.ok) fail(response, '保存草稿失败。', await githubMessage(response));
}

export async function saveDocument(input: DocDraft & { creating: boolean }) {
  const path = assertDocPath(input.path);
  const text = buildMdx(input);
  const [draftFile, mainFile] = await Promise.all([
    readRepoFile(path, draftBranch).catch((error: unknown) => {
      if (error instanceof GithubNotesError && error.message.includes('找不到')) return null;
      throw error;
    }),
    readRepoFile(path, mainBranch),
  ]);
  if (input.creating && (draftFile || mainFile)) throw new GithubNotesError('这个路径已经有笔记。');
  if (!input.creating && !draftFile && !mainFile) throw new GithubNotesError('找不到这篇笔记。');
  await writeDocument(path, text, `保存笔记草稿：${path}`);
  return path;
}

export async function deleteDocument(path: string) {
  const safePath = assertDocPath(path);
  await ensureDraftBranch();
  const current = await readRepoFile(safePath, draftBranch);
  if (!current) throw new GithubNotesError('草稿分支上没有这篇笔记。');
  const response = await github(contentPath(safePath), {
    method: 'DELETE',
    body: JSON.stringify({ message: `删除笔记草稿：${safePath}`, sha: current.sha, branch: draftBranch }),
  });
  if (!response.ok) fail(response, '删除草稿失败。', await githubMessage(response));
}

export async function getPublishState(): Promise<PublishState> {
  if (!(await branchSha(draftBranch))) return { pending: false, ahead: 0, diverged: false };
  const response = await github(`/repos/${owner}/${repo}/compare/${mainBranch}...${draftBranch}`);
  if (!response.ok) fail(response, '无法比较草稿和 main。', await githubMessage(response));
  const data = (await response.json()) as { ahead_by?: number; behind_by?: number; status?: string };
  const ahead = data.ahead_by ?? 0;
  return { pending: ahead > 0, ahead, diverged: data.status === 'diverged' || (ahead > 0 && (data.behind_by ?? 0) > 0) };
}

export async function publishDocuments() {
  const state = await getPublishState();
  if (!state.pending) return false;
  const response = await github(`/repos/${owner}/${repo}/merges`, {
    method: 'POST',
    body: JSON.stringify({ base: mainBranch, head: draftBranch, commit_message: '发布笔记' }),
  });
  if (response.status === 409) throw new GithubNotesError('草稿和 main 有冲突，这次没有发布。');
  if (!response.ok && response.status !== 204) fail(response, '发布失败。', await githubMessage(response));
  const merged = response.status === 204 ? null : (await response.json()) as { sha?: string };
  const main = merged?.sha ?? await branchSha(mainBranch);
  if (!main) throw new GithubNotesError('发布后找不到 main。');
  const update = await github(`/repos/${owner}/${repo}/git/refs/heads/${draftBranch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: main, force: true }),
  });
  if (!update.ok) fail(update, '发布已提交，但草稿分支没有对齐 main。', await githubMessage(update));
  return true;
}
