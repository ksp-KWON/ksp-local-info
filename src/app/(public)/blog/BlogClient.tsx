'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PageHeaderBanner from '@/components/ui/PageHeaderBanner';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import Link from 'next/link';

function BlogClientContent({ initialPosts }: { initialPosts: PostData[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let posts = initialPosts;
  let categoryTitle = '유용한 소식 및 생활 정보';
  let categoryDesc = '의정부 시민들을 위한 공공 혜택, 행사, 병원 및 생활 정보 가이드입니다.';

  if (categoryParam) {
    posts = initialPosts.filter((post) => {
      if (!post.category) return false;
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      const cleanParam = categoryParam.replace(/^[^\s]+\s/, '');
      return cats.some((c) => c.includes(cleanParam) || c === categoryParam);
    });
    categoryTitle = categoryParam.replace(/^[^\s]+\s/, '');
    categoryDesc = `‘${categoryTitle}’ 관련 최신 의정부 소식 및 가이드 목록입니다.`;
  } else if (tagParam) {
    posts = initialPosts.filter((post) => {
      if (!post.tags) return false;
      return post.tags.includes(tagParam);
    });
    categoryTitle = `#${tagParam} 관련 소식`;
    categoryDesc = `‘#${tagParam}’ 태그가 포함된 의정부 포스트 목록입니다.`;
  }

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* 1. 카테고리 헤더 */}
      <PageHeaderBanner
        className="mt-4"
        badgeText="카테고리 큐레이션"
        badgeTone="sky"
        badgeIcon="list"
        title={categoryTitle}
        description={`${categoryDesc} (총 ${posts.length}건)`}
        watermarkIcon="compass"
      />

      {/* 2. 카테고리 필터 탭바 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/blog"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all border rounded-none shadow-2xs ${
            !categoryParam && !tagParam
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
          }`}
        >
          <AppIcon name="list" size={14} strokeWidth={2} />
          <span>전체보기</span>
        </Link>
        {CATEGORIES.map((cat) => {
          const isSelected = categoryParam === cat.name || categoryParam?.includes(cat.name);
          return (
            <Link
              key={cat.id}
              href={`/blog?category=${encodeURIComponent(cat.name)}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all border rounded-none shadow-2xs ${
                isSelected
                  ? 'bg-sky-50 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200 border-sky-300 dark:border-sky-800'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <AppIcon name={cat.iconName} size={14} strokeWidth={2} className={isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-500'} />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      {/* 3. 게시물 그리드 리스트 */}
      {posts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} variant="grid" />
          ))}
        </div>
      ) : (
        <PremiumCard hoverEffect={false} className="p-12 text-center">
          <AppIcon name="info" size={36} strokeWidth={1.5} className="mx-auto mb-3 text-zinc-400" />
          <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            해당 조건에 맞는 소식이 아직 등록되지 않았습니다.
          </p>
          <div className="mt-4 flex justify-center">
            <PremiumButton href="/blog" variant="primary" size="sm" icon="chevron-right" iconPosition="right">
              전체 글 보기
            </PremiumButton>
          </div>
        </PremiumCard>
      )}
    </div>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: PostData[] }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-zinc-500">목록을 불러오는 중입니다...</div>}>
      <BlogClientContent initialPosts={initialPosts} />
    </Suspense>
  );
}
