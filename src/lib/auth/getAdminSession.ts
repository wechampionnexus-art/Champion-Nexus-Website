import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AdminSession = {
  userId: string;
  email: string;
  role: 'admin' | 'editor';
};

/**
 * The single source of truth for "is this request allowed into the admin
 * dashboard". Call this at the top of every protected Server Component,
 * Server Action, and Route Handler — never trust the URL alone (the secret
 * slug in middleware.ts is obscurity, not authorization).
 *
 * Returns null if there is no signed-in user, or the signed-in user has no
 * row in admin_profiles. Deny-by-default: anything that isn't explicitly
 * an admin gets null.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;

  return { userId: user.id, email: profile.email, role: profile.role as 'admin' | 'editor' };
}

/**
 * Convenience wrapper for Server Components / Server Actions that should
 * hard-fail (throw) if the caller isn't an authorized admin. Route Handlers
 * generally prefer getAdminSession() + an explicit 401/403 response instead.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Not authorized.');
  }
  return session;
}
