import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import type { TeamMember } from '@/types/database';

/**
 * DEMO content only — shown with a visible "Demo profile" label whenever
 * Supabase isn't configured yet. Never presented as real Champion Nexus
 * staff. Once Supabase is connected and an admin publishes real team
 * members, this constant is never read.
 */
export const DEMO_TEAM: TeamMember[] = [
  {
    id: 'demo-1',
    name: 'Demo Profile',
    slug: 'demo-profile-1',
    role: 'SEO Specialist',
    skills: ['Technical SEO', 'Keyword Strategy'],
    biography: null,
    image_url: null,
    image_alt: null,
    profile_url: null,
    display_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Demo Profile',
    slug: 'demo-profile-2',
    role: 'Content Strategist',
    skills: ['Content Planning', 'Editorial'],
    biography: null,
    image_url: null,
    image_alt: null,
    profile_url: null,
    display_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Demo Profile',
    slug: 'demo-profile-3',
    role: 'PPC Specialist',
    skills: ['Paid Search', 'Campaign Analytics'],
    biography: null,
    image_url: null,
    image_alt: null,
    profile_url: null,
    display_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedTeamMembers(): Promise<{ members: TeamMember[]; isDemo: boolean }> {
  if (!isSupabaseConfigured()) return { members: DEMO_TEAM, isDemo: true };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getPublishedTeamMembers failed:', error.message);
    return { members: [], isDemo: false };
  }
  if (!data || data.length === 0) {
    return { members: DEMO_TEAM, isDemo: true };
  }
  return { members: data, isDemo: false };
}
