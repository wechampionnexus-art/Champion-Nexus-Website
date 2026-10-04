import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, getPublishedPosts } from '@/lib/data/blog';
import { RichTextRenderer } from '@/components/blog/RichTextRenderer';
import { BlogCard } from '@/components/blog/BlogCard';
import { ButtonLink } from '@/components/ui/Button';
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts(1);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: 'Article not found', path: `/blog/${params.slug}`, noIndex: true });
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.meta_description || post.excerpt,
    path: post.canonical_url || `/blog/${post.slug}`,
    image: post.featured_image || undefined,
  });
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug);
  const articleUrl = new URL(`/blog/${post.slug}`, SITE_URL).toString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image || undefined,
    author: { '@type': 'Organization', name: post.author },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: articleUrl,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: new URL('/blog', SITE_URL).toString() },
      { '@type': 'ListItem', position: 2, name: post.title, item: articleUrl },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav aria-label="Breadcrumb" className="pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <Link href="/blog" className="text-xs font-display font-semibold text-ink-muted hover:text-brand-orange inline-flex items-center gap-1">
            <ArrowLeft size={14} /> All Articles
          </Link>
        </div>
      </nav>

      <section className="pt-6 pb-10">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
            {post.category}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-4 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-ink-soft mt-5 font-display">
            {post.author} · {formatDate(post.published_at)}
          </div>

          {post.featured_image && (
            <div className="relative w-full aspect-[16/9] mt-8 rounded-xl2 overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.featured_image_alt || post.title}
                fill
                sizes="768px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <RichTextRenderer content={post.content} />

          <div className="mt-10 pt-6 border-t border-line flex flex-wrap items-center gap-3">
            <span className="text-xs font-display font-semibold text-ink-soft">Share:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-semibold text-ink-muted hover:text-brand-orange"
            >
              LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-semibold text-ink-muted hover:text-brand-orange"
            >
              X (Twitter)
            </a>
          </div>

          <div className="mt-14 pt-10 border-t border-line text-center">
            <h2 className="font-display font-bold text-xl text-ink mb-5">
              Ready to put this into action?
            </h2>
            <ButtonLink href="/contact">
              Discuss Your Project <ArrowUpRight size={16} />
            </ButtonLink>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-surface-cream border-t border-line">
          <div className="max-w-container mx-auto px-5 md:px-8">
            <h2 className="font-display font-extrabold text-2xl text-ink mb-10">Related articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
