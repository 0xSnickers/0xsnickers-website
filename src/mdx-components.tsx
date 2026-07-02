import type { MDXComponents } from 'mdx/types';
import Mermaid from '@/components/Mermaid';

export function useMDXComponents(): MDXComponents {
  return {
    Mermaid: (props) => <Mermaid chart={props.chart as string} className={props.className as string | undefined} />,
  };
}
