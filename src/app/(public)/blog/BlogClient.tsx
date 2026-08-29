'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import AppIcon from '@/components/ui/AppIcon';
import Link from 'next/link';

function BlogClientContent({ initialPosts }: { initialPosts: PostData[] }) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let posts = initialPosts;
  let categoryTitle = '유용한 소식 및 생활 정보';
  let categoryDesc = '의정부시와 관련된 실생활 지원금, 공공 복지, 의료 및 시정 소식을 정리하여 제공합니다.';

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (mounted && categoryId) {
    const matchedCategory = CATEGORIES.find((c) => c.id === categoryId || c.label === categoryId);
    if (matchedCategory) {
      categoryTitle = matchedCategory.title;
      categoryDesc = matchedCategory.desc;
      posts = posts.filter((post) => {
        if (!post.category || !Array.isArray(post.category)) return false;
        const cats = post.category as string[];
        return matchedCategory.keywords.some((keyword) => cats.some((cat) => cat.includes(keyword)));
      });
    } else {
      categoryTitle = `${categoryId} 소식`;
      categoryDesc = `의정부시의 다양한 ${categoryId} 관련 정보를 모아보세요.`;
      posts = posts.filter((post) => {
        if (!post.category || !Array.isArray(post.category)) return false;
        const cats = post.category as string[];
        return cats.some((cat) => cat.includes(categoryId));
      });
    }
  }

  const availableTags = Array.from(new Set(posts.flatMap((post) => post.tags || []))).sort();

  if (selectedTag) {
    posts = posts.filter((post) => post.tags?.includes(selectedTag));
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. 상단 브레드크럼 */}
      <nav className="flex text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li className="text-gray-900 dark:text-white font-bold" aria-current="page">
            생활 소식 및 혜택
          </li>
        </ol>
      </nav>

      {/* 2. 블로그 페이지 헤더 (Sharp Modern 스타일) */}
      <div className="relative overflow-hidden rounded-none bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-md">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-extrabold mb-3 border border-blue-100 dark:border-blue-800/40 rounded-none">
          의정부 생활정보 허브
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          {categoryTitle}
        </h1>
        <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 font-medium break-keep">
          {categoryDesc}
        </p>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
          <span>전체 포스팅</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">{posts.length}건</span>
        </div>
      </div>

      {/* 3. 해시태그 필터 UI */}
      {availableTags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedTag(null)}
            className={`shrink-0 px-3.5 py-1.5 rounded-none text-xs font-bold transition-all border cursor-pointer ${
              selectedTag === null
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 dark:bg-[#181a1d] dark:text-gray-300 dark:border-zinc-800 dark:hover:border-zinc-700'
            }`}
          >
            # 전체보기
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`shrink-0 px-3.5 py-1.5 rounded-none text-xs font-bold transition-all border cursor-pointer ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 dark:bg-[#181a1d] dark:text-gray-300 dark:border-zinc-800 dark:hover:border-zinc-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 4. 포스트 리스트 */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} variant="list" />
        ))}
        {mounted && posts.length === 0 && (
          <div className="bg-white dark:bg-[#181a1d] rounded-none border border-gray-200/80 dark:border-zinc-800 text-center py-16 px-4 sm:p-16 shadow-md">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <AppIcon name="search" size={24} />
            </div>
            <p className="text-base font-bold text-gray-600 dark:text-gray-400">
              해당 조건에 일치하는 포스팅이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: PostData[] }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 pb-16 text-center text-sm font-bold text-gray-400">
          생활 소식을 불러오는 중입니다...
        </div>
      }
    >
      <BlogClientContent initialPosts={initialPosts} />
    </Suspense>
  );
}
