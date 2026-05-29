import type { Metadata } from 'next';
import './globals.css';
import { FontProvider } from '@/i18n/FontContext';
import { FontBody } from '@/components/FontBody';
import { SiteShell } from '@/components/SiteShell';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: '0xSnickers | Vibe Coder',
  description: 'Personal portfolio of 0xSnickers - sharing vibe coding projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <FontProvider>
        <FontBody>
          <SiteShell>{children}</SiteShell>
          <Analytics />
        </FontBody>
      </FontProvider>
    </html>
  );
}
