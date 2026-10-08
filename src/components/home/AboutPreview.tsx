'use client';

import { useRef } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'; // if not installed, see note below

/* -------------------------------------------------------------------------- */
/*  Digital growth illustration                                               */
/* -------------------------------------------------------------------------- */

function GrowthIllustration() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Main panel
        tl.from('.gi-panel', { opacity: 0, y: 16, duration: 0.6, transformOrigin: '50% 50%' });

        // Chart bars grow from the baseline
        tl.from(
          '.gi-bar',
          { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, stagger: 0.08 },
          '-=0.2'
        );

        // Growth line draws itself
        tl.fromTo(
          '.gi-line',
          { strokeDasharray: 400, strokeDashoffset: 400 },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' },
          '-=0.3'
        );
        tl.from('.gi-area', { opacity: 0, duration: 0.8 }, '-=0.6');
        tl.from(
          '.gi-point',
          { scale: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.18, ease: 'back.out(2)' },
          '-=1.2'
        );

        // Connectors draw, then service cards pop in
        tl.fromTo(
          '.gi-connector',
          { strokeDasharray: 300, strokeDashoffset: 300 },
          { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 },
          '-=0.4'
        );
        tl.from(
          '.gi-card',
          { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)' },
          '-=0.8'
        );
        tl.from('.gi-node', { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.05 }, '-=0.4');
        tl.from('.gi-person', { opacity: 0, y: 8, duration: 0.5, stagger: 0.1 }, '-=0.3');

        // Very gentle idle float on cards (stops with reduced motion)
        gsap.to('.gi-card', {
          y: '-=4',
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.5, from: 'random' },
          delay: 3,
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 800 620"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="gi-title gi-desc"
      className="w-full h-auto max-w-xl overflow-visible"
      style={{ aspectRatio: '800 / 620' }}
    >
      <title id="gi-title">Connected digital growth strategy</title>
      <desc id="gi-desc">
        A central strategy dashboard with a steadily rising growth line is connected to four
        services: SEO, content, link building and content marketing, showing them working
        together as one transparent, long-term strategy.
      </desc>

      <defs>
        <linearGradient id="gi-orange-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F56624" stopOpacity="0.75" />
          <stop offset="1" stopColor="#F56624" />
        </linearGradient>
        <linearGradient id="gi-orange-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F56624" stopOpacity="0.22" />
          <stop offset="1" stopColor="#F56624" stopOpacity="0" />
        </linearGradient>
        <filter id="gi-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#242424" floodOpacity="0.12" />
        </filter>
        <filter id="gi-shadow-sm" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#242424" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* soft backdrop shapes */}
      <circle cx="400" cy="310" r="250" fill="#F3F4F6" opacity="0.7" />
      <circle cx="400" cy="310" r="190" fill="none" stroke="#E5E7EB" strokeDasharray="4 8" />

      {/* ------------------------- Connectors ------------------------- */}
      <g fill="none" stroke="#242424" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <path className="gi-connector" d="M190 140 C 260 150, 270 215, 305 235" />
        <path className="gi-connector" d="M610 140 C 540 150, 530 215, 495 235" />
        <path className="gi-connector" d="M190 480 C 260 470, 270 405, 305 385" />
        <path className="gi-connector" d="M610 480 C 540 470, 530 405, 495 385" />
      </g>
      <g fill="#FFFFFF" stroke="#F56624" strokeWidth="2.5">
        <circle className="gi-node" cx="305" cy="235" r="6" />
        <circle className="gi-node" cx="495" cy="235" r="6" />
        <circle className="gi-node" cx="305" cy="385" r="6" />
        <circle className="gi-node" cx="495" cy="385" r="6" />
      </g>

      {/* ------------------------- Central panel ------------------------- */}
      <g className="gi-panel" filter="url(#gi-shadow)">
        <rect x="290" y="215" width="220" height="190" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
        {/* header bar */}
        <rect x="290" y="215" width="220" height="32" rx="18" fill="#242424" />
        <rect x="290" y="232" width="220" height="15" fill="#242424" />
        <circle cx="308" cy="231" r="3.5" fill="#F56624" />
        <circle cx="320" cy="231" r="3.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="332" cy="231" r="3.5" fill="#FFFFFF" opacity="0.3" />
        <rect x="400" y="227" width="90" height="8" rx="4" fill="#FFFFFF" opacity="0.18" />

        {/* grid */}
        <g stroke="#E5E7EB" strokeWidth="1">
          <line x1="308" y1="285" x2="492" y2="285" />
          <line x1="308" y1="315" x2="492" y2="315" />
          <line x1="308" y1="345" x2="492" y2="345" />
          <line x1="308" y1="375" x2="492" y2="375" />
        </g>

        {/* bars */}
        <g fill="#F3F4F6" stroke="#E5E7EB">
          <rect className="gi-bar" x="316" y="345" width="20" height="30" rx="4" />
          <rect className="gi-bar" x="352" y="330" width="20" height="45" rx="4" />
          <rect className="gi-bar" x="388" y="312" width="20" height="63" rx="4" />
          <rect className="gi-bar" x="424" y="294" width="20" height="81" rx="4" />
          <rect className="gi-bar" x="460" y="276" width="20" height="99" rx="4" />
        </g>

        {/* growth area + line (steady rise) */}
        <path
          className="gi-area"
          d="M326 360 L362 346 L398 328 L434 306 L470 282 L470 375 L326 375 Z"
          fill="url(#gi-orange-area)"
        />
        <polyline
          className="gi-line"
          points="326,360 362,346 398,328 434,306 470,282"
          fill="none"
          stroke="url(#gi-orange-line)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g fill="#FFFFFF" stroke="#F56624" strokeWidth="3">
          <circle className="gi-point" cx="326" cy="360" r="4.5" />
          <circle className="gi-point" cx="362" cy="346" r="4.5" />
          <circle className="gi-point" cx="398" cy="328" r="4.5" />
          <circle className="gi-point" cx="434" cy="306" r="4.5" />
          <circle className="gi-point" cx="470" cy="282" r="6" fill="#F56624" />
        </g>
        <rect x="308" y="257" width="60" height="8" rx="4" fill="#242424" opacity="0.85" />
        <rect x="308" y="270" width="36" height="6" rx="3" fill="#E5E7EB" />
      </g>

      {/* ------------------------- 1. SEO (top-left) ------------------------- */}
      <g className="gi-card" filter="url(#gi-shadow-sm)">
        <rect x="70" y="80" width="140" height="120" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
        {/* magnifier */}
        <circle cx="127" cy="125" r="22" fill="#FAF9F6" stroke="#242424" strokeWidth="4" />
        <line x1="143" y1="141" x2="162" y2="160" stroke="#242424" strokeWidth="6" strokeLinecap="round" />
        {/* rising bars inside lens */}
        <rect x="116" y="127" width="6" height="10" rx="2" fill="#F56624" opacity="0.5" />
        <rect x="126" y="120" width="6" height="17" rx="2" fill="#F56624" opacity="0.75" />
        <rect x="136" y="112" width="6" height="25" rx="2" fill="#F56624" />
        {/* up arrow badge */}
        <circle cx="178" cy="106" r="12" fill="#F56624" />
        <path d="M178 112 V101 M173 106 L178 101 L183 106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="92" y="172" width="96" height="8" rx="4" fill="#E5E7EB" />
      </g>

      {/* ------------------------- 2. Content (top-right) ------------------------- */}
      <g className="gi-card" filter="url(#gi-shadow-sm)">
        <rect x="590" y="80" width="140" height="120" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
        <rect x="628" y="96" width="64" height="82" rx="8" fill="#FAF9F6" stroke="#242424" strokeWidth="3" />
        <rect x="638" y="108" width="30" height="7" rx="3.5" fill="#F56624" />
        <rect x="638" y="122" width="44" height="4" rx="2" fill="#242424" opacity="0.7" />
        <rect x="638" y="131" width="40" height="4" rx="2" fill="#242424" opacity="0.4" />
        <rect x="638" y="144" width="22" height="6" rx="3" fill="#F56624" opacity="0.6" />
        <rect x="638" y="155" width="44" height="4" rx="2" fill="#242424" opacity="0.4" />
        <rect x="638" y="164" width="34" height="4" rx="2" fill="#242424" opacity="0.4" />
      </g>

      {/* ------------------------- 3. Link building (bottom-left) ------------------------- */}
      <g className="gi-card" filter="url(#gi-shadow-sm)">
        <rect x="70" y="420" width="140" height="120" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
        <g fill="none" strokeWidth="6" strokeLinecap="round">
          <rect x="94" y="458" width="52" height="26" rx="13" stroke="#242424" transform="rotate(-30 120 471)" />
          <rect x="134" y="476" width="52" height="26" rx="13" stroke="#F56624" transform="rotate(-30 160 489)" />
        </g>
        <rect x="92" y="516" width="96" height="8" rx="4" fill="#E5E7EB" />
      </g>

      {/* ------------------------- 4. Digital marketing (bottom-right) ------------------------- */}
      <g className="gi-card" filter="url(#gi-shadow-sm)">
        <rect x="590" y="420" width="140" height="120" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
        <circle cx="660" cy="478" r="30" fill="#FAF9F6" stroke="#242424" strokeWidth="4" />
        <circle cx="660" cy="478" r="18" fill="none" stroke="#242424" strokeWidth="3" opacity="0.7" />
        <circle cx="660" cy="478" r="7" fill="#F56624" />
        <path d="M660 478 L694 450" stroke="#F56624" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M684 449 L695 449 L695 460" fill="none" stroke="#F56624" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="612" y="516" width="96" height="8" rx="4" fill="#E5E7EB" />
      </g>

      {/* ------------------------- Collaboration (people) ------------------------- */}
      <g className="gi-person">
        <circle cx="360" cy="450" r="14" fill="#FFFFFF" stroke="#242424" strokeWidth="3" />
        <circle cx="360" cy="446" r="4.5" fill="#242424" />
        <path d="M351 458 C353 452, 367 452, 369 458" fill="none" stroke="#242424" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="gi-person">
        <circle cx="440" cy="450" r="14" fill="#FFFFFF" stroke="#F56624" strokeWidth="3" />
        <circle cx="440" cy="446" r="4.5" fill="#F56624" />
        <path d="M431 458 C433 452, 447 452, 449 458" fill="none" stroke="#F56624" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M374 450 H426" stroke="#242424" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" opacity="0.5" />
      <path d="M400 436 V405" stroke="#242424" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  About section                                                             */
/* -------------------------------------------------------------------------- */

export function AboutPreview() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            About Champion Nexus
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-3 mb-6 leading-tight">
            A digital growth partner, not just a vendor
          </h2>
          <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-5">
            Champion Nexus focuses on helping businesses strengthen their online presence through
            SEO, content, link building, and digital marketing — with transparent communication
            at every stage.
          </p>
          <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-8">
            We treat SEO and digital marketing as connected disciplines rather than isolated
            tactics, aiming for improvements that hold up over time rather than short-lived
            spikes.
          </p>
          <ButtonLink href="/about" variant="outline">
            Learn more about us <ArrowRight size={16} />
          </ButtonLink>
        </div>

        <div className="flex justify-center w-full">
          <GrowthIllustration />
        </div>
      </div>
    </section>
  );
}