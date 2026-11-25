import { requireAuthor } from '@/lib/notes/session';
import { notFound } from 'next/navigation';
import { GithubNotesError, readDocument } from '@/lib/github/notes';
import { NoteEditor } from '../../Editor';

export default async function EditNotePage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAuthor();
  const [{ path }, { status }] = await Promise.all([params, searchParams]);
  const documentPath = path.map(decodeURIComponent).join('/');
  let document: Awaited<ReturnType<typeof readDocument>>;
  try {
    document = await readDocument(documentPath);
  } catch (error) {
    const message = error instanceof GithubNotesError ? error.message : '无法读取这篇笔记。';
    return (
      <section className="grid gap-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">编辑笔记</h1>
        <p role="alert" className="notes-notice notes-error">{message}</p>
      </section>
    );
  }
  if (!document) notFound();

  return (
    <section className="grid gap-6">
      <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">编辑笔记</h1>
      <NoteEditor
        creating={false}
        path={document.path}
        title={document.title}
        description={document.description}
        publishedAt={document.publishedAt}
        body={document.body}
        saved={status === 'saved'}
      />
    </section>
  );
}
