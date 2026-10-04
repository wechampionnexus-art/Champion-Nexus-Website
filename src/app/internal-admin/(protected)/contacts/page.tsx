import Link from 'next/link';
import { Mail } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateContactStatus, deleteContactSubmission } from './actions';
import type { ContactStatus } from '@/types/database';

const STATUSES: ContactStatus[] = ['new', 'read', 'in_progress', 'resolved'];

type Props = { searchParams: { status?: string } };

export default async function AdminContactsPage({ searchParams }: Props) {
  const supabase = createServerSupabaseClient();
  const statusFilter = searchParams.status;

  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && STATUSES.includes(statusFilter as ContactStatus)) {
    query = query.eq('status', statusFilter);
  }

  const { data: submissions } = await query;

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Contact Submissions</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="?"
          className={`text-xs font-display font-semibold px-3.5 py-1.5 rounded-full border ${!statusFilter ? 'border-brand-orange text-brand-orange' : 'border-line text-ink-muted'}`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`?status=${s}`}
            className={`text-xs font-display font-semibold px-3.5 py-1.5 rounded-full border capitalize ${statusFilter === s ? 'border-brand-orange text-brand-orange' : 'border-line text-ink-muted'}`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {(submissions ?? []).map((sub) => (
          <div key={sub.id} className="bg-white border border-line rounded-xl2 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-display font-bold text-ink">{sub.name}</p>
                <a href={`mailto:${sub.email}`} className="text-brand-orange text-sm inline-flex items-center gap-1">
                  <Mail size={13} /> {sub.email}
                </a>
              </div>
              <span className="text-xs text-ink-soft whitespace-nowrap">
                {new Date(sub.created_at).toLocaleString()}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink-muted mb-3">
              <p><strong className="text-ink">Service:</strong> {sub.service}</p>
              {sub.company && <p><strong className="text-ink">Company:</strong> {sub.company}</p>}
              {sub.website && <p><strong className="text-ink">Website:</strong> {sub.website}</p>}
              {sub.phone && <p><strong className="text-ink">Phone:</strong> {sub.phone}</p>}
              {sub.budget && <p><strong className="text-ink">Budget:</strong> {sub.budget}</p>}
              {!sub.email_sent && (
                <p className="text-red-600 sm:col-span-2">
                  Notification email failed to send{sub.email_error ? `: ${sub.email_error}` : '.'} The
                  submission itself is saved safely — follow up manually.
                </p>
              )}
            </div>

            <p className="text-sm text-ink bg-surface-gray rounded-lg p-3 mb-4 whitespace-pre-wrap">
              {sub.message}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <form action={updateContactStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={sub.id} />
                <select
                  name="status"
                  defaultValue={sub.status}
                  className="text-xs border border-line rounded-lg px-3 py-1.5 capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <button type="submit" className="text-xs font-display font-semibold text-brand-orange">
                  Update
                </button>
              </form>
              <form action={deleteContactSubmission}>
                <input type="hidden" name="id" value={sub.id} />
                <button type="submit" className="text-xs font-display font-semibold text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}

        {(!submissions || submissions.length === 0) && (
          <p className="text-ink-muted text-center py-10">No submissions{statusFilter ? ' with this status' : ''}.</p>
        )}
      </div>
    </div>
  );
}
