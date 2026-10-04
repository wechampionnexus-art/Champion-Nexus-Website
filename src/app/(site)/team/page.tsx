import type { Metadata } from 'next';
import Image from 'next/image';
import { User2 } from 'lucide-react';
import { getPublishedTeamMembers } from '@/lib/data/team';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Our Team',
  description: 'Meet the people behind Champion Nexus — SEO, content, and digital marketing specialists.',
  path: '/team',
});

export default async function TeamPage() {
  const { members, isDemo } = await getPublishedTeamMembers();

  return (
    <>
      <section className="pt-36 pb-16 md:pt-44 bg-surface-cream">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Team
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-4 max-w-2xl leading-tight">
            The people behind the strategy
          </h1>
          {isDemo && (
            <p className="text-ink-soft text-sm mt-5 max-w-xl">
              Demo profiles are shown below for presentation purposes. Publish real team members
              from the admin dashboard to replace them.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-container mx-auto px-5 md:px-8">
          {members.length === 0 ? (
            <p className="text-ink-muted">No team members have been published yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <div key={member.id} className="bg-white border border-line rounded-xl2 shadow-card overflow-hidden">
                  <div className="h-56 bg-surface-gray flex items-center justify-center relative">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.image_alt || member.name}
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                    ) : (
                      <User2 size={48} className="text-ink-soft" aria-hidden="true" />
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-display font-bold text-ink">{member.name}</h2>
                    <p className="text-ink-muted text-sm mt-0.5">{member.role}</p>
                    {member.biography && (
                      <p className="text-ink-soft text-xs mt-3 leading-relaxed">{member.biography}</p>
                    )}
                    {isDemo && (
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft mt-3">Demo profile</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
