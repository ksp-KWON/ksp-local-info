'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

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

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (mounted && categoryId) {
    const matchedCategory = CATEGORIES.find(c => c.id === categoryId);
    if (matchedCategory) {
      categoryTitle = matchedCategory.title;
      categoryDesc = matchedCategory.desc;
      posts = posts.filter(post => {
        if (!post.category || !Array.isArray(post.category)) return false;
        const cats = post.category as string[];
        return matchedCategory.keywords.some(keyword => cats.some(cat => cat.includes(keyword)));
      });
    } else {
      // 키워드 직접 매칭 폴백
      categoryTitle = `${categoryId} 소식`;
      categoryDesc = `의정부시의 다양한 ${categoryId} 관련 정보를 모아보세요.`;
      posts = posts.filter(post => {
         if (!post.category || !Array.isArray(post.category)) return false;
         const cats = post.category as string[];
         return cats.some(cat => cat.includes(categoryId));
      });
    }
  }

  // 카테고리로 1차 필터링된 포스트들에서 존재하는 모든 고유 태그 추출
  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags || []))).sort();

  // 선택된 태그로 2차 필터링
  if (selectedTag) {
    posts = posts.filter(post => post.tags?.includes(selectedTag));
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 블로그 페이지 헤더 (Premium 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 dark:from-[#1a1c20] dark:via-[#1a1c20] dark:to-blue-900/10 border border-blue-100/50 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          {categoryTitle}
        </h1>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 font-medium break-keep">
          {categoryDesc}
        </p>
      </div>
      
      {/* 해시태그 필터 UI */}
      {availableTags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mt-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border-2 ${
              selectedTag === null 
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)]' 
                : 'bg-white text-black border-black/20 hover:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-white/20 dark:hover:border-white'
            }`}
          >
            #전체
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border-2 ${
                selectedTag === tag
                  ? 'bg-[#3b82f6] text-white border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)]'
                  : 'bg-white text-black border-black/20 hover:border-black dark:bg-[#1a1a1a] dark:text-white dark:border-white/20 dark:hover:border-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} variant="list" />
        ))}
        {mounted && posts.length === 0 && (
          <div className="bg-white dark:bg-[#1a1c20] rounded-2xl border border-gray-100 dark:border-gray-800 text-center py-16 px-4 sm:p-16 col-span-full shadow-sm">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 19h6"></path><path d="M10 15h8"></path><path d="M10 19h8"></path></svg>
            <p className="text-lg font-bold tracking-wide text-gray-500 dark:text-gray-400">
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
      <div className="space-y-8 pb-16 text-center text-gray-500 font-jua">
        불러오는 중...
      </div>
    }>
      <BlogClientContent initialPosts={initialPosts} />
    </Suspense>
  );
}
