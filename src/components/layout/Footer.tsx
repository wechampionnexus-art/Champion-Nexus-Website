import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

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
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.facebook.com/share/19ZrFzFbW1/', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Instagram, label: 'Instagram' },
];

// Phone number isn't live yet — fill it in here whenever it's ready and
// its card appears automatically below. No other change needed.
const CONTACT_PHONE = '';
const CONTACT_EMAIL = 'marketing@championnexus.pro';
const CONTACT_LOCATION = 'Near Lyallpur Galleria 2, Samundri Road, Faisalabad, Punjab, Pakistan';

const CONTACT_DETAILS = [
  CONTACT_PHONE && { icon: Phone, label: 'Phone', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE}` },
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: MapPin, label: 'Location', value: CONTACT_LOCATION, href: undefined },
].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

export function Footer() {
  return (
    <footer className="bg-surface-gray border-t border-line pt-16 pb-8">
      <div className="max-w-container mx-auto px-5 md:px-8">
        {/* Contact Details — full-width row of its own, above the link columns */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="sm:col-span-2 md:col-span-2">
            <Link href="/" className="flex items-start gap-2.5 mb-4 justify-start">
              <Image src="/logo.png" alt="Champion Nexus" width={120} height={120} />
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
              SEO, content marketing, and growth strategies designed to strengthen your online
              presence.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={`Visit our ${social.label} page`}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-muted hover:text-brand-orange hover:border-brand-orange transition-colors"
                >
                  <social.icon size={16} />
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
          <div className="mb-14">
          <h4 className="font-display font-semibold text-ink text-sm mb-5">Contact us</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTACT_DETAILS.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <span className="w-11 h-11 rounded-xl2 bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-ink-soft mb-0.5">{item.label}</span>
                    <span className="block text-sm font-medium text-ink leading-snug break-words">
                      {item.value}
                    </span>
                  </span>
                </>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3.5 bg-white border border-line rounded-xl2 p-4 hover:border-brand-orange transition-colors"
                >
                  {body}
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-center gap-3.5 bg-white border border-line rounded-xl2 p-4"
                >
                  {body}
                </div>
              );
            })}
          </div>
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