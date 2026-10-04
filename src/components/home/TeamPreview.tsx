import { getPublishedTeamMembers } from '@/lib/data/team';
import { TeamMarquee } from '@/components/team/TeamMarquee';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export async function TeamPreview() {
  const { members, isDemo } = await getPublishedTeamMembers();
  if (members.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-surface-cream overflow-hidden">
      <div className="max-w-container mx-auto px-5 md:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <SectionHeading eyebrow="Team" title="The people behind the strategy" className="mb-0" />
        <ButtonLink href="/team" variant="outline" className="w-fit">
          Meet the full team <ArrowRight size={16} />
        </ButtonLink>
      </div>
      <div className="max-w-container mx-auto px-5 md:px-8">
        <TeamMarquee members={members} isDemo={isDemo} />
      </div>
    </section>
  );
}
