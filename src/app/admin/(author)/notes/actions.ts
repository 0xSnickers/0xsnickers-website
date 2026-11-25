'use server';

import { revalidatePath } from 'next/cache';
import { redirect, unstable_rethrow } from 'next/navigation';
import { deleteDocument, editHref, GithubNotesError, publishDocuments, saveDocument } from '@/lib/github/notes';
import { requireAuthor } from '@/lib/notes/session';

function failure(error: unknown) {
  return error instanceof GithubNotesError ? error.message : '操作失败，请稍后重试。';
}

export async function saveDoc(_state: string, form: FormData) {
  await requireAuthor();
  const path = String(form.get('path') ?? '');
  const folder = String(form.get('folder') ?? '').trim();
  const filename = String(form.get('filename') ?? '').trim().replace(/\.mdx$/i, '');
  const creating = form.get('creating') === '1';
  if (creating && (!folder || !filename || filename.includes('/') || filename.includes('\\'))) {
    return '请选择目录，并填写不含斜杠的文件名。';
  }
  const target = creating ? `${folder}/${filename}.mdx` : path;
  try {
    const saved = await saveDocument({
      creating,
      path: target,
      title: String(form.get('title') ?? ''),
      description: String(form.get('description') ?? ''),
      publishedAt: String(form.get('publishedAt') ?? ''),
      body: String(form.get('body') ?? ''),
    });
    revalidatePath('/admin', 'layout');
    redirect(`${editHref(saved)}?status=saved`);
  } catch (error) {
    unstable_rethrow(error);
    return failure(error);
  }
}

export async function deleteDoc(_state: string, form: FormData) {
  await requireAuthor();
  try {
    await deleteDocument(String(form.get('path') ?? ''));
    revalidatePath('/admin', 'layout');
  } catch (error) {
    unstable_rethrow(error);
    return failure(error);
  }
  redirect('/admin/notes?status=deleted');
}

export async function publishDocs(_state: string, _form: FormData) {
  await requireAuthor();
  try {
    const published = await publishDocuments();
    revalidatePath('/admin', 'layout');
    if (!published) redirect('/admin/notes');
  } catch (error) {
    unstable_rethrow(error);
    return failure(error);
  }
  redirect('/admin/notes?status=published');
}
