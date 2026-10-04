import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getServiceBySlug, getPublishedServices } from '@/lib/data/services';
import { buildMetadata } from '@/lib/seo/metadata';
import { ButtonLink } from '@/components/ui/Button';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: 'Service not found', path: `/services/${params.slug}`, noIndex: true });
  return buildMetadata({
    title: service.title,
    description: service.short_description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const safeHtml = DOMPurify.sanitize(service.description, {
    ALLOWED_TAGS: ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href'],
  });

  return (
    <>
      <nav aria-label="Breadcrumb" className="pt-32 md:pt-40">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Link href="/services" className="text-xs font-display font-semibold text-ink-muted hover:text-brand-orange inline-flex items-center gap-1">
            <ArrowLeft size={14} /> All Services
          </Link>
        </div>
      </nav>

      <section className="pb-12 pt-6">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink leading-tight max-w-2xl">
            {service.title}
          </h1>
          <p className="text-ink-muted text-lg mt-5 max-w-2xl">{service.short_description}</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="max-w-container mx-auto px-5 md:px-8 grid lg:grid-cols-3 gap-14">
          <div
            className="lg:col-span-2 article-prose"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
          <div>
            <div className="bg-surface-cream border border-line rounded-xl2 p-7 sticky top-28">
              <h3 className="font-display font-bold text-ink mb-4">Ready to talk?</h3>
              <p className="text-ink-muted text-sm mb-6 leading-relaxed">
                Tell us about your business and we&apos;ll follow up to discuss whether this
                service is the right fit.
              </p>
              <ButtonLink href="/contact" className="w-full">
                Discuss Your Project <ArrowUpRight size={16} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
