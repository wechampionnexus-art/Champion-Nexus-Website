import { getPublishedTestimonials } from '@/lib/data/testimonials';
import { Quote } from 'lucide-react';

export async function TestimonialsPreview() {
  const { testimonials, isDemo } = await getPublishedTestimonials();
  const item = testimonials[0];
  if (!item) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            {isDemo ? 'Sample testimonial — placeholder content' : 'What clients say'}
          </span>
          <Quote size={32} className="text-brand-orange mx-auto mt-7 mb-6" />
          <p className="font-display text-xl md:text-2xl text-ink leading-snug mb-5">
            &ldquo;{item.message}&rdquo;
          </p>
          <div className="text-sm text-ink-muted">
            {item.client_name}
            {item.company ? ` · ${item.company}` : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
