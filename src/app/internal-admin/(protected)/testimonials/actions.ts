'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export type TestimonialFormState = { error?: string } | undefined;

function readFields(formData: FormData) {
  const ratingRaw = String(formData.get('rating') || '');
  return {
    client_name: String(formData.get('client_name') || '').trim(),
    company: String(formData.get('company') || '') || null,
    position: String(formData.get('position') || '') || null,
    message: String(formData.get('message') || '').trim(),
    avatar_url: String(formData.get('avatar_url') || '') || null,
    rating: ratingRaw ? Number(ratingRaw) : null,
    display_order: Number(formData.get('display_order') || 0),
    published: formData.get('published') === 'on',
  };
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const fields = readFields(formData);

  if (!fields.client_name || !fields.message) return { error: 'Client name and message are required.' };

  const { error } = await supabase.from('testimonials').insert(fields);
  if (error) return { error: error.message };

  revalidatePath('/');
  redirect(`${getAdminBasePath()}/testimonials`);
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const fields = readFields(formData);

  if (!fields.client_name || !fields.message) return { error: 'Client name and message are required.' };

  const { error } = await supabase.from('testimonials').update(fields).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  redirect(`${getAdminBasePath()}/testimonials`);
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await supabase.from('testimonials').delete().eq('id', id);
  revalidatePath('/');
}
