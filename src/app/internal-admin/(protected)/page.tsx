import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';
import { StatsCard } from '@/components/admin/StatsCard';
import { FileText, Users, Quote, Mail, MailWarning } from 'lucide-react';

async function getCount(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  table: 'blog_posts' | 'team_members' | 'testimonials' | 'contact_submissions',
  filters: Record<string, unknown> = {}
) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }
  const { count, error } = await query;
  if (error) {
    console.error(`Count query failed for ${table}:`, error.message);
    return 0;
  }
  return count ?? 0;
}

export default async function AdminOverviewPage() {
  const supabase = createServerSupabaseClient();
  const adminBase = getAdminBasePath();

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalTeam,
    publishedTeam,
    totalTestimonials,
    totalContacts,
    newContacts,
  ] = await Promise.all([
    getCount(supabase, 'blog_posts'),
    getCount(supabase, 'blog_posts', { published: true }),
    getCount(supabase, 'blog_posts', { published: false }),
    getCount(supabase, 'team_members'),
    getCount(supabase, 'team_members', { published: true }),
    getCount(supabase, 'testimonials'),
    getCount(supabase, 'contact_submissions'),
    getCount(supabase, 'contact_submissions', { status: 'new' }),
  ]);

  const { data: recentContacts } = await supabase
    .from('contact_submissions')
    .select('id, name, service, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatsCard icon={FileText} label="Total Posts" value={totalPosts} />
        <StatsCard icon={FileText} label="Published Posts" value={publishedPosts} accent />
        <StatsCard icon={FileText} label="Draft Posts" value={draftPosts} />
        <StatsCard icon={Users} label="Team Members" value={`${publishedTeam}/${totalTeam}`} />
        <StatsCard icon={Quote} label="Testimonials" value={totalTestimonials} />
        <StatsCard icon={Mail} label="Contact Submissions" value={totalContacts} />
        <StatsCard icon={MailWarning} label="New / Unread" value={newContacts} accent />
      </div>

      <div className="bg-white border border-line rounded-xl2 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-ink">Recent contact submissions</h2>
          <Link href={`${adminBase}/contacts`} className="text-xs font-display font-semibold text-brand-orange">
            View all
          </Link>
        </div>
        {!recentContacts || recentContacts.length === 0 ? (
          <p className="text-ink-muted text-sm">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recentContacts.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-ink-soft text-xs">{c.service}</p>
                </div>
                <span className="text-xs font-display font-semibold uppercase text-ink-soft">{c.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
