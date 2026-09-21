import React from 'react';
import Link from 'next/link';
import { PostData, PostMeta } from '@/lib/types';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PremiumBadge from '@/components/ui/PremiumBadge';
import PremiumCard from '@/components/ui/PremiumCard';

interface PostCardProps {
  post: PostMeta | PostData;
  variant?: 'grid' | 'list';
}

function getWatermarkIcon(category: string): AppIconName {
  if (category.includes('지원금') || category.includes('복지')) return 'bank';
  if (category.includes('건강') || category.includes('의료')) return 'hospital';
  if (category.includes('문화') || category.includes('축제')) return 'party-popper';
  if (category.includes('생활') || category.includes('교통')) return 'shield-check';
  return 'file-text';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoriesToDisplay = Array.isArray(post.category) ? post.category : post.category ? [post.category] : [];
  const mainCategory = categoriesToDisplay[0] || '생활·교통';
  const watermarkIcon = getWatermarkIcon(mainCategory);

  if (variant === 'list') {
    return (
      <Link href={'/blog/' + post.slug} className="group flex flex-col w-full">
        <PremiumCard
          hoverEffect={true}
          watermarkIcon={watermarkIcon}
          className="p-4 sm:p-6 h-full justify-between"
        >
          <div className="relative z-10 space-y-2">
            {/* 상단 메타: 카테고리 뱃지 + 발행일자 */}
            <div className="flex items-center justify-between gap-2">
              <PremiumBadge color="charcoal">
                {mainCategory}
              </PremiumBadge>
              <time className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0">
                <AppIcon name="calendar" size={13} strokeWidth={1.5} />
                <span>{post.date}</span>
              </time>
            </div>

            {/* 제목 & 요약문 */}
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-2 leading-snug break-keep">
                {post.title}
              </h2>
              {post.summary && (
                <p className="text-xs sm:text-sm font-normal text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed break-keep mt-1.5">
                  {post.summary}
                </p>
              )}
            </div>
          </div>

          {/* 하단 영역: 태그 클라우드 + 자세히 보기 버튼 */}
          <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
            <div className="flex flex-wrap gap-1.5">
              {(post.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 rounded-none"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="shrink-0 flex items-center gap-1 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white">
              <span>자세히 보기</span>
              <AppIcon
                name="chevron-right"
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </PremiumCard>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={'/blog/' + post.slug} className="group flex flex-col h-full">
      <PremiumCard
        hoverEffect={true}
        watermarkIcon={watermarkIcon}
        className="p-4 sm:p-5 h-full justify-between"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <PremiumBadge color="charcoal">
              {mainCategory}
            </PremiumBadge>
            <time className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <AppIcon name="calendar" size={13} />
              {post.date}
            </time>
          </div>
          <div className="space-y-2">
            <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-zinc-950 dark:text-white leading-snug break-keep line-clamp-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
              {post.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 break-keep font-normal">
              {post.summary}
            </p>
          </div>
        </div>

        <div className="mt-4 w-full text-xs sm:text-[12.5px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between transition-colors p-2.5 bg-zinc-50/90 dark:bg-white/5 border border-gray-100 dark:border-zinc-800/80 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 relative z-10">
          <div className="flex items-center gap-2">
            <span>글 읽기</span>
          </div>
          <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </PremiumCard>
    </Link>
  );
}
