import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';
import { deleteTestimonial } from './actions';

export default async function AdminTestimonialsPage() {
  const supabase = createServerSupabaseClient();
  const adminBase = getAdminBasePath();

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, client_name, company, published, display_order')
    .order('display_order', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-extrabold text-2xl text-ink">Testimonials</h1>
        <Link
          href={`${adminBase}/testimonials/new`}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> Add Testimonial
        </Link>
      </div>

      <div className="bg-white border border-line rounded-xl2 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Client</th>
              <th className="p-4">Company</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(testimonials ?? []).map((t) => (
              <tr key={t.id} className="border-b border-line last:border-0">
                <td className="p-4 font-medium text-ink">{t.client_name}</td>
                <td className="p-4 text-ink-muted">{t.company || '—'}</td>
                <td className="p-4">
                  <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full ${t.published ? 'bg-green-50 text-green-700' : 'bg-surface-gray text-ink-soft'}`}>
                    {t.published ? 'Published' : 'Unpublished'}
                  </span>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link href={`${adminBase}/testimonials/${t.id}/edit`} className="text-brand-orange text-xs font-display font-semibold mr-4">
                    Edit
                  </Link>
                  <form action={deleteTestimonial} className="inline">
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-red-600 text-xs font-display font-semibold">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!testimonials || testimonials.length === 0) && (
              <tr><td colSpan={4} className="p-6 text-center text-ink-muted">No testimonials yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
