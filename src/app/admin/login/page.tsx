import Link from 'next/link';
import { ArrowLeft, NotebookPen } from 'lucide-react';
import { notesConfigured } from '@/lib/notes/session';
import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = notesConfigured();

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="notes-link notes-muted mb-5 inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} aria-hidden="true" />
          返回首页
        </Link>
        <section className="notes-panel p-6 sm:p-9" aria-labelledby="login-title">
          <NotebookPen className="mb-5 text-[var(--notes-accent)]" size={29} aria-hidden="true" />
          <h1 id="login-title" className="text-3xl font-semibold tracking-tight">笔记后台</h1>
          <p className="notes-muted mt-2 text-sm">使用作者账号登录</p>
          {!configured && (
            <p role="status" className="notes-notice mt-5">
              尚未配置作者账号。配置 Supabase 后，在终端运行 <code>npm run notes:setup</code>。
            </p>
          )}
          <LoginForm configured={configured} error={error} />
        </section>
      </div>
    </main>
  );
}
