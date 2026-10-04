import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { createClient } from '@supabase/supabase-js';
import type { Service } from '@/types/database';

const buildTimeSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Gets a clean supabase client instance depending on execution scope.
 * Safe for production builds, local development server compilation, 
 * and standard request-time user actions.
 */
function getSupabaseClient() {
  // 1. Immediately bypass if we are strictly in a production build pipeline
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return buildTimeSupabase;
  }

  // 2. Wrap the server-client in a try/catch to absorb local dev request-scope failures
  try {
    return createServerSupabaseClient();
  } catch (error: any) {
    // If Next.js throws a request-scope or cookie error during dev compilation, use the static client
    if (error?.message?.includes('cookies') || error?.message?.includes('request scope')) {
      return buildTimeSupabase;
    }
    // If it's a completely different error, throw it normally so we can debug it
    throw error;
  }
}

/**
 * DEMO content — only used when Supabase isn't configured yet, so the site
 * is viewable during local setup. Content matches supabase/migrations/
 * 0002_seed_services.sql; once Supabase is connected, that migration's rows
 * are the real source of truth and this constant is never read.
 */
const DEMO_SERVICES: Service[] = [
  {
    id: 'demo-1',
    title: 'Search Engine Optimization',
    slug: 'search-engine-optimization',
    short_description:
      'Technical, on-page, and content SEO built to improve how your business shows up in search over time.',
    description: '<p>Demo content — connect Supabase and run the seed migration to replace this.</p>',
    icon: 'search',
    featured: true,
    published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Guest Posting',
    slug: 'guest-posting',
    short_description: 'Earn visibility and relevant backlinks through placements on sites your audience already reads.',
    description: '<p>Demo content — connect Supabase and run the seed migration to replace this.</p>',
    icon: 'pen-line',
    featured: true,
    published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Link Building',
    slug: 'link-building',
    short_description: "Relevant, quality-focused backlink strategies that strengthen your site's authority.",
    description: '<p>Demo content — connect Supabase and run the seed migration to replace this.</p>',
    icon: 'link',
    featured: false,
    published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) return DEMO_SERVICES;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getPublishedServices failed:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_SERVICES.find((s) => s.slug === slug) ?? null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('getServiceBySlug failed:', error.message);
    return null;
  }
  return data;
}
