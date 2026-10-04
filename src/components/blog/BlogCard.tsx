import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import type { BlogPost } from '@/types/database';

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(post: BlogPost): number {
  const text = JSON.stringify(post.content ?? {});
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white border border-line rounded-xl2 shadow-card overflow-hidden flex flex-col group hover:border-brand-orange/50 hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-40 bg-surface-gray flex items-center justify-center relative">
        {post.featured_image ? (
          <Image src={post.featured_image} alt={post.featured_image_alt || post.title} fill sizes="400px" className="object-cover" />
        ) : (
          <Newspaper size={32} className="text-line group-hover:text-brand-orange/40 transition-colors" />
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-[11px] font-display font-bold text-brand-orange uppercase tracking-wide mb-3">
          {post.category}
        </span>
        <h3 className="font-display font-bold text-ink mb-2 leading-snug">{post.title}</h3>
        <p className="text-ink-muted text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>
            {formatDate(post.published_at)} · {estimateReadTime(post)} min read
          </span>
          <span className="text-brand-orange font-display font-semibold inline-flex items-center gap-1">
            Read Article <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
