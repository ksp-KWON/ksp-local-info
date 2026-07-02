import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogList() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center gap-2 mb-10 border-b border-slate-200 pb-4">
        <span className="text-3xl">📝</span>
        <h1 className="text-3xl font-black text-[#202124] dark:text-[#e8eaed] tracking-tight">유용한 소식 블로그</h1>
      </div>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`} 
            className="block p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,144,214,0.15)] hover:border-[#0090D6] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold bg-[#e8f0fe] text-[#0090D6] dark:bg-[#174ea6]/20 dark:text-[#8ab4f8] px-2.5 py-1 rounded-md border border-[#d2e3fc]/30 dark:border-[#174ea6]/30">
                {post.category || '정보'}
              </span>
              <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium">{post.date}</span>
            </div>
            
            <h2 className="text-xl font-black tracking-tight text-[#202124] dark:text-[#e8eaed] mb-2 group-hover:text-[#0090D6] transition-colors">
              {post.title}
            </h2>
            
            <p className="font-medium text-[#5f6368] dark:text-[#9aa0a6] text-sm leading-relaxed">{post.summary}</p>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl">
            <p className="text-[#5f6368] dark:text-[#9aa0a6] font-bold">📭 작성된 블로그 글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
