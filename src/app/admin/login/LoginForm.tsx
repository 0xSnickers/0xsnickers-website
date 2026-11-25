'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { signIn } from './actions';

function LoginFields({ configured, error }: { configured: boolean; error?: string }) {
  const { pending } = useFormStatus();
  const disabled = !configured || pending;

  return (
    <>
      {configured && error && !pending && <p role="alert" className="notes-notice notes-error mt-5">登录失败，请检查邮箱和密码。</p>}
      {pending && <p role="status" className="notes-notice mt-5">正在登录，请稍候…</p>}
      <div className="mt-7 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">邮箱
          <input name="email" type="email" autoComplete="username" placeholder="you@example.com" required disabled={disabled} className="notes-field" />
        </label>
        <label className="grid gap-2 text-sm font-medium">密码
          <input name="password" type="password" autoComplete="current-password" required disabled={disabled} className="notes-field" />
        </label>
        <button disabled={disabled} aria-busy={pending} className="notes-button notes-button-primary mt-2">
          {pending ? <LoaderCircle size={16} className="notes-spin" aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
          {pending ? '登录中…' : '登录'}
        </button>
      </div>
    </>
  );
}

export function LoginForm({ configured, error }: { configured: boolean; error?: string }) {
  return (
    <form action={signIn}>
      <LoginFields configured={configured} error={error} />
    </form>
  );
}
