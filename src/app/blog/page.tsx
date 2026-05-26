import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogList() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">블로그</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-2">{post.date} {post.category && `| ${post.category}`}</div>
            <p className="font-normal text-gray-700">{post.summary}</p>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-gray-500">작성된 블로그 글이 없습니다.</p>}
      </div>
    </div>
  );
}
