import type { MetadataRoute } from 'next';
import { getPublishedServices } from '@/lib/data/services';
import { getPublishedPosts } from '@/lib/data/blog';
import { SITE_URL } from '@/lib/seo/metadata';

const STATIC_ROUTES = ['/', '/about', '/services', '/team', '/blog', '/contact', '/privacy-policy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, { posts }] = await Promise.all([getPublishedServices(), getPublishedPosts(1)]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(),
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: new URL(`/services/${s.slug}`, SITE_URL).toString(),
    lastModified: new Date(s.updated_at),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: new URL(`/blog/${p.slug}`, SITE_URL).toString(),
    lastModified: new Date(p.updated_at),
  }));

  // The secret admin route, drafts, and API routes are intentionally never
  // included here — see robots.ts, which also blocks crawling them.
  return [...staticEntries, ...serviceEntries, ...postEntries];
}
