'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import type { BlogPost } from '@/types/database';
import type { PostFormState } from '@/app/internal-admin/(protected)/posts/actions';

type Action = (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;

type Props = {
  action: Action;
  post?: BlogPost;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-display font-semibold text-sm px-6 py-3 rounded-full transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

const inputClass =
  'w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink focus:border-brand-orange focus:outline-none';
const labelClass = 'block text-xs font-display font-semibold text-ink-muted mb-2';

export function PostForm({ action, post }: Props) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div>
        <label className={labelClass} htmlFor="title">Post title</label>
        <input id="title" name="title" type="text" defaultValue={post?.title} required className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="slug">URL slug (auto-generated if left blank)</label>
          <input id="slug" name="slug" type="text" defaultValue={post?.slug} className={inputClass} placeholder="auto-generated-from-title" />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">Category</label>
          <input id="category" name="category" type="text" defaultValue={post?.category ?? 'General'} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Content</label>
        <TiptapEditor name="content" initialContent={post?.content} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="featured_image">Featured image URL</label>
          <input id="featured_image" name="featured_image" type="text" defaultValue={post?.featured_image ?? ''} className={inputClass} placeholder="https://…/storage/v1/object/public/blog-images/…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="featured_image_alt">Featured image alt text</label>
          <input id="featured_image_alt" name="featured_image_alt" type="text" defaultValue={post?.featured_image_alt ?? ''} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="author">Author</label>
        <input id="author" name="author" type="text" defaultValue={post?.author ?? 'Champion Nexus Team'} className={inputClass} />
      </div>

      <fieldset className="border border-line rounded-lg p-4">
        <legend className="text-xs font-display font-semibold text-ink-muted px-1">SEO (optional)</legend>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="seo_title">SEO title override</label>
            <input id="seo_title" name="seo_title" type="text" defaultValue={post?.seo_title ?? ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="meta_description">Meta description</label>
            <textarea id="meta_description" name="meta_description" rows={2} defaultValue={post?.meta_description ?? ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="canonical_url">Canonical URL override</label>
            <input id="canonical_url" name="canonical_url" type="text" defaultValue={post?.canonical_url ?? ''} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={post?.published ? 'published' : 'draft'} className={inputClass}>
          <option value="draft">Save as draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton label={post ? 'Update Post' : 'Create Post'} />
      </div>
    </form>
  );
}
