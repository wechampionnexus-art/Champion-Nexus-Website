'use client';

/**
 * Goes at: src/app/internal-admin/(protected)/users/CreateUserForm.tsx
 *
 * Extracted out of page.tsx so the page itself can be a Server Component
 * (needed to fetch and render the existing-users list below this form).
 * This is the only part of the Users screen that needs to be a Client
 * Component, since it uses hooks (useFormState / useFormStatus).
 *
 * Unchanged from before otherwise: still uses `useFormState` (from
 * react-dom, not `useActionState` from react — React 18/Next.js 14
 * compatible) and a separate SubmitButton so useFormStatus can read the
 * nearest parent <form>'s pending state.
 */

import { useFormState, useFormStatus } from 'react-dom';
import { createDashboardUser, type CreateUserResult } from './actions';

const initialState: CreateUserResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
    >
      {pending ? 'Creating…' : 'Create account'}
    </button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useFormState(createDashboardUser, initialState);

  return (
    <form action={formAction} className="space-y-5 bg-white border border-line rounded-xl2 p-6">
      <div>
        <label htmlFor="email" className="block text-sm font-display font-medium text-ink mb-1.5">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          placeholder="name@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-display font-medium text-ink mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-display font-medium text-ink mb-1.5">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state && 'success' in state && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Account created. Share the email and password with them directly — they
          should change the password after their first login.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}