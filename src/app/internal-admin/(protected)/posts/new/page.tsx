import { PostForm } from '@/components/admin/PostForm';
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-8">New Post</h1>
      <PostForm action={createPost} />
    </div>
  );
}
