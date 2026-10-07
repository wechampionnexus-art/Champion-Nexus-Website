'use client';

/**
 * Goes at: src/components/home/TestimonialsRotator.tsx (new file,
 * imported by the updated TestimonialsPreview.tsx delivered alongside
 * this one).
 *
 * Owns everything that needs to run in the browser:
 *   - Only auto-rotates when there's more than one testimonial
 *     (`testimonials.length > 1`). With exactly one (or zero, though
 *     TestimonialsPreview already returns null for that case), no timer
 *     is created at all and the single testimonial just renders
 *     statically — matches "apply animation when length is greater than
 *     1" exactly.
 *   - Advances to the next testimonial every 3 seconds, wrapping back to
 *     the first after the last ("show one by one").
 *   - Centered on every device (text-center, max-w-2xl mx-auto) — same
 *     centering the original already had, just confirmed/kept here.
 *   - Crossfades the new testimonial in with GSAP; skipped under
 *     prefers-reduced-motion, where the swap is instant with no motion.
 */

import { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { gsap } from 'gsap';
import type { getPublishedTestimonials } from '@/lib/data/testimonials';

// Inferred from the data-fetching function's own return type rather than
// hand-written, so this can't drift out of sync with the real shape of
// `testimonials` coming from src/lib/data/testimonials.ts.
type Testimonial = Awaited<ReturnType<typeof getPublishedTestimonials>>['testimonials'][number];

type Props = {
  testimonials: Testimonial[];
  isDemo: boolean;
};

const ROTATE_INTERVAL_MS = 3000;

export function TestimonialsRotator({ testimonials, isDemo }: Props) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // The actual rotation timer. Only created when there's something to
  // rotate between — a single testimonial gets no interval at all, so
  // there's nothing running in the background to clean up either.
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [testimonials.length]);

  // Crossfade whenever the active testimonial changes. Guarded by
  // reducedMotion so a reduced-motion visitor just sees the new text
  // swap in with no animation at all, rather than a smaller/faster
  // version of the same motion.
  useEffect(() => {
    if (reducedMotion || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [index, reducedMotion]);

  const item = testimonials[index];
  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
        {isDemo ? 'Sample testimonial placeholder content' : 'What clients say'}
      </span>
      <Quote size={32} className="text-brand-orange mx-auto mt-7 mb-6" />

      <div ref={contentRef}>
        <p className="font-display text-xl md:text-2xl text-ink leading-snug mb-5">
          &ldquo;{item.message}&rdquo;
        </p>
        <div className="text-sm text-ink-muted">
          {item.client_name}
          {item.company ? ` · ${item.company}` : ''}
        </div>
      </div>

      {/* Small dot indicators — only shown when there's more than one
          testimonial to move between. Optional nicety (click to jump to
          a specific testimonial); delete this block if you'd rather
          keep the section bare. */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8" role="tablist" aria-label="Testimonials">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-orange' : 'w-1.5 bg-line'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}