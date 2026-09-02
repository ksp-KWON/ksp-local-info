import React from 'react';
import Link from 'next/link';
import { PostData } from '@/lib/types';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PremiumBadge from '@/components/ui/PremiumBadge';
import PremiumCard from '@/components/ui/PremiumCard';

interface PostCardProps {
  post: PostData;
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
          className="p-5 sm:p-6 !flex-col sm:!flex-row sm:!items-center justify-between gap-5 h-full"
        >
          <div className="flex-1 min-w-0 z-10 relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <PremiumBadge color="charcoal">
                {mainCategory}
              </PremiumBadge>
              <time className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 ml-2">
                <AppIcon name="calendar" size={13} strokeWidth={1.5} />
                <span>{post.date}</span>
              </time>
            </div>
            <div className="min-w-0 space-y-1.5 mt-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-1 leading-snug break-keep">
                {post.title}
              </h3>
              <p className="text-sm font-normal text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed break-keep">
                {post.summary}
              </p>
            </div>
          </div>

          <div className="sm:shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 dark:border-zinc-800 sm:border-t-0 sm:border-l sm:pl-6 flex items-center justify-end z-10 relative">
            <span className="text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <span>자세히 보기</span>
              <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
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
