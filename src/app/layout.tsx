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
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}