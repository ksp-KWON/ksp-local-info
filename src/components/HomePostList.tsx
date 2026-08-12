'use client';

import Link from 'next/link';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES, getCategoryTheme } from '@/lib/constants';

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {

  const categoriesWithPosts = CATEGORIES.map(cat => {
    const posts = initialPosts.filter(post => {
      if (!post.category || !Array.isArray(post.category)) return false;
      const cats = post.category as string[];
      return cat.keywords.some(keyword => cats.some(c => c.includes(keyword)));
    });
    return { categoryId: cat.id, categoryLabel: cat.label, posts };
  }).filter(item => item.posts.length > 0);

  if (categoriesWithPosts.length === 0) return null;

  return (
    <div className="space-y-12">
      {categoriesWithPosts.map(({ categoryId, categoryLabel, posts }) => {
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
    </div>
  );
}
