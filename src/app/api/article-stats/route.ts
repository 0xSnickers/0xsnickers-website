import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

type ArticleStats = {
  slug: string;
  views: number;
  likes: number;
  publishedAt: string | null;
};

type ArticleStatsRpcResult = {
  article_slug: string;
  article_views: number;
  article_likes: number;
  article_published_at: string | null;
};

type ArticleStatsRow = {
  slug: string;
  views: number;
  likes: number;
  published_at: string | null;
};

function fromRpcResult(data: ArticleStatsRpcResult): ArticleStats {
  return {
    slug: data.article_slug,
    views: data.article_views,
    likes: data.article_likes,
    publishedAt: data.article_published_at,
  };
}

function fromRow(data: ArticleStatsRow): ArticleStats {
  return {
    slug: data.slug,
    views: data.views,
    likes: data.likes,
    publishedAt: data.published_at,
  };
}

function emptyStats(slug: string, publishedAt: string | null = null): ArticleStats {
  return {
    slug,
    views: 0,
    likes: 0,
    publishedAt,
  };
}

function getSlug(url: string) {
  const { searchParams } = new URL(url);
  return searchParams.get('slug')?.trim();
}

function normalizePublishedAt(value: unknown) {
  if (typeof value !== 'string') return null;

  const publishedAt = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ? publishedAt : null;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')
    ?? request.headers.get('cf-connecting-ip')
    ?? 'unknown';
}

function hashVisitorIp(request: Request) {
  const salt = process.env.ARTICLE_STATS_IP_SALT ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const ip = getClientIp(request);

  return createHash('sha256')
    .update(`${salt}:${ip}`)
    .digest('hex');
}

export async function GET(request: Request) {
  const slug = getSlug(request.url);
  const { searchParams } = new URL(request.url);
  const publishedAt = normalizePublishedAt(searchParams.get('publishedAt'));

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('article_stats')
    .select('slug, views, likes, published_at')
    .eq('slug', slug)
    .maybeSingle<ArticleStatsRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? fromRow(data) : emptyStats(slug, publishedAt));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const action = body?.action;
  const publishedAt = normalizePublishedAt(body?.publishedAt);

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  }

  const supabase = createSupabaseClient();

  if (action === 'view') {
    const { data, error } = await supabase
      .rpc('record_article_view', {
        p_slug: slug,
        p_visitor_hash: hashVisitorIp(request),
        p_published_at: publishedAt,
      })
      .single<ArticleStatsRpcResult>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(fromRpcResult(data));
  }

  if (action === 'like' || action === 'unlike') {
    const { data, error } = await supabase
      .rpc('adjust_article_like', {
        p_slug: slug,
        p_delta: action === 'like' ? 1 : -1,
        p_published_at: publishedAt,
      })
      .single<ArticleStatsRpcResult>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(fromRpcResult(data));
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}
