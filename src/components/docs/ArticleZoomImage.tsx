'use client';

import { X } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

type ArticleZoomImageProps = {
  children: ReactNode;
};

type ActiveImage = {
  alt: string;
  src: string;
};

function isZoomableImage(target: EventTarget | null): target is HTMLImageElement {
  return target instanceof HTMLImageElement && target.dataset.articleZoomable === 'true';
}

function shouldOpenZoom(image: HTMLImageElement) {
  const src = image.currentSrc || image.getAttribute('src') || '';
  const isInsideButton = image.closest('button') !== null;
  const isInsideLink = image.closest('a') !== null;
  const isInsideNoProse = image.closest('.not-prose') !== null;
  const isTinyIcon = image.clientWidth > 0 && image.clientWidth <= 40 && image.clientHeight > 0 && image.clientHeight <= 40;

  return src.length > 0 && !isInsideButton && !isInsideLink && !isInsideNoProse && !isTinyIcon;
}

export default function ArticleZoomImage({ children }: ArticleZoomImageProps) {
  const dialogTitleId = useId().replace(/:/g, '');
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeImage]);

  const title = useMemo(() => activeImage?.alt || '全屏查看图片', [activeImage]);

  const stopPropagation = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isZoomableImage(event.target) || !shouldOpenZoom(event.target)) return;

    const src = event.target.currentSrc || event.target.getAttribute('src') || '';
    if (!src) return;

    setActiveImage({
      alt: event.target.alt || '',
      src,
    });
  };

  return (
    <div data-article-zoom-root onClickCapture={handleClickCapture}>
      {children}
      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="fixed inset-0 z-50 bg-fd-background/95 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <div className="flex h-dvh flex-col" onClick={stopPropagation}>
            <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
              <span id={dialogTitleId} className="truncate text-sm font-medium text-fd-muted-foreground">
                {title}
              </span>
              <button
                type="button"
                aria-label="关闭图片预览"
                title="关闭"
                onClick={() => setActiveImage(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-card text-fd-muted-foreground transition hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8" onClick={() => setActiveImage(null)}>
              <div className="flex min-h-full items-center justify-center" onClick={stopPropagation}>
                <img
                  alt={activeImage.alt}
                  className="h-auto max-h-[calc(100dvh-7rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  src={activeImage.src}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
