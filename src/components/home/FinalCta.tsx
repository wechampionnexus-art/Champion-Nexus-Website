import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="py-20 md:py-28 bg-ink text-center relative overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[560px] h-[560px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,102,36,0.22) 0%, rgba(245,102,36,0) 70%)' }}
        />
      </div>
      <div className="max-w-2xl mx-auto px-5 md:px-8 relative">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-5 leading-tight">
          Ready to discuss your SEO or digital marketing needs?
        </h2>
        <p className="text-white/70 text-base md:text-lg mb-9 leading-relaxed">
          Tell us about your business and goals we&apos;ll follow up to talk through how we can
          help.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/contact">
            Discuss Your Project <ArrowUpRight size={18} />
          </ButtonLink>
          <ButtonLink href="/services" variant="outline" className="bg-transparent border-white/20 text-brand-orange hover:border-brand-orange hover:text-brand-orange">
            Explore Our Services 
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
