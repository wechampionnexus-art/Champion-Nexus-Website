import { getPublishedPosts } from '@/lib/data/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export async function BlogPreview() {
  const { posts } = await getPublishedPosts(1);
  const items = posts.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-surface-cream">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeading title="Latest from the blog" className="mb-0" />
          <ButtonLink href="/blog" variant="outline" className="w-fit">
            Visit the blog <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
