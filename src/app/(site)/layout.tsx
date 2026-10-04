import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * This file goes at: src/app/(site)/layout.tsx
 *
 * The "(site)" folder is a Next.js route group — the parentheses mean it
 * does NOT appear in the URL. /about still renders at /about, not
 * /(site)/about. Its only job is to let this one layout (with Header and
 * Footer) apply to every public page, without also applying to
 * /internal-admin, which lives outside this group.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}