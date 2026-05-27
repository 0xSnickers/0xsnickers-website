'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { socials } from '@/data/projects';

export function DocsNavTitle(props: ComponentProps<'a'>) {
  const { className } = props;

  return (
    <div className={className}>
      <Link
        href="/"
        className="inline-flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-secondary/50 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        aria-label="Back to home"
        title="Back to home"
      >
        <ArrowLeft className="size-4" />
      </Link>
      <Link
        href="/docs"
        className="font-semibold text-fd-foreground transition-colors hover:text-fd-primary"
      >
        0xsnickers Logbook
      </Link>
    </div>
  );
}

export function DocsThemeTools(props: ComponentProps<typeof ThemeSwitch>) {
  return (
    <div className="flex w-full items-center gap-1">
      {socials.github && (
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex size-8 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          aria-label="GitHub"
          title="GitHub"
        >
          <Github className="size-4" />
        </a>
      )}
      <ThemeSwitch {...props} className="ms-auto" />
    </div>
  );
}
