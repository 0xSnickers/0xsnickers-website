import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { ArticleStats } from '@/components/docs/ArticleStats';
import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

type DocPageData = {
  publishedAt?: string;
};

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: 'Daily | 0xsnickers Logbook',
      description: 'Daily notes and personal logs.',
    };
  }

  const page = source.getPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.data.title} | 0xsnickers Logbook`,
    description: page.data.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    redirect('/docs/daily');
  }

  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <ArticleStats slug={slug.join('/')} publishedAt={(page.data as DocPageData).publishedAt} />
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}
