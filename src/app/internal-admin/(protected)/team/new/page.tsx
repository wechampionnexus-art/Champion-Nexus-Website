import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import { createTeamMember } from '../actions';

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Add Team Member</h1>
      <TeamMemberForm action={createTeamMember} />
    </div>
  );
}
