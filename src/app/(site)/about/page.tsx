import type { Metadata } from 'next';
import { Target, Telescope, MessageCircle, Shield } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'About Champion Nexus',
  description:
    'Champion Nexus is a digital growth partner focused on SEO, content, and digital marketing, built around transparent communication and realistic results.',
  path: '/about',
});

const VALUES = [
  { icon: Shield, title: 'Transparency', desc: 'Clear strategy and honest reporting, no vague promises or inflated claims.' },
  { icon: Target, title: 'Strategy first', desc: 'Every piece of work connects back to a defined, agreed objective.' },
  { icon: Telescope, title: 'Long-term thinking', desc: 'We aim for durable visibility, not short-lived spikes.' },
  { icon: MessageCircle, title: 'Clear communication', desc: "You'll always know what we're doing and why." },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-16 md:pt-44 bg-surface-cream">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            About Champion Nexus
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-4 max-w-2xl leading-tight">
            Built around clear communication and real digital growth
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-container mx-auto px-5 md:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5 text-ink-muted text-base md:text-lg leading-relaxed">
            <p>
              Champion Nexus works with businesses that want their online presence to do more
              through SEO, content, link building, and digital marketing built around clear
              strategy rather than guesswork.
            </p>
            <p>
              We approach search visibility and digital marketing as connected disciplines:
              technical foundations, content, authority building, and reporting all working
              toward the same, agreed goal.
            </p>
            
          </div>
          <div className="space-y-6">
            <div className="bg-surface-cream border border-line rounded-xl2 p-6">
              <Target size={22} className="text-brand-orange mb-3" />
              <h3 className="font-display font-bold text-ink mb-2">Mission</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Help businesses build durable digital visibility and turn it into real
                opportunities.
              </p>
            </div>
            <div className="bg-surface-cream border border-line rounded-xl2 p-6">
              <Telescope size={22} className="text-brand-orange mb-3" />
              <h3 className="font-display font-bold text-ink mb-2">Vision</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Be a digital growth partner businesses trust for clear strategy and honest
                reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-gray border-y border-line">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <h2 className="font-display font-extrabold text-3xl text-ink mb-12">How we work with clients</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-line rounded-xl2 p-6">
                <Icon size={20} className="text-brand-orange mb-3" />
                <h3 className="font-display font-bold text-ink mb-2">{title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center bg-white">
        <div className="max-w-xl mx-auto px-5">
          <h2 className="font-display font-bold text-2xl text-ink mb-6">
            Want to talk about your project?
          </h2>
          <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
        </div>
      </section>
    </>
  );
}
