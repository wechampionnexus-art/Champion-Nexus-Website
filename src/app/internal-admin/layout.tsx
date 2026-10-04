import type { Metadata } from 'next';

// Defense in depth: even though this path is never linked anywhere and is
// excluded from the sitemap, mark the entire admin segment noindex so it
// can never appear in search results if somehow discovered and crawled.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Intentionally minimal: this wraps BOTH /login (public within this
  // segment) and the authenticated dashboard (see (protected)/layout.tsx,
  // which does the real auth check). Keeping auth logic out of this file
  // avoids a login-page redirect loop.
  return <div className="min-h-screen bg-surface-gray font-sans">{children}</div>;
}
