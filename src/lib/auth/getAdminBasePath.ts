import 'server-only';
import { headers } from 'next/headers';

/**
 * Returns the public admin base path (the configured secret slug, with a
 * leading slash, e.g. "/champion-secret-admin-nexus") as seen by the
 * browser. Set by middleware.ts on every rewritten admin request. Always
 * use this — never hardcode "/internal-admin" in a redirect() call, or
 * users get redirected straight into the direct-access 404 block.
 */
export function getAdminBasePath(): string {
  const fromHeader = headers().get('x-admin-base');
  if (fromHeader) return fromHeader;

  // Fallback (e.g. if this is ever called outside a request that went
  // through middleware) — mirrors the default in middleware.ts.
  const slug = process.env.ADMIN_ROUTE_SLUG?.trim().replace(/^\/+|\/+$/g, '');
  return `/${slug && slug.length > 0 ? slug : 'champion-secret-admin-nexus'}`;
}
