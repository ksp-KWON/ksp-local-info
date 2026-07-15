'use client';

import Link from 'next/link';
import NeoHeading from '@/components/ui/NeoHeading';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES, getCategoryTheme } from '@/lib/constants';

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {
  // 카테고리별 포스트 분류
  const categoriesWithPosts = CATEGORIES.map(cat => {
    const posts = initialPosts.filter(post => {
      if (!post.category || !Array.isArray(post.category)) return false;
      const cats = post.category as string[];
      return cat.keywords.some(keyword => cats.some(c => c.includes(keyword)));
    });
    return { categoryId: cat.id, categoryLabel: cat.label, posts };
  }).filter(item => item.posts.length > 0);

  return (
    <div className="space-y-12">
      {categoriesWithPosts.map(({ categoryId, categoryLabel, posts }) => {
        const theme = getCategoryTheme(categoryLabel);
        const IconComponent = theme.icon;
        const displayPosts = posts.slice(0, 3); // 3개 노출

        return (
          <section key={categoryId} className="relative">
            {/* 카테고리 헤더 */}
            <div className="flex items-center justify-between mb-5 py-3 sm:py-3.5 relative z-10 border-b-4 border-black dark:border-white">
              <NeoHeading level={2} highlighterColor={theme.color} icon={<IconComponent className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />} className="!mb-0">
                {theme.title}
              </NeoHeading>
              <Link href={`/blog?category=${categoryId}`} className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-black dark:text-white hover:underline transition-colors group shrink-0 ml-4">
                전체보기
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            </div>
            
            {/* 게시물 그리드 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map(post => (
                <PostCard key={post.slug} post={post} variant="grid" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
