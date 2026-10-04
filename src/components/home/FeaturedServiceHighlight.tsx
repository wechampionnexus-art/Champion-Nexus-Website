'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

/**
 * "Featured Service" homepage section — SEO dashboard visual + animated
 * stats. Counters animate via GSAP + ScrollTrigger the first time the card
 * scrolls into view, and respect prefers-reduced-motion.
 *
 * NOTE ON THE NUMBERS BELOW: 68 / 120 / 340 / 42 are placeholder figures
 * for the visual, not verified Champion Nexus results. Replace them (and
 * the STATS array further down) with real, confirmed figures once you have
 * them — search this file for "STATS" to find the single place to edit.
 */

const STATS = [
  { target: 68, suffix: '%', label: 'Organic Traffic' },
  { target: 120, suffix: '', label: 'Keyword Visibility' },
  { target: 340, suffix: '', label: 'Backlinks' },
  { target: 42, suffix: '', label: 'Domain Authority' },
];

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
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
      // Mobile browsers (notably Safari) fire resize events when the
      // address bar shows/hides during scroll, which would otherwise make
      // ScrollTrigger needlessly recalculate trigger positions mid-scroll.
      // This is GSAP's documented fix for smooth behavior on all devices.
      ScrollTrigger.config({ ignoreMobileResize: true });

      ctx = gsap.context(() => {
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              value: target,
              duration: 1.6,
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
    <div ref={wrapperRef}>
      <div className="font-display font-extrabold text-3xl text-ink">
        <span ref={valueRef}>0</span>
        {suffix}
      </div>
      <div className="text-xs text-ink-soft mt-1">{label}</div>
    </div>
  );
}

/**
 * Realistic-looking search performance chart, styled after Google Search
 * Console's "Performance" report: a primary metric line (clicks-style) with
 * a soft gradient fill, a secondary muted line (impressions-style) behind
 * it, light horizontal gridlines, and month labels along the x-axis.
 * It is illustrative chart art, not a rendering of real analytics data.
 */
function SearchPerformanceChart() {
  const gradientId = 'cn-chart-gradient';

  return (
    <svg viewBox="0 0 480 230" className="w-full" role="img" aria-label="Illustrative search performance chart">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F56624" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#F56624" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal gridlines */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#E5E7EB" strokeWidth="1" />
      ))}

      {/* Secondary muted line — e.g. impressions */}
      <path
        d="M0,150 C40,140 80,155 120,140 C160,128 200,135 240,118 C280,108 320,118 360,95 C400,85 440,92 480,70"
        fill="none"
        stroke="#A7A7A7"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.8"
      />

      {/* Primary metric line with gradient fill */}
      <path
        d="M0,170 L0,170 C40,165 80,150 120,145 C160,138 200,120 240,112 C280,100 320,95 360,70 C400,55 440,45 480,25 L480,230 L0,230 Z"
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <path
        id="cnFeaturedChartLine"
        d="M0,170 C40,165 80,150 120,145 C160,138 200,120 240,112 C280,100 320,95 360,70 C400,55 440,45 480,25"
        fill="none"
        stroke="#F56624"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Latest-point marker, like GSC highlights the most recent data point */}
      <circle cx="480" cy="25" r="5" fill="#F56624" />
      <circle cx="480" cy="25" r="9" fill="#F56624" opacity="0.2" />

      {/* X-axis month labels */}
      <g fill="#666666" fontSize="11" fontFamily="Inter, sans-serif">
        <text x="0" y="222">Jan</text>
        <text x="118" y="222">Feb</text>
        <text x="236" y="222">Mar</text>
        <text x="354" y="222">Apr</text>
        <text x="462" y="222" textAnchor="end">May</text>
      </g>
    </svg>
  );
}

export function FeaturedServiceHighlight() {
  const chartPathRef = useRef<SVGPathElement | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = document.getElementById('cnFeaturedChartLine') as SVGPathElement | null;
    if (!path) return;

    if (reducedMotion) {
      path.style.strokeDasharray = 'none';
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
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out' }),
        });
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white border-y border-line">
      <div className="max-w-container mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Featured Service
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-4 mb-6 leading-tight">
            SEO that builds long-term visibility
          </h2>
          <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-8">
            Technical SEO, content strategy and authority building working together — so your
            visibility compounds instead of resetting every algorithm update.
          </p>
          <ButtonLink href="/services/search-engine-optimization">
            Explore SEO Services <ArrowUpRight size={16} />
          </ButtonLink>
        </div>

        <div className="bg-[#FAF9F6] border border-line rounded-xl2 p-7 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display font-semibold text-sm text-ink">Search Performance</span>
          </div>

          <SearchPerformanceChart />

          <div className="grid grid-cols-2 gap-6 mt-8">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}