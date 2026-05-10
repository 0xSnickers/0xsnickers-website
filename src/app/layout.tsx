import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { FontProvider } from '@/i18n/FontContext';
import { FontBody } from '@/components/FontBody';

export const metadata: Metadata = {
  title: '0xSnickers | Vibe Coder',
  description: 'Personal portfolio of 0xSnickers - sharing vibe coding projects',
};

function Content({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 aurora-bg opacity-20 pointer-events-none z-0"></div>
      <div className="fixed inset-0 aurora-overlay pointer-events-none z-0"></div>
      <div className="relative z-10">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <FontProvider>
        <FontBody>
          <Content>{children}</Content>
        </FontBody>
      </FontProvider>
    </html>
  );
}
