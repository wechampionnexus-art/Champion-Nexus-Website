import type { Metadata } from 'next';

export const SITE_NAME = 'Champion Nexus';
export const SITE_URL = process.env.WEBSITE_URL || 'https://championnexus.pro';
export const DEFAULT_DESCRIPTION =
  'Champion Nexus helps businesses build search visibility and grow through SEO, content, link building, and digital marketing services.';

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string; // e.g. "/about" — defaults to "/"
  image?: string;
  noIndex?: boolean;
};

/**
 * Centralized helper so every page gets a consistent title template,
 * canonical URL, and Open Graph/Twitter metadata without repeating
 * boilerplate. Pages still provide their own title/description.
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = image ?? new URL('/og-default.png', SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
