import { requireAuthor } from '@/lib/notes/session';
import Link from 'next/link';
import { ArrowUpRight, FileText, Plus } from 'lucide-react';
import { editHref, GithubNotesError, getPublishState, listDocuments, publicHref } from '@/lib/github/notes';

const categoryNames: Record<string, string> = {
  daily: '日常',
  frontend: '前端',
  backend: '后端',
  solidity: 'Solidity',
};

const categoryOrder = ['daily', 'frontend', 'backend', 'solidity'];

function categoryLabel(category: string) {
  if (category.endsWith('.mdx')) return '首页';
  return categoryNames[category] ?? category;
}

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAuthor();
  const { status } = await searchParams;
  let documents: Awaited<ReturnType<typeof listDocuments>> = [];
  let publish = { pending: false, ahead: 0, diverged: false };
  let loadError = '';

  try {
    [documents, publish] = await Promise.all([listDocuments(), getPublishState()]);
  } catch (error) {
    loadError = error instanceof GithubNotesError ? error.message : '无法读取仓库笔记。';
  }

  const groups = new Map<string, typeof documents>();
  for (const document of documents) {
    const items = groups.get(document.category) ?? [];
    items.push(document);
    groups.set(document.category, items);
  }
  const categories = [...groups.keys()].sort((left, right) => {
    const leftIndex = categoryOrder.indexOf(left);
    const rightIndex = categoryOrder.indexOf(right);
    if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right, 'zh');
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">笔记</h1>
          {publish.pending && <p className="notes-muted text-sm">草稿里有 {publish.ahead} 次未发布的保存。</p>}
        </div>
        <Link href="/admin/notes/new" className="notes-button notes-button-primary">
          <Plus size={17} aria-hidden="true" /> 新建笔记
        </Link>
      </header>
      {publish.diverged && <p role="status" className="notes-notice notes-error">草稿和 main 已分叉，发布可能因为冲突而停下来。</p>}
      {status === 'published' && <p role="status" className="notes-notice">已提交到 main，等本次部署完成后上线。</p>}
      {status === 'deleted' && <p role="status" className="notes-notice">已从草稿删除。点「发布到网站」后才会从线上移除。</p>}
      {loadError && <p role="alert" className="notes-notice notes-error">{loadError}</p>}
      {!loadError && categories.length === 0 && (
        <p className="notes-panel notes-muted flex min-h-48 items-center justify-center gap-2 p-8">
          <FileText size={18} aria-hidden="true" /> 还没有笔记
        </p>
      )}
      {categories.map((category) => (
        <section key={category} className="grid gap-3">
          <h2 className="text-lg font-semibold">{categoryLabel(category)}</h2>
          <ul className="notes-panel divide-y divide-[var(--notes-line)] overflow-hidden">
            {groups.get(category)?.map((document) => (
              <li key={document.path}>
                <div className="notes-row grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
                  <FileText size={18} className="notes-muted" aria-hidden="true" />
                  <Link href={editHref(document.path)} className="min-w-0">
                    <span className="block break-words font-medium">{document.title}</span>
                    <span className="notes-muted block break-all font-mono text-xs">{document.path}</span>
                  </Link>
                  <Link href={publicHref(document.path)} className="notes-link notes-muted inline-flex min-h-10 items-center gap-1 text-sm">
                    查看 <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
