import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { buildMetadata, SITE_NAME } from '@/lib/seo/metadata';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${SITE_NAME} | SEO & Digital Marketing Agency`,
    path: '/',
  }),
  title: { default: `${SITE_NAME} | SEO & Digital Marketing Agency`, template: `%s | ${SITE_NAME}` },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://championnexus.pro'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

/**
 * Intentionally minimal: NO <Header /> / <Footer /> here anymore. Every
 * route in the app nests under this layout — including the admin
 * dashboard — so putting the public site chrome here would leak onto
 * admin pages. Public pages get Header/Footer from
 * src/app/(site)/layout.tsx instead; the admin dashboard supplies its own
 * chrome in src/app/internal-admin/(protected)/layout.tsx.
 *
 * FIX #1 (loading screen): the 1-2s delay the client is masking is a
 * SERVER render delay (data fetch + SSR work happening before any HTML
 * reaches the browser) — so a React/GSAP-driven loader can't help, since
 * React hasn't even loaded yet during that window. Instead:
 *   - The loader markup is written directly into this server component,
 *     so it is part of the very first HTML byte Next.js streams down —
 *     the browser paints it before any JS has parsed.
 *   - It's hidden by a plain inline <script>, not next/script and not a
 *     client component, so it never waits on hydration or a JS bundle.
 *   - A <noscript> rule hides it immediately if JS is disabled, and a
 *     4s safety timeout force-hides it if the load event is somehow
 *     missed, so it can never get stuck covering the site.
 *
 * IMPORTANT (fixed bug): the script only ever adds a CSS class to hide
 * this div — it never calls removeChild/remove() on it. This div is
 * still part of React's own hydrated tree (the whole <body> is, since
 * this is a server component), so physically detaching it with vanilla
 * JS causes React's reconciler to lose track of a node it thinks it
 * still owns. The first version of this file did call removeChild here,
 * and it surfaced later as "NotFoundError: Failed to execute
 * 'removeChild' on 'Node'" (React's own removeChildFromContainer trying
 * to remove the same, already-detached node) the next time React
 * committed anywhere in the tree — e.g. on a client-side navigation to
 * another page. Leaving the node in the DOM (just invisible and
 * non-interactive via opacity/pointer-events/visibility) avoids that
 * class of bug entirely, at the cost of one permanently-present,
 * permanently-hidden ~100px div.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {/* FIX #1: logo loading screen — see comment above for why this is
            plain markup/CSS/script rather than a React component. */}
        <div
          id="site-loader"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            background: '#FAF9F6',
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Swap the src below for the real logo asset path in /public
              (e.g. /logo.png) if it differs. */}
          <img
            src="/logo.png"
            alt="Champion Nexus"
            width={72}
            height={72}
            style={{ width: 72, height: 72, objectFit: 'contain', animation: 'site-loader-pulse 1.1s ease-in-out infinite' }}
          />
          <div
            style={{
              width: 36,
              height: 3,
              borderRadius: 2,
              background: '#E5E7EB',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#E95516',
                animation: 'site-loader-bar 1.1s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Loader-only styles/keyframes, scoped by id/class names unlikely
            to collide with the rest of the site. */}
        <style>{`
          @keyframes site-loader-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.94); } }
          @keyframes site-loader-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          #site-loader.site-loader-hidden { opacity: 0; pointer-events: none; visibility: hidden; }
        `}</style>

        {/* If JS is disabled, don't leave the loader covering the page
            forever — hide it outright. */}
        <noscript>
          <style>{`#site-loader { display: none !important; }`}</style>
        </noscript>

        {/* Plain inline script (not next/script) so it runs as soon as the
            browser parses this point in the HTML stream, independent of
            Next.js's own JS bundle loading/hydrating. Hides the loader
            once the page has fully loaded, with a hard 4s fallback so a
            missed/late 'load' event (slow images, etc.) can never leave it
            stuck on screen.

            Deliberately only ever toggles a class (never removeChild/
            remove()) — see the comment on this component for why
            physically detaching this node breaks React. idempotent/
            re-entrant-safe since it's just a classList add, called at
            most a few times. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function hideLoader() {
                  var el = document.getElementById('site-loader');
                  if (!el) return;
                  el.classList.add('site-loader-hidden');
                }
                if (document.readyState === 'complete') {
                  hideLoader();
                } else {
                  window.addEventListener('load', hideLoader);
                }
                setTimeout(hideLoader, 4000);
              })();
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}