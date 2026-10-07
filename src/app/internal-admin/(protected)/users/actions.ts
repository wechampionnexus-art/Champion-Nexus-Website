'use server';

/**
 * Goes at: src/app/internal-admin/(protected)/users/actions.ts
 *
 * FIX #4: lets a signed-in admin create a new admin-dashboard account
 * (e.g. someone who should be able to manage blog posts) without anyone
 * ever touching Supabase directly or needing a public sign-up flow —
 * there still is none, by design.
 *
 * Security notes (consistent with every other actions.ts in this
 * project):
 *   - requireAdminSession() re-checks authorization on the server for
 *     THIS action specifically. It does not rely solely on the
 *     (protected) layout's guard.
 *   - Account creation itself requires the Supabase service-role key,
 *     which only ever lives in src/lib/supabase/admin.ts (server-only).
 *     That file is imported here, nowhere else new.
 *   - A newly created account is only usable once a matching row exists
 *     in admin_profiles — is_admin() (used by every RLS policy) checks
 *     that table, not auth.users. Creating the auth user alone would NOT
 *     grant dashboard access.
 *   - Error messages here are deliberately specific (e.g. "that email is
 *     already registered") because this form is itself admin-only and
 *     behind the secret route + session check — unlike the public login
 *     form, there's no one unauthenticated to avoid leaking information
 *     to.
 */

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';
// Adjust this import if your actual export from src/lib/supabase/admin.ts
// is named differently (e.g. `supabaseAdmin` instead of a factory
// function) — it's the one service-role client already used by the rest
// of the admin dashboard's server actions.
import { createAdminClient } from '@/lib/supabase/admin';

export type CreateUserResult = { error: string } | { success: true };

export async function createDashboardUser(
  _prev: CreateUserResult | null,
  formData: FormData
): Promise<CreateUserResult> {
  await requireAdminSession();

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');
  const fullName = String(formData.get('fullName') || '').trim();

  if (!email || !email.includes('@')) {
    return { error: 'Enter a valid email address.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  // BUG FIX: everything below used to run with no try/catch. If anything
  // threw instead of returning a Supabase {error} object — createAdminClient()
  // itself throwing (e.g. a missing/misnamed service-role env var), a
  // network error, anything — the whole server action would reject with
  // an unhandled exception. useFormState has no way to show that: it
  // just leaves `state` as whatever it was before (null here), so the
  // form silently does nothing, which matches exactly what was reported.
  // Wrapping it means every failure now reaches the UI as a real error
  // string, and is also logged server-side so it shows up in your
  // `npm run dev` / server terminal output even if you don't read the
  // UI message.
  try {
    const supabaseAdmin = createAdminClient();

    // Create the Supabase Auth user. email_confirm: true skips the
    // confirmation-email step — appropriate here because an admin, not
    // the new user, is the one filling in this form and vouching for the
    // email address.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created?.user) {
      console.error('[createDashboardUser] createUser failed:', createError);
      const message = createError?.message || '';
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('registered')) {
        return { error: 'That email is already registered.' };
      }
      return { error: `Could not create the account: ${message || 'unknown error — check server logs.'}` };
    }

    // Grant dashboard access by adding the matching admin_profiles row —
    // this is the row is_admin() actually checks. Confirmed against the
    // real schema: admin_profiles has no `full_name` column (that was a
    // guess that turned out wrong — Supabase's "Could not find the
    // 'full_name' column... in the schema cache" error said so directly),
    // so it's left out here and the form field for it below is removed
    // too, rather than keeping a field that silently does nothing.
    const { error: profileError } = await supabaseAdmin.from('admin_profiles').insert({
      id: created.user.id,
      email,
      role: 'admin',
    });

    if (profileError) {
      console.error('[createDashboardUser] admin_profiles insert failed:', profileError);
      // Roll back the auth user so we don't leave an orphaned account
      // that can sign in but has no dashboard access and no easy way to
      // retry.
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      // Surfacing the real Postgres/Supabase error text here (rather
      // than a generic message) is safe on THIS form specifically —
      // unlike the public login form, there's no unauthenticated
      // visitor to avoid leaking information to; only a signed-in admin
      // ever sees this page. This is what actually tells you which
      // column/constraint is wrong instead of guessing blindly again.
      return { error: `Could not set up dashboard access: ${profileError.message}` };
    }

    const base = await getAdminBasePath();
    revalidatePath(`${base}/users`);
    return { success: true };
  } catch (err) {
    console.error('[createDashboardUser] unexpected error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Unexpected server error: ${message}. Check your server terminal for the full log.` };
  }
}