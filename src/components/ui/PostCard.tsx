import Link from 'next/link';
import { PostData } from '@/lib/types';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PremiumBadge from '@/components/ui/PremiumBadge';

interface PostCardProps {
  post: PostData;
  variant?: 'grid' | 'list';
}

import { type BadgeColor } from '@/components/ui/PremiumBadge';

function getWatermarkIcon(category: string): AppIconName {
  if (category.includes('지원금') || category.includes('혜택') || category.includes('복지')) return 'bank';
  if (category.includes('취업') || category.includes('창업') || category.includes('일자리')) return 'trending-up';
  if (category.includes('아이') || category.includes('임산부') || category.includes('가족') || category.includes('출산')) return 'heart';
  if (category.includes('병원') || category.includes('약국') || category.includes('의료') || category.includes('돌봄')) return 'hospital';
  if (category.includes('생활') || category.includes('문화') || category.includes('행사') || category.includes('축제')) return 'leaf';
  return 'file-text';
}

function getCategoryBadgeColor(category: string): BadgeColor {
  if (category.includes('지원금') || category.includes('혜택') || category.includes('복지')) return 'green';
  if (category.includes('병원') || category.includes('약국') || category.includes('의료') || category.includes('건강')) return 'teal';
  if (category.includes('취업') || category.includes('창업') || category.includes('일자리')) return 'blue';
  if (category.includes('문화') || category.includes('행사') || category.includes('축제')) return 'purple';
  if (category.includes('아이') || category.includes('임산부') || category.includes('가족') || category.includes('출산')) return 'rose';
  if (category.includes('주거') || category.includes('교통')) return 'amber';
  return 'charcoal';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoriesToDisplay = Array.isArray(post.category) ? post.category : post.category ? [post.category] : [];
  const mainCategory = categoriesToDisplay[0] || '생활·민원';
  const watermarkIcon = getWatermarkIcon(mainCategory);
  const badgeColor = getCategoryBadgeColor(mainCategory);

  if (variant === 'list') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full">
        <div className="bg-white dark:bg-[#181a1d] rounded-none p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.75)] hover:-translate-y-0.5 transition-all duration-300 border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-800 dark:hover:border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full relative overflow-hidden">
          {/* 워터마크 SVG */}
          <div className="absolute right-3.5 bottom-2.5 opacity-[0.035] dark:opacity-[0.055] text-zinc-900 dark:text-zinc-100 select-none pointer-events-none group-hover:scale-105 transition-all duration-300 z-0">
            <AppIcon name={watermarkIcon} size={68} strokeWidth={1.5} />
          </div>

          <div className="flex-1 min-w-0 z-10 relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <PremiumBadge color={badgeColor}>
                {mainCategory.replace(/^[^\s]+\s/, '')}
              </PremiumBadge>
              <time className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 ml-2">
                <AppIcon name="calendar" size={13} strokeWidth={1.5} />
                <span>{post.date}</span>
              </time>
            </div>
            <div className="min-w-0 space-y-1.5 mt-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-1 leading-snug break-keep">
                {post.title}
              </h3>
              <p className="text-sm font-normal text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed break-keep">
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
        </div>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col justify-between relative bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.75)] hover:-translate-y-0.5 hover:border-zinc-800 dark:hover:border-zinc-300 p-4 sm:p-5 active:scale-[0.98] transition-all duration-300 overflow-hidden rounded-none outline-none"
    >
      {/* 워터마크 SVG */}
      <div className="absolute right-3.5 bottom-2.5 opacity-[0.035] dark:opacity-[0.055] text-zinc-900 dark:text-zinc-100 select-none pointer-events-none group-hover:scale-105 transition-all duration-300 z-0">
        <AppIcon name={watermarkIcon} size={68} strokeWidth={1.5} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <PremiumBadge color={badgeColor}>
            {mainCategory.replace(/^[^s]+s/, '')}
          </PremiumBadge>
          <time className="text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <AppIcon name="calendar" size={13} />
            {post.date}
          </time>
        </div>
        <div className="space-y-2">
          <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-gray-900 dark:text-white leading-snug break-keep line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed line-clamp-2 break-keep font-normal">
            {post.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full text-xs sm:text-[12.5px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 bg-gray-50/90 dark:bg-white/5 border border-gray-100 dark:border-zinc-800/80 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 relative z-10">
        <div className="flex items-center gap-2">
          <span>글 읽기</span>
        </div>
        <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
