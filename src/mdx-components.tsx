import { isValidElement, type ComponentProps, type ImgHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Mermaid from '@/components/Mermaid';

const DefaultPre = defaultMdxComponents.pre ?? 'pre';

type MdxImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | { src?: string };
};

function resolveMdxImageSrc(src: MdxImageProps['src']) {
  if (typeof src === 'string') return src;
  if (src && typeof src === 'object' && typeof src.src === 'string') return src.src;
  return undefined;
}

function MdxImage({ src, ...props }: MdxImageProps) {
  return <img {...props} src={resolveMdxImageSrc(src)} />;
}

function MdxPre(props: ComponentProps<'pre'>) {
  const child = isValidElement(props.children)
    ? props.children as ReactElement<{ className?: string; children?: ReactNode }>
    : null;

  if (child?.props.className?.split(' ').includes('language-mermaid')) {
    return <Mermaid chart={String(child.props.children ?? '').trim()} />;
  }

  return <DefaultPre {...props} />;
}

export function useMDXComponents(): MDXComponents {
  return {
    pre: MdxPre,
    Mermaid: (props) => <Mermaid chart={props.chart as string} className={props.className as string | undefined} />,
    img: (props) => <MdxImage {...(props as MdxImageProps)} />,
    ZoomableImage: (props) => <MdxImage {...(props as MdxImageProps)} />,
  };
}
