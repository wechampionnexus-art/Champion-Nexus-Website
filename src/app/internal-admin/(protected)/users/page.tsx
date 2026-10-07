/**
 * Goes at: src/app/internal-admin/(protected)/users/page.tsx
 * (paired with: users-actions.ts -> actions.ts, and the new
 *  users-create-form.tsx -> CreateUserForm.tsx, delivered separately)
 *
 * CHANGE: this page is now a Server Component (no 'use client') so it
 * can fetch and render the list of existing dashboard accounts directly
 * from Supabase on every request — the list you asked for below the
 * form. The form itself (the only part that needs client-side
 * interactivity) is pulled out into CreateUserForm.tsx.
 *
 * This also sidesteps the "message doesn't show" issue: when the create
 * action succeeds, its revalidatePath(...) call tells Next.js to
 * re-fetch this Server Component, so the new account simply appears in
 * the list below — a real, server-rendered confirmation that doesn't
 * depend on the client-side useFormState round-trip that seems to be
 * getting lost (most likely a Turbopack dev-mode rough edge with Server
 * Actions, the same category of issue as the Google Fonts error — worth
 * confirming by removing --turbo from your dev script, as already
 * suggested).
 */

import { requireAdminSession } from '@/lib/auth/getAdminSession';
// Adjust this import if your actual export from src/lib/supabase/admin.ts
// is named differently — same client already used by actions.ts.
import { createAdminClient } from '@/lib/supabase/admin';
import { CreateUserForm } from './Createuserform';

export default async function UsersPage() {
  await requireAdminSession();

  const supabaseAdmin = createAdminClient();
  const { data: users, error } = await supabaseAdmin
    .from('admin_profiles')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Dashboard Users</h1>
      <p className="text-sm text-ink-muted mb-8">
        Create a new account so someone else can sign in to this dashboard — for example, to
        manage blog posts. There is no public sign-up; this is the only way a new account gets
        created.
      </p>

      <CreateUserForm />

      <div className="mt-10">
        <h2 className="font-display font-semibold text-lg text-ink mb-4">Existing accounts</h2>

        {error ? (
          // Most likely cause if you see this: admin_profiles columns
          // used in the .select() above (role / created_at) don't match
          // your real schema — same kind of mismatch as the earlier
          // full_name issue. The message below will say which one.
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            Could not load the user list: {error.message}
          </p>
        ) : !users || users.length === 0 ? (
          <p className="text-sm text-ink-muted">No dashboard accounts yet.</p>
        ) : (
          <div className="bg-white border border-line rounded-xl2 divide-y divide-line overflow-hidden">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-display font-medium text-ink">{u.email}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Added {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>
                <span className="text-[11px] font-display font-semibold uppercase tracking-wide text-ink-muted bg-surface-gray rounded-full px-2.5 py-1">
                  {u.role || 'admin'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}