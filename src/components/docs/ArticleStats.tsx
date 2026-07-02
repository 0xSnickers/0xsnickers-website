'use client';

import { CalendarDays, Eye, Heart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Stats = {
  slug: string;
  views: number;
  likes: number;
  publishedAt: string | null;
};

function formatCount(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPublishedAt(value: string) {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function ArticleStats({ slug, publishedAt }: { slug: string; publishedAt?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [likeAnimationKey, setLikeAnimationKey] = useState(0);
  const storageKey = useMemo(() => `article-liked:${slug}`, [slug]);
  const displayPublishedAt = stats?.publishedAt ?? publishedAt;

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const params = new URLSearchParams({ slug });
        if (publishedAt) {
          params.set('publishedAt', publishedAt);
        }

        const [currentResponse, viewResponse] = await Promise.all([
          fetch(`/api/article-stats?${params.toString()}`),
          fetch('/api/article-stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug, action: 'view', publishedAt }),
          }),
        ]);

        const nextStats = viewResponse.ok
          ? await viewResponse.json()
          : await currentResponse.json();

        if (!cancelled) {
          setStats(nextStats);
        }
      } catch {
        if (!cancelled) {
          setStats({
            slug,
            views: 0,
            likes: 0,
            publishedAt: publishedAt ?? null,
          });
        }
      }
    }

    setLiked(window.localStorage.getItem(storageKey) === '1');
    loadStats();

    return () => {
      cancelled = true;
    };
  }, [slug, storageKey, publishedAt]);

  async function toggleLike() {
    if (pending || !stats) return;

    const nextLiked = !liked;
    const action = nextLiked ? 'like' : 'unlike';

    setPending(true);
    setLiked(nextLiked);
    setLikeAnimationKey((key) => key + 1);
    setStats({
      ...stats,
      likes: Math.max(0, stats.likes + (nextLiked ? 1 : -1)),
    });

    try {
      const response = await fetch('/api/article-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, action, publishedAt }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like count.');
      }

      const nextStats = await response.json();
      setStats(nextStats);

      if (nextLiked) {
        window.localStorage.setItem(storageKey, '1');
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      setLiked(!nextLiked);
      setStats(stats);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="not-prose mb-8 flex flex-wrap items-center gap-3 text-sm text-fd-muted-foreground">
      {displayPublishedAt ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1.5">
          <CalendarDays className="size-4" />
          发布于 {formatPublishedAt(displayPublishedAt)}
        </span>
      ) : null}

      <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1.5">
        <Eye className="size-4" />
        {formatCount(stats?.views ?? 0)} views
      </span>

      <button
        type="button"
        onClick={toggleLike}
        disabled={pending || !stats}
        className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-fd-accent hover:text-fd-accent-foreground hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 data-[liked=true]:border-red-200 data-[liked=true]:bg-red-50 data-[liked=true]:text-red-600 data-[liked=true]:shadow-red-500/10 dark:data-[liked=true]:border-red-900/70 dark:data-[liked=true]:bg-red-950/40 dark:data-[liked=true]:text-red-300"
        data-liked={liked}
        aria-pressed={liked}
        aria-label={liked ? '取消点赞这篇文章' : '点赞这篇文章'}
      >
        <span
          key={`heart-${likeAnimationKey}-${liked ? 'liked' : 'plain'}`}
          className={liked ? 'article-like-heart article-like-heart-liked' : 'article-like-heart'}
        >
          <Heart className={liked ? 'size-4 fill-current' : 'size-4'} />
        </span>
        <span className="min-w-12 text-left transition-all duration-200">
          {liked ? 'unlike' : 'like'}
        </span>
        <span
          key={`count-${likeAnimationKey}-${stats?.likes ?? 0}`}
          className="article-like-count tabular-nums text-fd-muted-foreground transition-colors duration-200 group-data-[liked=true]:text-current"
        >
          {formatCount(stats?.likes ?? 0)}
        </span>
      </button>
    </div>
  );
}
