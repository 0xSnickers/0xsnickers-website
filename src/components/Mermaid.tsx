'use client';

import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

type MermaidProps = {
  chart: string;
  className?: string;
};

export default function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderChart = useCallback(async (target: HTMLDivElement, renderId: string) => {
    const dompurifyModule = await import('dompurify');
    const dompurify = dompurifyModule.default as typeof dompurifyModule.default & {
      sanitize?: (input: string, config?: unknown) => string;
      addHook?: (hook: string, cb: (node: Element) => void) => void;
    };

    if (typeof dompurify === 'function' && typeof dompurify.sanitize !== 'function') {
      const purifier = dompurify(window);
      Object.assign(dompurify, {
        sanitize: purifier.sanitize.bind(purifier),
        addHook: purifier.addHook.bind(purifier),
      });
    }

    const mermaid = (await import('mermaid')).default;

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: prefersDark ? 'dark' : 'default',
      themeVariables: {
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        fontSize: '16px',
        fontSizeMapping: '16px',
        primaryColor: prefersDark ? '#e6e6ff' : '#2b2b2b',
        secondaryColor: prefersDark ? '#c9d0ff' : '#6b6b6b',
        lineColor: prefersDark ? '#9ca3ff' : '#c7c7c7',
        textColor: prefersDark ? '#e6e6e6' : '#111827',
        noteBkgColor: prefersDark ? '#1f2937' : '#f8fafc',
        actorTextColor: prefersDark ? '#f3f4f6' : '#0f172a',
      },
    });

    await mermaid.parse(chart);
    const { svg } = await mermaid.render(renderId, chart);

    target.innerHTML = svg;

    const svgEl = target.querySelector('svg');
    if (svgEl) {
      svgEl.setAttribute('role', 'img');
      svgEl.style.maxWidth = '100%';
      svgEl.style.height = 'auto';

      svgEl.querySelectorAll('[stroke-opacity]').forEach((n) => n.removeAttribute('stroke-opacity'));
      svgEl.querySelectorAll('path, line').forEach((el) => {
        (el as SVGElement).setAttribute('stroke-width', '1.5');
        (el as SVGElement).setAttribute('stroke-linecap', 'round');
      });

      svgEl.querySelectorAll('text').forEach((t) => {
        (t as SVGTextElement).style.fill = prefersDark ? '#e6e6e6' : '#0f172a';
        (t as SVGTextElement).style.fontSize = '16px';
      });
    }
  }, [chart]);

  useEffect(() => {
    let cancelled = false;

    const renderInlineChart = async () => {
      if (!containerRef.current) return;

      try {
        await renderChart(containerRef.current, `mermaid-${id}`);
        if (!cancelled) setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Mermaid rendering failed');
        }
      }
    };

    renderInlineChart();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => renderInlineChart();
    mq.addEventListener?.('change', onChange);

    return () => {
      cancelled = true;
      mq.removeEventListener?.('change', onChange);
    };
  }, [chart, id, renderChart]);

  useEffect(() => {
    if (!isFullscreen) return;

    let cancelled = false;

    const renderFullscreenChart = async () => {
      if (!fullscreenRef.current) return;

      try {
        await renderChart(fullscreenRef.current, `mermaid-${id}-fullscreen`);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Mermaid rendering failed');
        }
      }
    };

    renderFullscreenChart();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const previousOverflow = document.body.style.overflow;
    const onChange = () => renderFullscreenChart();

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    mq.addEventListener?.('change', onChange);

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener?.('change', onChange);
    };
  }, [chart, id, isFullscreen, renderChart]);

  return (
    <div className={`my-6 ${className ?? ''}`.trim()}>
      <div className="group relative overflow-x-auto rounded-lg border border-fd-border bg-fd-card/40 p-4">
        <button
          type="button"
          aria-label="全屏查看流程图"
          title="全屏查看流程图"
          onClick={() => setIsFullscreen(true)}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-fd-border bg-fd-background/90 text-fd-muted-foreground opacity-80 shadow-sm transition hover:text-fd-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <div ref={containerRef} className="flex min-w-max justify-center pr-8" />
      </div>
      {error ? <pre className="rounded-md bg-zinc-100 p-3 text-sm text-red-600">{error}</pre> : null}
      {isFullscreen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="全屏流程图"
          className="fixed inset-0 z-50 bg-fd-background/95 backdrop-blur-sm"
        >
          <div className="flex h-dvh flex-col">
            <div className="flex items-center justify-between border-b border-fd-border px-4 py-3">
              <span className="text-sm font-medium text-fd-muted-foreground">全屏查看流程图</span>
              <button
                type="button"
                aria-label="关闭全屏流程图"
                title="关闭"
                onClick={() => setIsFullscreen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-fd-border bg-fd-card text-fd-muted-foreground transition hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div ref={fullscreenRef} className="flex min-h-full min-w-max items-center justify-center" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
