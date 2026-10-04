import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getPublishedPosts, getAllCategories, BLOG_PAGE_SIZE } from '@/lib/data/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'SEO, content marketing, and digital growth insights from Champion Nexus.',
  path: '/blog',
});

type Props = {
  searchParams: { category?: string; q?: string; page?: string };
};

export default async function BlogPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const category = searchParams.category || 'All';
  const search = searchParams.q || '';

  const [{ posts, total, isDemo }, categories] = await Promise.all([
    getPublishedPosts(page, { category, search }),
    getAllCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const allCategories = ['All', ...categories];

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (search) params.set('q', search);
    if (targetPage > 1) params.set('page', String(targetPage));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : '/blog';
  }

  return (
    <>
      <section className="pt-36 pb-10 md:pt-44 bg-surface-cream">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            Blog
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mt-4 leading-tight">
            Insights for digital growth
          </h1>
          {isDemo && (
            <p className="text-ink-soft text-sm mt-4">
              Demo content is shown because no posts have been published yet.
            </p>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <form method="get" className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <Link
                  key={c}
                  href={c === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(c)}`}
                  className={`font-display text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                    c === category ? 'border-brand-orange text-brand-orange' : 'border-line text-ink-muted hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="Search articles"
                className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-sm text-ink focus:border-brand-orange focus:outline-none"
              />
              {category !== 'All' && <input type="hidden" name="category" value={category} />}
            </div>
          </form>

          {posts.length === 0 ? (
            <p className="text-ink-muted">No articles match your search.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-14">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-display font-semibold border transition-colors ${
                    p === page ? 'border-brand-orange text-brand-orange bg-brand-orange-light' : 'border-line text-ink-muted hover:border-brand-orange'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
