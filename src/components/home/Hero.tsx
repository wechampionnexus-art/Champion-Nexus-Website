'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Brand accent used throughout this illustration, per spec: #E95516 (orange),
// #242424 (ink), white/off-white. No purple or blue anywhere in this file.
const ACCENT = '#E95516';
const INK = '#242424';
const TRACK = '#E5E7EB';

// Gauge geometry: a 180° semicircle arc, radius 50, centered at (60,60).
// Arc length = π * r ≈ 157.08. Used to compute stroke-dasharray/dashoffset
// for the 0% -> 80% fill animation.
const GAUGE_RADIUS = 50;
const GAUGE_LENGTH = Math.PI * GAUGE_RADIUS;
const GAUGE_TARGET_PERCENT = 80;

// Bar chart data: an illustrative upward trend, not a real client report.
const BAR_HEIGHTS = [14, 22, 18, 28, 24, 34, 40, 46];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gaugeValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!rootRef.current) return;

    if (reducedMotion) {
      // Skip animation entirely but still land every element in its final
      // state so the page isn't blank for reduced-motion users. The bar
      // chart and line chart already render at full size/visibility by
      // default (GSAP never touches them in this branch), but the gauge
      // arc needs an explicit dasharray/dashoffset set directly via style —
      // otherwise it would render as a full 100% ring instead of stopping
      // at the intended 80%.
      if (gaugeValueRef.current) gaugeValueRef.current.textContent = `${GAUGE_TARGET_PERCENT}%`;
      const arc = rootRef.current.querySelector<SVGPathElement>('.gauge-arc');
      if (arc) {
        const targetOffset = GAUGE_LENGTH * (1 - GAUGE_TARGET_PERCENT / 100);
        arc.style.strokeDasharray = `${GAUGE_LENGTH}`;
        arc.style.strokeDashoffset = `${targetOffset}`;
      }
      return;
    }

    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import('gsap');

      ctx = gsap.context(() => {
        // Starting states for the dashboard illustration's internal charts.
        const targetOffset = GAUGE_LENGTH * (1 - GAUGE_TARGET_PERCENT / 100);
        gsap.set('.gauge-arc', { strokeDasharray: GAUGE_LENGTH, strokeDashoffset: GAUGE_LENGTH });
        gsap.set('.metrics-line', { strokeDasharray: 300, strokeDashoffset: 300 });
        gsap.set('.kw-bar', { scaleY: 0, transformOrigin: '50% 100%' });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.5 })
          .from('.hero-heading', { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
          .from('.hero-sub', { opacity: 0, y: 18, duration: 0.6 }, '-=0.4')
          .from('.hero-ctas', { opacity: 0, y: 14, duration: 0.5 }, '-=0.35')
          .from('.hero-visual', { opacity: 0, scale: 0.94, duration: 0.8 }, '-=0.7')
          // Dashboard illustration: gauge fills 0% -> 80%, synced with the
          // on-screen number counting up the same way.
          .to(
            '.gauge-arc',
            {
              strokeDashoffset: targetOffset,
              duration: 1.3,
              ease: 'power2.out',
              onUpdate: function () {
                if (!gaugeValueRef.current) return;
                const progress = this.progress();
                gaugeValueRef.current.textContent = `${Math.round(GAUGE_TARGET_PERCENT * progress)}%`;
              },
            },
            '-=0.4'
          )
          // Line chart draws in.
          .to('.metrics-line', { strokeDashoffset: 0, duration: 1, ease: 'power2.out' }, '<')
          // Bar chart grows up, staggered left to right.
          .to(
            '.kw-bar',
            { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.6)' },
            '-=0.6'
          );
      }, rootRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-surface-cream">
      <div
        className="absolute -top-24 right-[-8%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,102,36,0.14) 0%, rgba(245,102,36,0) 70%)' }}
      />
      <div className="max-w-container mx-auto px-5 md:px-8 relative grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="hero-eyebrow inline-flex items-center gap-2 text-xs font-display font-semibold tracking-[0.14em] text-brand-orange border border-brand-orange/25 bg-brand-orange-light rounded-full px-4 py-1.5 uppercase">
            Build Your Online Visibility
          </span>
          <h1 className="hero-heading font-display font-extrabold text-ink text-[40px] leading-[1.1] sm:text-5xl md:text-6xl mt-6">
            Build Your Online Visibility. <span className="text-brand-orange">Grow Your Business.</span>
          </h1>
          <p className="hero-sub text-ink-muted text-lg mt-6 max-w-xl leading-relaxed">
            Champion Nexus helps businesses improve search visibility and strengthen digital
            marketing performance through SEO, content, and data-informed strategy, without
            overstating what any single channel can deliver.
          </p>
          <div className="hero-ctas flex flex-wrap items-center gap-4 mt-9">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Discuss Your Project <ArrowUpRight size={18} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-line bg-white hover:border-brand-orange hover:text-brand-orange text-ink font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Explore Our Services
            </Link>
          </div>
        </div>

        {/* Decorative dashboard illustration — purely supplementary to the
            hero copy, so the whole composition is hidden from assistive
            technology rather than described piecemeal. */}
        <div className="hero-visual relative w-full max-w-md mx-auto h-[360px] sm:h-[400px]" aria-hidden="true">
          {/* Card: Campaign Metrics (top-right, small, behind) */}
          <div className="absolute top-0 right-0 w-[180px] bg-white border border-line rounded-xl2 shadow-card p-4 rotate-2 z-10">
            <p className="text-[11px] font-display font-semibold text-ink mb-2">Campaign Metrics</p>
            <svg viewBox="0 0 150 60" className="w-full">
              <polyline
                points="0,45 20,40 40,48 60,30 80,36 100,18 120,24 150,10"
                fill="none"
                stroke={TRACK}
                strokeWidth="2"
              />
              <polyline
                className="metrics-line"
                points="0,45 20,40 40,48 60,30 80,36 100,18 120,24 150,10"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Card: Site Audit (top-left, gauge, in front of Campaign card) */}
          <div className="absolute top-1 left-0 w-[168px] bg-white border border-line rounded-xl2 shadow-card p-4 -rotate-2 z-20">
            <p className="text-[11px] font-display font-semibold text-ink mb-1">Site Audit</p>
            <div className="relative flex justify-center">
              <svg viewBox="0 0 120 70" className="w-full">
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke={TRACK}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  className="gauge-arc"
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <span
                ref={gaugeValueRef}
                className="absolute bottom-0 font-display font-extrabold text-xl"
                style={{ color: INK }}
              >
                0%
              </span>
            </div>
            <p className="text-[10px] text-ink-soft text-center -mt-1">SEO Health Score</p>
            <div className="flex justify-between mt-3 text-[11px] text-ink-muted border-t border-line pt-2">
              <span>
                Pages <strong style={{ color: INK }}>205</strong>
              </span>
              <span>
                Issues <strong style={{ color: INK }}>12</strong>
              </span>
            </div>
          </div>

          {/* Card: Keyword Visibility (main, large, front) */}
          <div className="absolute bottom-0 left-6 right-0 bg-white border border-line rounded-xl2 shadow-card p-5 z-30">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[11px] font-display font-semibold text-ink-muted mb-1">
                  Keyword Visibility
                </p>
                <p className="font-display font-extrabold text-2xl" style={{ color: INK }}>
                  650 tracked
                </p>
              </div>
              <span
                className="text-[11px] font-display font-semibold rounded-full px-2.5 py-1"
                style={{ color: ACCENT, backgroundColor: 'rgba(233,85,22,0.1)' }}
              >
                +10% this month
              </span>
            </div>
            <svg viewBox="0 0 280 60" className="w-full">
              {BAR_HEIGHTS.map((h, i) => (
                <rect
                  key={i}
                  className="kw-bar"
                  x={i * 35 + 4}
                  y={60 - h}
                  width="18"
                  height={h}
                  rx="4"
                  fill={ACCENT}
                  opacity={0.55 + (i / BAR_HEIGHTS.length) * 0.45}
                />
              ))}
            </svg>
            <p className="text-[10px] text-ink-soft mt-2">Last 8 weeks</p>
          </div>
        </div>
      </div>
    </section>
  );
}