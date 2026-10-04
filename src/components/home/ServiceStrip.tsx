'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ITEMS = [
  'SEO',
  'Guest Posting',
  'Link Building',
  'Content Marketing',
  'Social Media Marketing',
  'SEO Audits',
  'Competitor Analysis',
  'SEO Reporting & Analytics',
];

export function ServiceStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Guard hydration matching to prevent server stream hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const listElement = listRef.current;
    if (!listElement) return;

    // Get width of one full distinct block loop (half of total offset width)
    const width = listElement.offsetWidth / 2;
    if (width <= 0) return;

    // Force GSAP to execute outside global stream scopes safely
    const context = gsap.context(() => {
      gsap.to(listElement, {
        x: `-=${width}`,
        duration: 25, 
        ease: 'none',
        repeat: -1, 
        modifiers: {
          x: gsap.utils.unitize((value) => parseFloat(value) % width)
        }
      });
    }, containerRef);

    // Clean up animation references safely
    return () => {
      context.revert();
    };
  }, [isMounted]);

  // Prevent server-side rendering execution anomalies
  if (!isMounted) {
    return (
      <section className="border-y border-line bg-white py-5 overflow-hidden w-full select-none opacity-0">
        <div className="h-6" />
      </section>
    );
  }

  return (
    <section className="border-y border-line bg-white py-5 overflow-hidden w-full select-none">
      <div ref={containerRef} className="w-full overflow-hidden relative">
        <ul 
          ref={listRef} 
          className="flex items-center gap-12 whitespace-nowrap font-display text-sm font-semibold text-ink-muted w-max will-change-transform"
        >
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center gap-12">
              <span>{item}</span>
              <span className="text-brand-orange select-none" aria-hidden="true">/</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
