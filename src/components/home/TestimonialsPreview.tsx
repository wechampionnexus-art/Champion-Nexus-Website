/**
 * Goes at: src/components/home/TestimonialsPreview.tsx (same path/name as
 * before — replaces it in place).
 *
 * CHANGE: this stays a Server Component and keeps fetching the data
 * exactly as before, but display is now handed off to
 * TestimonialsRotator.tsx (new file, delivered alongside this one) —
 * the rotation timer, crossfade animation, and reduced-motion handling
 * all need client-side state/effects, which a Server Component can't
 * have. The export name (`TestimonialsPreview`) and what it renders
 * from the outside are unchanged, so nothing importing it elsewhere
 * needs to change.
 */

import { getPublishedTestimonials } from '@/lib/data/testimonials';
import { TestimonialsRotator } from './Testimonialsrotator';

export async function TestimonialsPreview() {
  const { testimonials, isDemo } = await getPublishedTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <TestimonialsRotator testimonials={testimonials} isDemo={isDemo} />
      </div>
    </section>
  );
}