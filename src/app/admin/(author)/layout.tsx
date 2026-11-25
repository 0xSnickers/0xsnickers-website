import Link from 'next/link';
import { LogOut, NotebookPen } from 'lucide-react';
import type { ReactNode } from 'react';
import { GithubNotesError, getPublishState } from '@/lib/github/notes';
import { requireAuthor } from '@/lib/notes/session';
import { signOut } from '../login/actions';
import { PublishButton } from './notes/Editor';

export default async function AuthorLayout({ children }: { children: ReactNode }) {
  await requireAuthor();
  let publish = { pending: false, ahead: 0, diverged: false };
  try {
    publish = await getPublishState();
  } catch (error) {
    if (!(error instanceof GithubNotesError)) throw error;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-8">
      <header className="notes-panel mb-8 px-4 py-2 sm:mb-12 sm:px-5">
        <nav aria-label="笔记后台" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/admin/notes" className="notes-link inline-flex min-h-10 items-center gap-2 font-semibold">
            <NotebookPen size={20} className="text-[var(--notes-accent)]" aria-hidden="true" />
            笔记后台
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-3 sm:gap-5">
            <PublishButton pendingChanges={publish.pending} diverged={publish.diverged} />
            <form action={signOut}>
              <button className="notes-link notes-muted inline-flex min-h-10 items-center gap-1.5 text-sm">
                <LogOut size={15} aria-hidden="true" /> 退出登录
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
