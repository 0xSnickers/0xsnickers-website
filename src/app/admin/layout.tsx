import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './admin.css';

export const metadata: Metadata = {
  title: '笔记后台 | 0xSnickers',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="notes-admin min-h-dvh" lang="zh-CN">{children}</div>;
}
