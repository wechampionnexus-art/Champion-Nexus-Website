import { NextRequest, NextResponse } from 'next/server';

/**
 * The admin dashboard is implemented under the fixed internal path
 * /internal-admin, but it must never be reachable at that literal URL —
 * only at the slug configured via ADMIN_ROUTE_SLUG. This file:
 *
 *   1. Blocks any direct request to /internal-admin(/...) with a 404,
 *      so guessing the real implementation path doesn't work.
 *   2. Rewrites requests at /<ADMIN_ROUTE_SLUG>(/...) to /internal-admin(/...)
 *      transparently, preserving the slug in the browser's address bar.
 *
 * IMPORTANT: this is obscurity, not security. The actual authorization
 * check (Supabase session + admin_profiles role) happens server-side in
 * src/app/internal-admin/layout.tsx on every request, regardless of how
 * the request got there. Never remove that check.
 */

const INTERNAL_PREFIX = '/internal-admin';

function getAdminSlug(): string {
  const slug = process.env.ADMIN_ROUTE_SLUG?.trim().replace(/^\/+|\/+$/g, '');
  return slug && slug.length > 0 ? slug : 'champion-secret-admin-nexus';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSlug = getAdminSlug();
  const publicPrefix = `/${adminSlug}`;

  // 1. Never allow the internal implementation path to be reached directly.
  // Returned directly (not via NextResponse.rewrite to a page), so the
  // response status is unambiguously a real 404 regardless of Next.js
  // version behavior around rewrite + custom status combinations.
  if (pathname === INTERNAL_PREFIX || pathname.startsWith(`${INTERNAL_PREFIX}/`)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 2. Rewrite the configured secret slug to the internal implementation.
  if (pathname === publicPrefix || pathname.startsWith(`${publicPrefix}/`)) {
    const rest = pathname.slice(publicPrefix.length);
    const url = request.nextUrl.clone();
    url.pathname = `${INTERNAL_PREFIX}${rest}`;

    // Server Components/Actions under /internal-admin need to build
    // redirect URLs (e.g. "not signed in -> go to login") that point at the
    // PUBLIC slug the browser is actually using, not the internal path
    // (redirecting to /internal-admin/login would just hit the 404 block
    // above). Pass the public base through as a request header so
    // src/app/internal-admin/(protected)/layout.tsx and the login action
    // can read it via next/headers.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-base', publicPrefix);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets and image optimization,
     * which can never be admin-route paths anyway.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
