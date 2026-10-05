import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  FileText,
  Link2,
  ClipboardCheck,
  Target,
  PenTool,
  Share2,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { getPublishedServices } from '@/lib/data/services';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'SEO, guest posting, link building, content marketing, PPC, social media marketing, SEO audits, and competitor analysis — Champion Nexus digital marketing services.',
  path: '/services',
});

/**
 * Static icon for each service.
 * Keys are the service title turned into a slug-style string
 * (lowercase, symbols replaced with "-").
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'seo': Search,
  'guest-posting': FileText,
  'link-building': Link2,
  'seo-audit': ClipboardCheck,
  'competitor-analysis': Target,
  'content-marketing': PenTool,
  'social-media-marketing': Share2,
  'seo-reporting-analytics': BarChart3,
};

function toKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getServiceIcon(title: string, slug?: string | null): LucideIcon {
  return (
    SERVICE_ICONS[toKey(title)] ??
    (slug ? SERVICE_ICONS[toKey(slug)] : undefined) ??
    Search // fallback for any new service you add later
  );
}

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <section className="pt-36 pb-16 md:pt-44 bg-surface-cream">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Services
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-4 max-w-2xl leading-tight">
            Digital marketing services built for growth
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = getServiceIcon(service.title, service.slug);
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="bg-white border border-line rounded-xl2 p-7 shadow-card hover:border-brand-orange/50 hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-orange-light flex items-center justify-center mb-5">
                    <Icon size={20} className="text-brand-orange" />
                  </div>
                  <h2 className="font-display font-bold text-ink mb-2">{service.title}</h2>
                  <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-1">
                    {service.short_description}
                  </p>
                  <span className="text-brand-orange text-sm font-display font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}