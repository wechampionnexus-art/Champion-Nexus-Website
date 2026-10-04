import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import { updateTeamMember } from '../../actions';

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: member } = await supabase.from('team_members').select('*').eq('id', params.id).maybeSingle();

  if (!member) notFound();

  const boundAction = updateTeamMember.bind(null, member.id);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Edit Team Member</h1>
      <TeamMemberForm action={boundAction} member={member} />
    </div>
  );
}
