'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Testimonial } from '@/types/database';
import type { TestimonialFormState } from '@/app/internal-admin/(protected)/testimonials/actions';

type Action = (prevState: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
type Props = { action: Action; testimonial?: Testimonial };

const inputClass =
  'w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink focus:border-brand-orange focus:outline-none';
const labelClass = 'block text-xs font-display font-semibold text-ink-muted mb-2';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-display font-semibold text-sm px-6 py-3 rounded-full transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

export function TestimonialForm({ action, testimonial }: Props) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="client_name">Client name</label>
          <input id="client_name" name="client_name" type="text" defaultValue={testimonial?.client_name} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company (if approved for use)</label>
          <input id="company" name="company" type="text" defaultValue={testimonial?.company ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="position">Job title (if supplied)</label>
          <input id="position" name="position" type="text" defaultValue={testimonial?.position ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="avatar_url">Avatar URL (optional)</label>
          <input id="avatar_url" name="avatar_url" type="text" defaultValue={testimonial?.avatar_url ?? ''} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">Testimonial text</label>
        <textarea id="message" name="message" rows={4} defaultValue={testimonial?.message} required className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="rating">Rating 1–5 (only if based on genuine feedback)</label>
          <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="display_order">Display order</label>
          <input id="display_order" name="display_order" type="number" defaultValue={testimonial?.display_order ?? 0} className={inputClass} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published ?? false} className="rounded border-line" />
        Published (visible on the public site)
      </label>
      <p className="text-xs text-ink-soft -mt-3">
        New testimonials default to unpublished. Only publish real, approved feedback.
      </p>

      <SubmitButton label={testimonial ? 'Update Testimonial' : 'Add Testimonial'} />
    </form>
  );
}
