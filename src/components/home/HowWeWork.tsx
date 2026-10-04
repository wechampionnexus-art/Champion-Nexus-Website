'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '@/components/ui/SectionHeading';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { num: '01', title: 'Discover & Research', desc: 'Understand your business, audience, competitors, and current performance.' },
  { num: '02', title: 'Build a Strategy', desc: 'Define a focused plan around realistic, measurable priorities.' },
  { num: '03', title: 'Execute the Work', desc: 'Implement the agreed SEO, content, and marketing activities.' },
  { num: '04', title: 'Measure & Improve', desc: 'Report on performance and refine the approach based on results.' },
];

export function HowWeWork() {
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const steps = gsap.utils.toArray<HTMLElement>('.hw-step');
      const dots = gsap.utils.toArray<HTMLElement>('.hw-dot');

      // Builds the scroll-scrubbed timeline for either layout
      const build = (horizontal: boolean, end: string) => {
        gsap.set('.hw-progress', { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid.current,
            start: 'top 75%',
            end,
            scrub: 0.6,
          },
        });

        // Orange line draws 1 -> 2 -> 3 -> 4
        tl.fromTo(
          '.hw-progress',
          horizontal
            ? { scaleX: 0, transformOrigin: 'left center' }
            : { scaleY: 0, transformOrigin: 'center top' },
          horizontal
            ? { scaleX: 1, duration: 1, ease: 'none' }
            : { scaleY: 1, duration: 1, ease: 'none' },
          0
        );

        // Each step reveals when the line reaches it
        steps.forEach((step, i) => {
          const at = i === 0 ? 0 : i * 0.25 - 0.03;
          tl.fromTo(
            step,
            { opacity: 0.25, y: 16 },
            { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
            at
          );
        });

        // Mobile dots pop in with their step
        dots.forEach((dot, i) => {
          const at = i === 0 ? 0 : i * 0.25 - 0.03;
          tl.fromTo(
            dot,
            { scale: 0, transformOrigin: '50% 50%' },
            { scale: 1, duration: 0.1, ease: 'back.out(2)' },
            at
          );
        });
      };

      // Desktop: horizontal line across 4 columns
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        build(true, '+=320');
      });

      // Mobile: vertical line down the stacked steps
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        build(false, 'bottom 60%');
      });

      // Reduced motion: show the finished line, no animation
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hw-progress', { autoAlpha: 1, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: grid }
  );

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <SectionHeading title="How we work" className="mb-14" />

        <div ref={grid} className="grid md:grid-cols-4 gap-10 md:gap-8 relative">
          {/* Base line (gray track) - vertical on mobile, horizontal on desktop */}
          <div
            aria-hidden="true"
            className="absolute z-0 bg-line left-[5px] top-2 bottom-2 w-px md:left-0 md:right-0 md:top-[10px] md:bottom-auto md:h-px md:w-auto"
          />
          {/* Progress line (orange) - animated by GSAP */}
          <div
            aria-hidden="true"
            className="hw-progress invisible absolute z-0 bg-brand-orange left-[5px] top-2 bottom-2 w-px md:left-0 md:right-0 md:top-[10px] md:bottom-auto md:h-px md:w-auto"
          />

          {STEPS.map((step) => (
            <div key={step.num} className="hw-step relative z-10 pl-8 md:pl-0">
              {/* Mobile dot on the vertical line */}
              <span
                aria-hidden="true"
                className="hw-dot md:hidden absolute left-0 top-[5px] size-[11px] rounded-full bg-brand-orange ring-4 ring-white"
              />
              <div className="font-display font-bold text-sm text-brand-orange mb-4">
                <span className="inline-block bg-white md:pr-3">{step.num}</span>
              </div>
              <h3 className="font-display font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}