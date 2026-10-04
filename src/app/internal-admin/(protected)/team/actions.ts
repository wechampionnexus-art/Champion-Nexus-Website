'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';

export type TeamFormState = { error?: string } | undefined;

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function readTeamFields(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const role = String(formData.get('role') || '').trim();
  const skillsRaw = String(formData.get('skills') || '');
  return {
    name,
    role,
    slug: slugify(String(formData.get('slug') || '').trim() || name),
    skills: skillsRaw.split(',').map((s) => s.trim()).filter(Boolean),
    biography: String(formData.get('biography') || '') || null,
    image_url: String(formData.get('image_url') || '') || null,
    image_alt: String(formData.get('image_alt') || '') || null,
    profile_url: String(formData.get('profile_url') || '') || null,
    display_order: Number(formData.get('display_order') || 0),
    published: formData.get('published') === 'on',
  };
}

export async function createTeamMember(_prevState: TeamFormState, formData: FormData): Promise<TeamFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const fields = readTeamFields(formData);

  if (!fields.name || !fields.role) return { error: 'Name and role are required.' };

  const { error } = await supabase.from('team_members').insert(fields);
  if (error) return { error: error.code === '23505' ? 'That slug is already in use.' : error.message };

  revalidatePath('/team');
  revalidatePath('/');
  redirect(`${getAdminBasePath()}/team`);
}

export async function updateTeamMember(
  id: string,
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const fields = readTeamFields(formData);

  if (!fields.name || !fields.role) return { error: 'Name and role are required.' };

  const { error } = await supabase.from('team_members').update(fields).eq('id', id);
  if (error) return { error: error.code === '23505' ? 'That slug is already in use.' : error.message };

  revalidatePath('/team');
  revalidatePath('/');
  redirect(`${getAdminBasePath()}/team`);
}

export async function deleteTeamMember(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createServerSupabaseClient();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await supabase.from('team_members').delete().eq('id', id);
  revalidatePath('/team');
  revalidatePath('/');
}
