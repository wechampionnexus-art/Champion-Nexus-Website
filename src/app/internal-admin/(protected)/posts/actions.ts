'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export type PostFormState = { error?: string } | undefined;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseContent(raw: FormDataEntryValue | null): Record<string, unknown> {
  try {
    return raw ? JSON.parse(String(raw)) : {};
  } catch {
    return {};
  }
}

/**
 * Every action below calls requireAdminSession() itself — the (protected)
 * layout already blocks unauthenticated requests, but Server Actions are
 * independently callable endpoints, so each one must verify authorization
 * on its own rather than assuming it was only reached through the layout.
 */

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();

  const title = String(formData.get('title') || '').trim();
  const slugInput = String(formData.get('slug') || '').trim();
  const slug = slugify(slugInput || title);
  const publish = formData.get('status') === 'published';

  if (!title) return { error: 'Title is required.' };

  const { error } = await supabase.from('blog_posts').insert({
    title,
    slug,
    excerpt: String(formData.get('excerpt') || ''),
    content: parseContent(formData.get('content')),
    featured_image: String(formData.get('featured_image') || '') || null,
    featured_image_alt: String(formData.get('featured_image_alt') || '') || null,
    category: String(formData.get('category') || 'General'),
    author: String(formData.get('author') || 'Champion Nexus Team'),
    seo_title: String(formData.get('seo_title') || '') || null,
    meta_description: String(formData.get('meta_description') || '') || null,
    canonical_url: String(formData.get('canonical_url') || '') || null,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
  });

  if (error) {
    return { error: error.code === '23505' ? 'That slug is already in use.' : error.message };
  }

  revalidatePath('/blog');
  redirect(`${getAdminBasePath()}/posts`);
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();

  const title = String(formData.get('title') || '').trim();
  const slug = slugify(String(formData.get('slug') || '').trim() || title);
  const publish = formData.get('status') === 'published';

  if (!title) return { error: 'Title is required.' };

  // Only set published_at the first time a post transitions to published.
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('published, published_at')
    .eq('id', id)
    .single();

  const published_at =
    publish && !existing?.published_at ? new Date().toISOString() : existing?.published_at ?? null;

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title,
      slug,
      excerpt: String(formData.get('excerpt') || ''),
      content: parseContent(formData.get('content')),
      featured_image: String(formData.get('featured_image') || '') || null,
      featured_image_alt: String(formData.get('featured_image_alt') || '') || null,
      category: String(formData.get('category') || 'General'),
      author: String(formData.get('author') || 'Champion Nexus Team'),
      seo_title: String(formData.get('seo_title') || '') || null,
      meta_description: String(formData.get('meta_description') || '') || null,
      canonical_url: String(formData.get('canonical_url') || '') || null,
      published: publish,
      published_at,
    })
    .eq('id', id);

  if (error) {
    return { error: error.code === '23505' ? 'That slug is already in use.' : error.message };
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  redirect(`${getAdminBasePath()}/posts`);
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) return;

  await supabase.from('blog_posts').delete().eq('id', id);
  revalidatePath('/blog');
}
