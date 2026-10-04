import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { getPublishedServices } from '@/lib/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';

function resolveIcon(name: string | null) {
  if (!name) return Icons.Sparkles;
  const key = name
    .split('-')
    .map((part, i) => (i === 0 ? part : part[0]?.toUpperCase() ?? '') + part.slice(1))
    .join('') as keyof typeof Icons;
  const Icon = Icons[key] as typeof Icons.Sparkles | undefined;
  return Icon ?? Icons.Sparkles;
}

export async function FeaturedServices() {
  const services = await getPublishedServices();
  const items = services.slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-surface-cream">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeading title="What we do" className="mb-0" />
          <ButtonLink href="/services" variant="outline" className="w-fit">
            View all services <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((service) => {
            const Icon = resolveIcon(service.icon);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-white border border-line rounded-xl2 p-7 shadow-card hover:border-brand-orange/50 hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-orange-light flex items-center justify-center mb-5">
                  <Icon size={20} className="text-brand-orange" />
                </div>
                <h3 className="font-display font-bold text-ink mb-2">{service.title}</h3>
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
  );
}
