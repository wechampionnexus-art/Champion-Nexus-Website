import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { updateTestimonial } from '../../actions';

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: testimonial } = await supabase.from('testimonials').select('*').eq('id', params.id).maybeSingle();

  if (!testimonial) notFound();

  const boundAction = updateTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Edit Testimonial</h1>
      <TestimonialForm action={boundAction} testimonial={testimonial} />
    </div>
  );
}
