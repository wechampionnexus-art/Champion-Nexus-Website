import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PostForm } from '@/components/admin/PostForm';
import { updatePost } from '../../actions';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', params.id).maybeSingle();

  if (!post) notFound();

  const boundAction = updatePost.bind(null, post.id);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">Edit Post</h1>
      <PostForm action={boundAction} post={post} />
    </div>
  );
}
