import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import type { Testimonial } from '@/types/database';

/**
 * DEMO placeholders only — always rendered with a visible "Sample
 * testimonial" label (see TestimonialCard). Never presented as a real
 * customer endorsement. Real testimonials must be entered and explicitly
 * published by an admin before they appear.
 */
export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: 'demo-1',
    client_name: 'Placeholder Client',
    company: 'Placeholder Company',
    position: null,
    message: 'Sample testimonial — placeholder content for demo purposes.',
    avatar_url: null,
    rating: null,
    published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    client_name: 'Placeholder Client',
    company: 'Placeholder Company',
    position: null,
    message: 'Your result could be featured here.',
    avatar_url: null,
    rating: null,
    published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedTestimonials(): Promise<{
  testimonials: Testimonial[];
  isDemo: boolean;
}> {
  if (!isSupabaseConfigured()) return { testimonials: DEMO_TESTIMONIALS, isDemo: true };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getPublishedTestimonials failed:', error.message);
    return { testimonials: [], isDemo: false };
  }
  if (!data || data.length === 0) {
    return { testimonials: DEMO_TESTIMONIALS, isDemo: true };
  }
  return { testimonials: data, isDemo: false };
}
