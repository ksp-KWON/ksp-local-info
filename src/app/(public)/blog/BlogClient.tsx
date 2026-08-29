'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import PostCard from '@/components/ui/PostCard';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import Link from 'next/link';

function getCategoryIcon(label: string): AppIconName {
  if (label.includes('지원금') || label.includes('혜택')) return 'bank';
  if (label.includes('취업') || label.includes('창업')) return 'trending-up';
  if (label.includes('아이') || label.includes('가족')) return 'heart';
  if (label.includes('병원') || label.includes('아플 때')) return 'hospital';
  if (label.includes('생활') || label.includes('즐길거리')) return 'leaf';
  return 'file-text';
}

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
      return cats.some((c) => c.includes(categoryParam.replace(/^[^\s]+\s/, '')) || c === categoryParam);
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
      {/* 1. 카테고리 헤더 (모던 수묵 & 굵은 라인 SVG 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-none border-2 border-black dark:border-white bg-white dark:bg-[#181a1d] shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] p-6 sm:p-8 group">
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="compass" size={160} strokeWidth={2} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider mb-3 border-2 border-black dark:border-white rounded-none">
            <AppIcon name="list" size={14} strokeWidth={2.5} />
            <span>카테고리 큐레이션</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black dark:text-white mb-2">
            {categoryTitle}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium break-keep">
            {categoryDesc} (총 {posts.length}건)
          </p>
        </div>
      </div>

      {/* 2. 카테고리 필터 탭바 (수묵 흑백 굵은 먹선 칩) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/blog"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black whitespace-nowrap transition-all border-2 rounded-none ${
            !categoryParam && !tagParam
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,0.9)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.9)]'
              : 'bg-white dark:bg-[#181a1d] text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
          }`}
        >
          <AppIcon name="list" size={14} strokeWidth={2.5} />
          <span>전체보기</span>
        </Link>
        {CATEGORIES.map((cat) => {
          const isSelected = categoryParam === cat.label;
          const icon = getCategoryIcon(cat.label);
          return (
            <Link
              key={cat.id}
              href={`/blog?category=${encodeURIComponent(cat.label)}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black whitespace-nowrap transition-all border-2 rounded-none ${
                isSelected
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,0.9)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.9)]'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
              }`}
            >
              <AppIcon name={icon} size={14} strokeWidth={2.5} />
              <span>{cat.label.replace(/^[^\s]+\s/, '')}</span>
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
        <div className="p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#181a1d]">
          <AppIcon name="info" size={36} strokeWidth={2} className="mx-auto mb-3 text-zinc-400" />
          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">
            해당 조건에 맞는 소식이 아직 등록되지 않았습니다.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-black text-xs border-2 border-black dark:border-white"
          >
            <span>전체 글 보기</span>
            <AppIcon name="chevron-right" size={14} strokeWidth={2.5} />
          </Link>
        </div>
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
