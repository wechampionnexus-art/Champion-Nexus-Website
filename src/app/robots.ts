import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

/**
 * IMPORTANT: the configured ADMIN_ROUTE_SLUG is deliberately NOT listed
 * here. robots.txt is a public, commonly-scanned file — listing a "secret"
 * path in it would advertise exactly the path we're trying to keep
 * unguessable. The admin route is instead protected by:
 *   1. Never being linked from any page, nav, or sitemap.
 *   2. A `noindex` meta tag rendered on every admin page itself
 *      (see src/app/internal-admin/layout.tsx).
 *   3. Real server-side authorization on every request (the actual
 *      security boundary — see src/lib/auth/getAdminSession.ts).
 * /internal-admin is safe to list below: middleware.ts always returns a
 * 404 for that literal path regardless of robots.txt, so listing it here
 * reveals nothing exploitable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/internal-admin'],
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  };
}
