'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { TeamMember } from '@/types/database';
import type { TeamFormState } from '@/app/internal-admin/(protected)/team/actions';

type Action = (prevState: TeamFormState, formData: FormData) => Promise<TeamFormState>;
type Props = { action: Action; member?: TeamMember };

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

export function TeamMemberForm({ action, member }: Props) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" defaultValue={member?.name} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="role">Role / title</label>
          <input id="role" name="role" type="text" defaultValue={member?.role} required className={inputClass} placeholder="e.g. SEO Specialist" />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">URL slug (auto-generated if left blank)</label>
        <input id="slug" name="slug" type="text" defaultValue={member?.slug} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="skills">Skills (comma-separated)</label>
        <input id="skills" name="skills" type="text" defaultValue={member?.skills?.join(', ')} className={inputClass} placeholder="Technical SEO, Keyword Strategy" />
      </div>

      <div>
        <label className={labelClass} htmlFor="biography">Short biography (optional)</label>
        <textarea id="biography" name="biography" rows={3} defaultValue={member?.biography ?? ''} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="image_url">Profile image URL</label>
          <input id="image_url" name="image_url" type="text" defaultValue={member?.image_url ?? ''} className={inputClass} placeholder="https://…/storage/v1/object/public/team-images/…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="image_alt">Image alt text</label>
          <input id="image_alt" name="image_alt" type="text" defaultValue={member?.image_alt ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="profile_url">LinkedIn / profile URL (optional)</label>
          <input id="profile_url" name="profile_url" type="text" defaultValue={member?.profile_url ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="display_order">Display order</label>
          <input id="display_order" name="display_order" type="number" defaultValue={member?.display_order ?? 0} className={inputClass} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="published" defaultChecked={member?.published ?? true} className="rounded border-line" />
        Published (visible on the public site)
      </label>

      <SubmitButton label={member ? 'Update Team Member' : 'Add Team Member'} />
    </form>
  );
}
