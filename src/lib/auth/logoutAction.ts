'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export async function logoutAction() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}
