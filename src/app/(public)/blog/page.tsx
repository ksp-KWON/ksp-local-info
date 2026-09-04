import { getSortedPostsData } from '@/lib/posts';
import BlogClient from './BlogClient';

export default function BlogList() {
  const posts = getSortedPostsData();

  return (
    <div className="mx-auto w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-10">
      <BlogClient initialPosts={posts} />
    </div>
  );
}

