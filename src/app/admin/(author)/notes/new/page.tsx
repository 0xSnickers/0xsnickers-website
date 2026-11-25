import { requireAuthor } from '@/lib/notes/session';
import { documentFolders, GithubNotesError, listDocuments } from '@/lib/github/notes';
import { NoteEditor } from '../Editor';

export default async function NewNotePage() {
  await requireAuthor();
  let folders: string[] = [];
  let loadError = '';
  try {
    folders = documentFolders(await listDocuments());
  } catch (error) {
    loadError = error instanceof GithubNotesError ? error.message : '无法读取笔记目录。';
  }
  const publishedAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());

  return (
    <section className="grid gap-6">
      <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">新建笔记</h1>
      {loadError ? <p role="alert" className="notes-notice notes-error">{loadError}</p> : folders.length === 0 ? (
        <p className="notes-notice">还没有可放入新笔记的目录。</p>
      ) : (
        <NoteEditor creating folders={folders} title="" description="" publishedAt={publishedAt} body="" />
      )}
    </section>
  );
}
