import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminBasePath } from '@/lib/auth/getAdminBasePath';
import { deletePost } from './actions';

export default async function AdminPostsPage() {
  const supabase = createServerSupabaseClient();
  const adminBase = getAdminBasePath();

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, published, published_at, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-extrabold text-2xl text-ink">Blog Posts</h1>
        <Link
          href={`${adminBase}/posts/new`}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">Failed to load posts: {error.message}</p>}

      <div className="bg-white border border-line rounded-xl2 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-b border-line last:border-0">
                <td className="p-4 font-medium text-ink">{post.title}</td>
                <td className="p-4 text-ink-muted">{post.category}</td>
                <td className="p-4">
                  <span
                    className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full ${
                      post.published ? 'bg-green-50 text-green-700' : 'bg-surface-gray text-ink-soft'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-ink-soft">{new Date(post.updated_at).toLocaleDateString()}</td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link href={`${adminBase}/posts/${post.id}/edit`} className="text-brand-orange text-xs font-display font-semibold mr-4">
                    Edit
                  </Link>
                  <form action={deletePost} className="inline">
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="text-red-600 text-xs font-display font-semibold">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  No posts yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
