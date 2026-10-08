import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { buildMetadata, SITE_NAME } from '@/lib/seo/metadata';
import Image from 'next/image';
import PageTransitionLoader from '@/components/PageTransitionLoader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${SITE_NAME} | SEO & Content Marketing Agency`,
    path: '/',
  }),
  title: { default: `${SITE_NAME} | SEO & Content Marketing Agency`, template: `%s | ${SITE_NAME}` },
  metadataBase: new URL(process.env.WEBSITE_URL || 'https://championnexus.pro/'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {/* INLINE RAW HTML INJECTION: This makes sure the animation shows on initial load 
            and deep-linked admin pages before React even parses. */}
        <div
          id="global-initial-loader"
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
          }}
        >
          <Image
            src="/logo.png"
            alt="Champion Nexus"
            width={100}
            height={100}
            priority
            style={{ width: 100, height: 100, objectFit: 'contain', animation: 'site-loader-pulse 1.1s ease-in-out infinite' }}
          />
          <div style={{ width: 36, height: 3, borderRadius: 2, background: '#E5E7EB', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#E95516', animation: 'site-loader-bar 1.1s ease-in-out infinite' }} />
          </div>
        </div>

        <style>{`
          @keyframes site-loader-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.94); } }
          @keyframes site-loader-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `}</style>

        {children}

        {/* This handles client navigation, back button, and admin dashboard transitions */}
        <PageTransitionLoader />
      </body>
    </html>
  );
}
