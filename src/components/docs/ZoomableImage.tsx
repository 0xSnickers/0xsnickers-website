'use client';

import { Maximize2, X } from 'lucide-react';
import { useEffect, useId, useState, type ImgHTMLAttributes, type MouseEvent } from 'react';

type ZoomableImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function ZoomableImage({ alt = '', className, src, ...props }: ZoomableImageProps) {
  const dialogTitleId = useId().replace(/:/g, '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const stopPropagation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  if (typeof src !== 'string' || src.length === 0) {
    return <img alt={alt} className={className} src={src} {...props} />;
  }

  return (
    <>
      <button
        type="button"
        aria-label={alt ? `放大查看图片：${alt}` : '放大查看图片'}
        title="放大查看图片"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex max-w-full cursor-zoom-in bg-transparent p-0 align-top focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
      >
        <img alt={alt} className={className} src={src} {...props} />
        <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-fd-border bg-fd-background/90 text-fd-muted-foreground opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="fixed inset-0 z-50 bg-fd-background/95 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex h-dvh flex-col" onClick={stopPropagation}>
            <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
              <span id={dialogTitleId} className="truncate text-sm font-medium text-fd-muted-foreground">
                {alt || '全屏查看图片'}
              </span>
              <button
                type="button"
                aria-label="关闭图片预览"
                title="关闭"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-card text-fd-muted-foreground transition hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8" onClick={() => setIsOpen(false)}>
              <div className="flex min-h-full items-center justify-center" onClick={stopPropagation}>
                <img
                  alt={alt}
                  className="h-auto max-h-[calc(100dvh-7rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  src={src}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
