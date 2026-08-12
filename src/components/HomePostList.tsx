'use client';

import { useState } from 'react';
import Link from 'next/link';
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
            <div className="flex items-center justify-between mb-5 py-3 sm:py-3.5 relative z-10 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white mb-0">
                <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 text-${theme.color}-500`} strokeWidth={2.5} />
                {theme.title}
              </h2>
              <Link href={`/blog?category=${encodeURIComponent(categoryId)}`} className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group shrink-0 ml-4">
                전체보기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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
        <section className="mt-12 bg-white dark:bg-[#1a1c20] p-5 sm:p-8 rounded-none border border-gray-100 dark:border-gray-800 shadow-2xl">
          <h3 className="font-bold text-xl sm:text-2xl mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <span>✨</span> 더 많은 맞춤 혜택 찾아보기
          </h3>
          
          <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide gap-2">
            {restCategories.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => setActiveTab(cat.categoryId)}
                className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                  currentTabCategory?.categoryId === cat.categoryId
                    ? 'bg-blue-600 text-white shadow-2xl'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
            <div className="mt-8 text-center">
              <Link href={`/blog?category=${encodeURIComponent(currentTabCategory.categoryId)}`} className="inline-flex items-center gap-2 font-bold text-[15px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-6 py-3.5 rounded-none hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200">
                {currentTabCategory.categoryLabel} 전체보기 ➡️
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
