import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { createTestimonial } from '../actions';

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Add Testimonial</h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
