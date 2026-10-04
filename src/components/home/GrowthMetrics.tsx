'use client';

import { useEffect, useRef } from 'react';

/**
 * "Growth Metrics" homepage strip — four animated stats, counting up via
 * GSAP + ScrollTrigger the first time the section scrolls into view.
 * Respects prefers-reduced-motion.
 *
 * NOTE ON THE NUMBERS BELOW: 74 / 61 / 250 / 100 are placeholder figures,
 * not verified Champion Nexus results. Replace them (and the METRICS array
 * below) with real, confirmed figures once you have them — search this
 * file for "METRICS" to find the single place to edit.
 */

const METRICS = [
  { target: 74, suffix: '%', label: 'Organic Visibility', accent: false },
  { target: 61, suffix: '%', label: 'Qualified Traffic', accent: false },
  { target: 250, suffix: '', label: 'Tracked Keywords', accent: false },
  { target: 100, suffix: '%', label: 'Transparent Reporting', accent: true },
];

function MetricCounter({
  target,
  suffix,
  label,
  accent,
}: {
  target: number;
  suffix: string;
  label: string;
  accent: boolean;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!valueRef.current) return;

    if (reducedMotion) {
      valueRef.current.textContent = String(target);
      return;
    }

    let ctx: { revert: () => void } | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      ctx = gsap.context(() => {
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              value: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                if (valueRef.current) valueRef.current.textContent = String(Math.round(counter.value));
              },
            });
          },
        });
      }, wrapperRef);
    })();

    return () => ctx?.revert();
  }, [target]);

  return (
    <div ref={wrapperRef} className="text-center md:text-left">
      <div className={`font-display font-extrabold text-4xl md:text-5xl ${accent ? 'text-brand-orange' : 'text-ink'}`}>
        <span ref={valueRef}>0</span>
        {suffix}
      </div>
      <div className="text-xs md:text-sm text-ink-muted mt-2">{label}</div>
    </div>
  );
}

export function GrowthMetrics() {
  return (
    <section className="py-20 md:py-28 bg-surface-cream border-y border-line">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="mb-14">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Growth Metrics We Track
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-4 leading-tight max-w-2xl">
            The numbers that actually matter
          </h2>
          <p className="text-ink-muted text-sm mt-4 max-w-xl">
            The metrics we focus on when measuring SEO and digital marketing performance for a
            client.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((metric) => (
            <MetricCounter key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}