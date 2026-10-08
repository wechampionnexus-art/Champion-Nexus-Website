import 'server-only';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { createClient } from '@supabase/supabase-js';
import type { BlogPost } from '@/types/database';

/**
 * BUG FIX: every function in this file is a PUBLIC, anonymous read —
 * all of them filter `.eq('published', true)` and none of them depend
 * on who's visiting or any session at all. The previous version routed
 * these through `getSupabaseClient()`, which picked between a
 * build-time-only plain client and `createServerSupabaseClient()` (the
 * cookie-bound client meant for the admin dashboard's session-aware
 * reads) based on `NEXT_PHASE`.
 *
 * That worked during `next build` (NEXT_PHASE is 'phase-production-build'
 * then, so it used the plain client), but broke at actual runtime: once
 * deployed, NEXT_PHASE is no longer that value, so every real request to
 * a statically-generated page (this page uses generateStaticParams) fell
 * through to the cookie-bound client — and merely CALLING cookies()
 * inside a page Next.js already committed to serving statically is what
 * immediately triggers "Page changed from static to dynamic at runtime,
 * reason: cookies", which surfaced as the 500 on Vercel.
 *
 * Fix: these public reads now always use one plain Supabase client built
 * from the public anon key — the same client, used the same way, at
 * build time and at runtime. No `cookies()` call anywhere in this file,
 * so there's nothing left to trigger the static->dynamic flip. The
 * admin dashboard's own data-fetching code is untouched — it's meant to
 * use the cookie-bound client, since IT actually needs the signed-in
 * admin's session, unlike anything here.
 */
const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const PAGE_SIZE = 9;

/** Demo post shown only when Supabase has no published posts yet. */
const DEMO_POSTS: BlogPost[] = [
  {
    id: 'demo-1',
    title: 'Welcome to the Champion Nexus blog',
    slug: 'welcome-to-the-blog',
    excerpt: 'This is a demo post. Publish your first real article from the admin dashboard to replace it.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is placeholder content shown because no posts have been published yet. Log in to the admin dashboard to create your first real article.',
            },
          ],
        },
      ],
    },
    featured_image: null,
    featured_image_alt: null,
    category: 'General',
    tags: [],
    author: 'Champion Nexus Team',
    seo_title: null,
    meta_description: null,
    canonical_url: null,
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedPosts(
  page = 1,
  opts?: { category?: string; search?: string }
): Promise<{ posts: BlogPost[]; total: number; isDemo: boolean }> {
  if (!isSupabaseConfigured()) return { posts: DEMO_POSTS, total: DEMO_POSTS.length, isDemo: true };

  const supabase = publicSupabase;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (opts?.category && opts.category !== 'All') {
    query = query.eq('category', opts.category);
  }
  if (opts?.search) {
    query = query.ilike('title', `%${opts.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('getPublishedPosts failed:', error.message);
    return { posts: [], total: 0, isDemo: false };
  }
  if (!data || data.length === 0) {
    if (page === 1 && !opts?.category && !opts?.search) {
      return { posts: DEMO_POSTS, total: DEMO_POSTS.length, isDemo: true };
    }
    return { posts: [], total: count ?? 0, isDemo: false };
  }
  return { posts: data, total: count ?? data.length, isDemo: false };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = publicSupabase;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('getPostBySlug failed:', error.message);
    return null;
  }
  return data;
}

export async function getRelatedPosts(category: string, excludeSlug: string): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = publicSupabase;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('getRelatedPosts failed:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllCategories(): Promise<string[]> {
  if (!isSupabaseConfigured()) return ['General'];

  const supabase = publicSupabase;
  const { data, error } = await supabase.from('blog_posts').select('category').eq('published', true);

  if (error || !data) return [];
  return Array.from(new Set(data.map((row) => row.category)));
}

export const BLOG_PAGE_SIZE = PAGE_SIZE;