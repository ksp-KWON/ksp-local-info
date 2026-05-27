import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogList() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-10 border-b border-slate-200 pb-4">
        <span className="text-3xl">📝</span>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">유용한 소식 블로그</h1>
      </div>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`} 
            className="block p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100/50">
                {post.category || '정보'}
              </span>
              <span className="text-xs text-slate-400 font-medium">{post.date}</span>
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-2 group-hover:text-indigo-600">
              {post.title}
            </h2>
            
            <p className="font-normal text-slate-500 text-sm leading-relaxed">{post.summary}</p>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl">
            <p className="text-slate-400 font-medium">📭 작성된 블로그 글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
