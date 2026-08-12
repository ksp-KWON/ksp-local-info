'use client';

import { useState } from 'react';
import Link from 'next/link';
import NeoHeading from '@/components/ui/NeoHeading';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES, getCategoryTheme } from '@/lib/constants';

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {
  const [activeTab, setActiveTab] = useState<string>('');

  const categoriesWithPosts = CATEGORIES.map(cat => {
    const posts = initialPosts.filter(post => {
      if (!post.category || !Array.isArray(post.category)) return false;
      const cats = post.category as string[];
      return cat.keywords.some(keyword => cats.some(c => c.includes(keyword)));
    });
    return { categoryId: cat.id, categoryLabel: cat.label, posts };
  }).filter(item => item.posts.length > 0);

  if (categoriesWithPosts.length === 0) return null;

  // 상위 2개는 메인으로 노출
  const topCategories = categoriesWithPosts.slice(0, 2);
  const restCategories = categoriesWithPosts.slice(2);

  // 현재 활성화된 탭 설정
  const currentTabCategory = activeTab 
    ? restCategories.find(c => c.categoryId === activeTab) || restCategories[0]
    : restCategories[0];

  return (
    <div className="space-y-12">
      {/* 1. 상단 하이라이트 카테고리 (고정 2개) */}
      {topCategories.map(({ categoryId, categoryLabel, posts }) => {
        const theme = getCategoryTheme(categoryLabel);
        const IconComponent = theme.icon;
        return (
          <section key={categoryId} className="relative">
            <div className="flex items-center justify-between mb-5 py-3 sm:py-3.5 relative z-10 border-b-4 border-black dark:border-white">
              <NeoHeading level={2} highlighterColor={theme.color} icon={<IconComponent className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />} className="!mb-0">
                {theme.title}
              </NeoHeading>
              <Link href={`/blog?category=${encodeURIComponent(categoryId)}`} className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-black dark:text-white hover:underline transition-colors group shrink-0 ml-4">
                전체보기
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map(post => (
                <PostCard key={post.slug} post={post} variant="grid" />
              ))}
            </div>
          </section>
        );
      })}

      {/* 2. 하단 탭형 카테고리 */}
      {restCategories.length > 0 && (
        <section className="mt-12 bg-gray-50 dark:bg-[#1a1c20] p-4 sm:p-6 rounded-2xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <h3 className="font-dohyeon text-xl mb-4 text-black dark:text-white flex items-center gap-2">
            <span>✨</span> 더 많은 맞춤 혜택 찾아보기
          </h3>
          
          <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide gap-2">
            {restCategories.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => setActiveTab(cat.categoryId)}
                className={`whitespace-nowrap px-4 py-2 font-jua text-sm rounded-full border-2 transition-colors ${
                  currentTabCategory?.categoryId === cat.categoryId
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]'
                    : 'border-black dark:border-white bg-white text-black hover:bg-gray-100 dark:bg-[#202124] dark:text-white dark:hover:bg-gray-800'
                }`}
              >
                {cat.categoryLabel}
              </button>
            ))}
          </div>

          {currentTabCategory && (
            <div className="grid gap-4 sm:grid-cols-2">
              {currentTabCategory.posts.slice(0, 4).map(post => (
                <PostCard key={post.slug} post={post} variant="grid" />
              ))}
            </div>
          )}
          
          {currentTabCategory && (
            <div className="mt-6 text-center">
              <Link href={`/blog?category=${encodeURIComponent(currentTabCategory.categoryId)}`} className="inline-flex items-center gap-2 font-bold text-sm bg-white dark:bg-[#202124] px-6 py-3 border-2 border-black dark:border-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
                {currentTabCategory.categoryLabel} 전체보기 ➡️
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
