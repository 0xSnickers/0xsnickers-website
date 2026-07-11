import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FontProvider } from '@/i18n/FontContext';
import { FontBody } from '@/components/FontBody';
import { SiteShell } from '@/components/SiteShell';
import ClickSpark from '@/components/ClickSpark';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: '0xSnickers | Vibe Coder',
  description: 'Personal portfolio of 0xSnickers - sharing vibe coding projects',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
          <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400} extraScale={1}>
            <SiteShell>{children}</SiteShell>
            <Analytics />
          </ClickSpark>
        </FontBody>
      </FontProvider>
    </html>
  );
}
