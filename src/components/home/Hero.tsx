import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Megaphone, Search, Link2, TrendingUp } from 'lucide-react';

// Brand tokens (from tailwind.config.ts): brand-orange #F56624 is the light
// accent used for fills/icons; brand-orange-hover #E95516 is the darker
// shade used anywhere text/icons sit on a light background, since #F56624
// text on white/cream fails WCAG contrast (flagged by Lighthouse) while
// #E95516 passes.
const FLOAT_ICONS = [
  { icon: Megaphone, label: 'Marketing', position: 'top-[4%] left-[2%]' },
  { icon: TrendingUp, label: 'Performance', position: 'top-[8%] right-[0%]' },
  { icon: Search, label: 'SEO', position: 'bottom-[18%] left-[-2%]' },
  { icon: Link2, label: 'Link Building', position: 'bottom-[6%] right-[4%]' },
] as const;

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-surface-cream">
      <div
        className="absolute -top-24 right-[-8%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,102,36,0.14) 0%, rgba(245,102,36,0) 70%)' }}
      />
      <div className="max-w-container mx-auto px-5 md:px-8 relative grid lg:grid-cols-2 gap-14 items-center">
        <div className="hero-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="inline-flex items-center gap-2 text-xs font-display font-semibold tracking-[0.14em] text-brand-orange-hover border border-brand-orange/25 bg-brand-orange-light rounded-full px-4 py-1.5 uppercase">
            Build Your Online Visibility
          </span>
          <h1 className="font-display font-extrabold text-ink text-[40px] leading-[1.1] sm:text-5xl md:text-6xl mt-6">
            Build Your Online Visibility. <span className="text-brand-orange-hover">Grow Your Business.</span>
          </h1>
          <p className="text-ink-muted text-lg mt-6 max-w-xl leading-relaxed">
            Champion Nexus helps businesses improve search visibility and strengthen digital
            marketing performance through SEO, content, and data-informed strategy, without
            overstating what any single channel can deliver.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-orange-hover hover:bg-brand-orange text-white font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Discuss Your Project <ArrowUpRight size={18} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-line bg-white hover:border-brand-orange hover:text-brand-orange-hover text-ink font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Explore Our Services
            </Link>
          </div>
        </div>

        {/* Illustration: one static image plus lightweight floating service
            badges (plain CSS animation, no GSAP/SVG charts) — far less
            JS/CPU work on load than the previous animated SVG dashboard,
            which was the biggest single contributor to the mobile
            performance score (Total Blocking Time + main-thread JS). */}
        <div
          className="hero-fade-up relative w-full max-w-md lg:max-w-lg mx-auto aspect-square"
          style={{ animationDelay: '220ms' }}
          aria-hidden="true"
        >
          <div className="relative w-[82%] h-[82%] mx-auto mt-[9%] rounded-full overflow-hidden bg-brand-orange-light">
            <Image
              src="/hero-illustration.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 320px"
              className="object-cover"
            />
          </div>

          {FLOAT_ICONS.map(({ icon: Icon, label, position }) => (
            <div
              key={label}
              className={`hero-float absolute ${position} flex items-center gap-2 bg-white border border-line shadow-card rounded-full pl-2 pr-3.5 py-2`}
            >
              <span className="w-8 h-8 shrink-0 rounded-full bg-brand-orange-light text-brand-orange-hover flex items-center justify-center">
                <Icon size={15} />
              </span>
              <span className="text-xs font-display font-semibold text-ink whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}