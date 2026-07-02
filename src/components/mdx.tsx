import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Mermaid from '@/components/Mermaid';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid: ({ chart, className }) => <Mermaid chart={chart as string} className={className as string | undefined} />,
    ...components,
  };
}
