import type { MetadataRoute } from 'next';
import { getPublishedServices } from '@/lib/data/services';
import { getPublishedPosts } from '@/lib/data/blog';

// 1. Clean the domain string to completely avoid trailing slash discrepancies
const BASE_URL = (process.env.WEBSITE_URL || 'https://championnexus.pro').replace(/\/\$/, '');

const STATIC_ROUTES = ['', '/about', '/services', '/team', '/blog', '/contact', '/privacy-policy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, { posts }] = await Promise.all([getPublishedServices(), getPublishedPosts(1)]);

  // 2. Set a baseline fallback date for static pages instead of a dynamic live timestamp
  const deploymentDate = new Date('2026-10-08'); 

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: deploymentDate,
    changeFrequency: path === '' ? 'daily' : 'monthly',
    priority: path === '' ? 1.0 : 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : deploymentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : deploymentDate,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries];
}
