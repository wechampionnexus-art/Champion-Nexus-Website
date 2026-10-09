import type { Metadata } from 'next';
import { Mail, Clock, MapPin} from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Champion Nexus to discuss your SEO or digital marketing project.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-16 md:pt-44 bg-surface-cream">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Contact
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-4 max-w-xl leading-tight">
            Let&apos;s talk about your growth
          </h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Tell us a bit about your business and goals we&apos;ll follow up to discuss how we
            can help.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-container mx-auto px-5 md:px-8 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-line rounded-xl2 p-7">
              <Mail size={20} className="text-brand-orange mb-3" />
              <h3 className="font-display font-bold text-ink mb-1">Email</h3>
              <p className="text-ink-muted text-sm">
                <a href="mailto:marketing@championnexus.pro" className='hover:text-brand-orange'>marketing@championnexus.pro</a>
              </p>
            </div>
            <div className="bg-white border border-line rounded-xl2 p-7">
              <Clock size={20} className="text-brand-orange mb-3" />
              <h3 className="font-display font-bold text-ink mb-1">Response Time</h3>
              <p className="text-ink-muted text-sm">We typically reply within 1–2 business days.</p>
            </div>
            <div className="bg-white border border-line rounded-xl p-7">
              <MapPin size={20} className="text-brand-orange mb-3" />
              <h3 className="font-display font-bold text-ink mb-1">Location</h3>

              <div className="space-y-1">
                <p className="text-ink-muted text-sm">
                  <span className="font-semibold">Pakistan:</span> Near Lyallpur Galleria 2, Samundri Road, Faisalabad, Punjab
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
