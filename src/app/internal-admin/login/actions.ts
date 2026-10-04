'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export type LoginState = { error?: string } | undefined;

/**
 * Signs in with Supabase Auth, then verifies the signed-in user actually has
 * an admin_profiles row before letting them through. Deliberately returns
 * the SAME generic error message whether the email doesn't exist, the
 * password is wrong, or the user isn't an authorized admin — so the login
 * form never reveals which admin emails exist (per the "avoid revealing
 * whether a specific admin email exists" requirement).
 */
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  const genericError = 'Incorrect email or password, or this account is not authorized.';

  if (error || !data.user) {
    return { error: genericError };
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    // Valid Supabase login, but not an authorized admin — sign them back
    // out immediately and show the same generic error.
    await supabase.auth.signOut();
    return { error: genericError };
  }

  redirect(getAdminBasePath());
}
