'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export async function updateContactStatus(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!id || !status) return;

  await supabase.from('contact_submissions').update({ status }).eq('id', id);
  revalidatePath(`${getAdminBasePath()}/contacts`);
}

export async function deleteContactSubmission(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) return;

  await supabase.from('contact_submissions').delete().eq('id', id);
  revalidatePath(`${getAdminBasePath()}/contacts`);
}
