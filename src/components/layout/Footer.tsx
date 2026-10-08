import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';

const SERVICE_LINKS = [
  { href: '/services/search-engine-optimization', label: 'SEO' },
  { href: '/services/guest-posting', label: 'Guest Posting' },
  { href: '/services/link-building', label: 'Link Building' },
  { href: '/services/content-marketing', label: 'Content Marketing' },
  { href: '/services/social-media-marketing', label: 'Social Media' },
  { href: '/services/seo-audit', label: 'SEO Audit' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];
const SOCIAL_LINKS = [
  { href: '#', label: 'LinkedIn' },
  { href: 'https://www.facebook.com/share/19ZrFzFbW1/', label: 'Facebook' },
  { href: '#', label: 'Instagram' },
 
];

export function Footer() {
  return (
    <footer className="bg-surface-gray border-t border-line pt-16 pb-8">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-start gap-2.5 mb-4 justify-start">
              <Image src="/logo.png" alt="Champion Nexus" width={120} height={120} />
              
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
              SEO, content marketing, and growth strategies designed to strengthen your online
              presence.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Linkedin, Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link (to be configured by the client)"
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-muted hover:text-brand-orange hover:border-brand-orange transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-muted hover:text-brand-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink text-sm mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-muted hover:text-brand-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-ink text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-ink-muted hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <span>© {new Date().getFullYear()} Champion Nexus. All rights reserved.</span>
          <span>Developed by <a href="https://waqar-ali-portfolio-ten.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand-orange transition-colors">
            Waqar Ali
          </a></span>
        </div>
      </div>
    </footer>
  );
}
