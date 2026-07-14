import { getSortedPostsData } from '@/lib/posts';
import BlogClient from './BlogClient';

export default function BlogList() {
  const posts = getSortedPostsData();

  return <BlogClient initialPosts={posts} />;
}
