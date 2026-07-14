'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type PostData = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
};

const CATEGORIES = [
  { id: '혜택', title: '복지·지원금 소식', desc: '의정부시의 다양한 복지 및 지원금 혜택을 모아보세요.', keywords: ['지원금', '혜택', '복지'] },
  { id: '행사', title: '문화·행사 소식', desc: '의정부시 지역 행사와 축제 소식을 모아보세요.', keywords: ['행사', '축제', '문화'] },
  { id: '의료', title: '건강·의료 소식', desc: '의정부시의 건강 및 의료 관련 정보를 모아보세요.', keywords: ['의료', '건강', '병원'] },
  { id: '정보', title: '생활정보 소식', desc: '의정부시의 유용한 생활 및 민원 정보를 모아보세요.', keywords: ['정보', '민원', '기타'] }
];

function BlogClientContent({ initialPosts }: { initialPosts: PostData[] }) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Hydration 불일치를 막기 위해, 마운트 되기 전(SSR/SSG 단계)에는 전체 글을 렌더링
  let posts = initialPosts;
  let categoryTitle = '유용한 소식 및 생활 정보';
  let categoryDesc = '의정부시와 관련된 유용한 정보와 생활 소식을 정리하여 제공합니다.';

  if (mounted && categoryId) {
    const matchedCategory = CATEGORIES.find(c => c.id === categoryId);
    if (matchedCategory) {
      categoryTitle = matchedCategory.title;
      categoryDesc = matchedCategory.desc;
      posts = posts.filter(post => {
        if (!post.category) return false;
        return matchedCategory.keywords.some(keyword => post.category?.includes(keyword));
      });
    } else {
      // 키워드 직접 매칭 폴백
      categoryTitle = `${categoryId} 소식`;
      categoryDesc = `의정부시의 다양한 ${categoryId} 관련 정보를 모아보세요.`;
      posts = posts.filter((post) => post.category?.includes(categoryId));
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
      {/* 블로그 페이지 헤더 */}
      <div className="border-b border-gray-100 dark:border-white/10 pb-4 mb-6 transition-all">
        <h1 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-[#e8eaed] flex items-center gap-2">
          <svg className="w-6 h-6 text-[#0090D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          {categoryTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1.5">
          {categoryDesc}
        </p>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-[#1e1f22] p-4 sm:p-6 rounded-none sm:rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#0090D6] hover:shadow-[0_16px_50px_rgba(0,144,214,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className="px-2.5 py-1 font-bold rounded-none bg-[#f8f9fa] text-[#5f6368] dark:bg-[#303134] dark:text-[#9aa0a6] border border-transparent">
                  {post.category || '정보'}
                </span>
                <time className="text-[#5f6368] dark:text-[#9aa0a6] font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {post.date}
                </time>
              </div>
              <div className="relative w-full overflow-hidden mb-2">
                <h2 className="text-base sm:text-lg font-bold text-[#202124] dark:text-[#e8eaed] hover:text-[#0090D6] transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
              </div>
              <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed font-normal">
                {post.summary}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
              <Link
                href={`/blog/${post.slug}`}
                className="shrink-0 text-sm font-bold text-[#0090D6] hover:underline transition-colors flex items-center gap-1 ml-auto"
              >
                자세히 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </article>
        ))}

        {mounted && posts.length === 0 && (
          <div className="text-center py-16 px-4 sm:p-16 bg-white dark:bg-[#1e1f22] rounded-none sm:rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
            <svg className="w-12 h-12 text-[#dadce0] dark:text-[#5f6368] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 19h6"></path><path d="M10 15h8"></path><path d="M10 19h8"></path></svg>
            <p className="text-sm font-bold tracking-wide text-[#5f6368] dark:text-[#9aa0a6]">
              해당 카테고리에 등록된 포스팅이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: PostData[] }) {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center text-gray-500">
        불러오는 중...
      </div>
    }>
      <BlogClientContent initialPosts={initialPosts} />
    </Suspense>
  );
}
