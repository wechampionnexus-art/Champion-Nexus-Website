'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-display font-semibold py-3 rounded-lg transition-colors"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white border border-line rounded-xl2 shadow-card p-8">
        <h1 className="font-display font-bold text-xl text-ink mb-1">Champion Nexus Admin</h1>
        <p className="text-ink-muted text-sm mb-6">Sign in with your authorized admin account.</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-display font-semibold text-ink-muted mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-display font-semibold text-ink-muted mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-red-600 text-sm">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="text-ink-soft text-xs mt-6 text-center">
          There is no public sign-up. Accounts are created manually on supabase account to navigate table editor menu to add it.
        </p>
      </div>
    </div>
  );
}
