'use client';

import MDEditor from '@uiw/react-md-editor/nohighlight';
import '@uiw/react-md-editor/markdown-editor.css';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteDoc, publishDocs, saveDoc } from './actions';

function MarkdownBody({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <textarea
        className="notes-field min-h-80 w-full"
        aria-label="Markdown 正文"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <MDEditor
      value={value}
      onChange={(next) => onChange(next ?? '')}
      height={560}
      preview="live"
      textareaProps={{ 'aria-label': 'Markdown 正文' }}
    />
  );
}

const field = 'notes-field';
const label = 'grid gap-2 text-sm font-medium';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="notes-button notes-button-primary" disabled={pending} aria-busy={pending}>
      {pending ? '保存中…' : '保存草稿'}
    </button>
  );
}

export function PublishButton({ pendingChanges, diverged }: { pendingChanges: boolean; diverged: boolean }) {
  const [error, action, pending] = useActionState(publishDocs, '');
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <button className="notes-button notes-button-primary" disabled={!pendingChanges || pending} aria-busy={pending} title={diverged ? '草稿和 main 已分叉，发布可能因为冲突而停下来。' : undefined}>
        {pending ? '发布中…' : '发布到网站'}
      </button>
      {error && <p role="alert" className="notes-error text-sm">{error}</p>}
    </form>
  );
}

export function DeleteButton({ path }: { path: string }) {
  const [error, action, pending] = useActionState(deleteDoc, '');
  return (
    <form
      action={action}
      className="grid gap-2"
      onSubmit={(event) => {
        if (!window.confirm('删除会先记在草稿里，点发布后才会从网站移除。确定删除这篇笔记？')) event.preventDefault();
      }}
    >
      <input type="hidden" name="path" value={path} />
      <button className="notes-button notes-button-danger" disabled={pending} aria-busy={pending}>
        {pending ? '删除中…' : '删除'}
      </button>
      {error && <p role="alert" className="notes-error text-sm">{error}</p>}
    </form>
  );
}

export function NoteEditor({
  creating,
  path = '',
  folders = [],
  title,
  description,
  publishedAt,
  body,
  saved = false,
}: {
  creating: boolean;
  path?: string;
  folders?: string[];
  title: string;
  description: string;
  publishedAt: string;
  body: string;
  saved?: boolean;
}) {
  const [error, action] = useActionState(saveDoc, '');
  const [markdown, setMarkdown] = useState(body);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="notes-panel grid min-w-0 gap-4 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">文章设置</h2>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="creating" value={creating ? '1' : '0'} />
          {!creating && <input type="hidden" name="path" value={path} />}
          {creating ? (
            <>
              <label className={label}>目录
                <select name="folder" className={field} defaultValue={folders[0]} required>
                  {folders.map((folder) => <option key={folder}>{folder}</option>)}
                </select>
              </label>
              <label className={label}>文件名
                <input name="filename" required placeholder="my-note" className={field} />
              </label>
            </>
          ) : (
            <p className="notes-muted break-all font-mono text-xs">{path}</p>
          )}
          <label className={label}>标题
            <input name="title" defaultValue={title} required maxLength={160} className={field} />
          </label>
          <label className={label}>描述
            <input name="description" defaultValue={description} maxLength={400} className={field} />
          </label>
          <label className={label}>发布日期
            <input name="publishedAt" type="date" defaultValue={publishedAt} required className={field} />
          </label>
          <textarea name="body" value={markdown} readOnly hidden />
          <p className="notes-muted text-xs leading-relaxed">保存只写入草稿分支。改完多篇后，回列表点「发布到网站」。</p>
          {saved && <p role="status" className="notes-notice">草稿已保存。</p>}
          {error && <p role="alert" className="notes-notice notes-error">{error}</p>}
          <SaveButton />
        </form>
        {!creating && <DeleteButton path={path} />}
      </div>
      <div className="notes-editor notes-panel min-w-0 p-3 sm:p-4">
        <p className={label}>正文</p>
        <div data-color-mode="light" className="mt-2">
          <MarkdownBody value={markdown} onChange={setMarkdown} />
        </div>
      </div>
    </div>
  );
}
