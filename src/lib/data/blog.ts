import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { createClient } from '@supabase/supabase-js';
import type { BlogPost } from '@/types/database';

const buildTimeSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Gets a clean supabase client instance depending on execution scope.
 * Accommodates production build cycles, request paths, and request-less
 * local development page generation routines safely.
 */
function getSupabaseClient() {
  // 1. Immediately bypass if we are strictly in a production build pipeline
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return buildTimeSupabase;
  }

  // 2. Wrap the execution context in a try/catch block to support local dev checks safely
  try {
    return createServerSupabaseClient();
  } catch (error: any) {
    // If Next.js throws an out-of-scope cookie fault locally, fall back to the clean client instance
    if (error?.message?.includes('cookies') || error?.message?.includes('request scope')) {
      return buildTimeSupabase;
    }
    // Rethrow any completely unexpected errors so they don't stay hidden
    throw error;
  }
}

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

  const supabase = getSupabaseClient();
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

  const supabase = getSupabaseClient();
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

  const supabase = getSupabaseClient();
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

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('blog_posts').select('category').eq('published', true);

  if (error || !data) return [];
  return Array.from(new Set(data.map((row) => row.category)));
}

export const BLOG_PAGE_SIZE = PAGE_SIZE;
