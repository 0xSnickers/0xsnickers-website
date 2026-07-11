import defaultMdxComponents from 'fumadocs-ui/mdx';
import { isValidElement, type ComponentProps, type ImgHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import Mermaid from '@/components/Mermaid';

const DefaultPre = defaultMdxComponents.pre ?? 'pre';

type MdxImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | { src?: string };
  'data-no-zoom'?: string;
};

function resolveMdxImageSrc(src: MdxImageProps['src']) {
  if (typeof src === 'string') return src;
  if (src && typeof src === 'object' && typeof src.src === 'string') return src.src;
  return undefined;
}

function mergeClassName(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

function MdxImage({ src, className, 'data-no-zoom': dataNoZoom, ...props }: MdxImageProps) {
  const zoomDisabled = dataNoZoom === 'true';

  return (
    <img
      {...props}
      className={mergeClassName(className, zoomDisabled ? undefined : 'cursor-zoom-in')}
      data-article-zoomable={zoomDisabled ? 'false' : 'true'}
      data-no-zoom={dataNoZoom}
      src={resolveMdxImageSrc(src)}
    />
  );
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

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: MdxPre,
    Mermaid: ({ chart, className }) => <Mermaid chart={chart as string} className={className as string | undefined} />,
    img: (props) => <MdxImage {...(props as MdxImageProps)} />,
    ZoomableImage: (props) => <MdxImage {...(props as MdxImageProps)} />,
    ...components,
  };
}
