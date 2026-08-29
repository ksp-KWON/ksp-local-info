import Link from 'next/link';
import { PostData } from '@/lib/types';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

interface PostCardProps {
  post: PostData;
  variant?: 'grid' | 'list';
}

function getWatermarkIcon(category: string): AppIconName {
  if (category.includes('지원금') || category.includes('혜택') || category.includes('복지')) return 'bank';
  if (category.includes('취업') || category.includes('창업') || category.includes('일자리')) return 'trending-up';
  if (category.includes('아이') || category.includes('임산부') || category.includes('가족') || category.includes('출산')) return 'heart';
  if (category.includes('병원') || category.includes('약국') || category.includes('의료') || category.includes('아플 때')) return 'hospital';
  if (category.includes('생활') || category.includes('문화') || category.includes('행사') || category.includes('축제')) return 'leaf';
  return 'file-text';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoriesToDisplay = Array.isArray(post.category) ? post.category : post.category ? [post.category] : [];
  const mainCategory = categoriesToDisplay[0] || '생활·민원';
  const watermarkIcon = getWatermarkIcon(mainCategory);

  if (variant === 'list') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full">
        <div className="bg-white dark:bg-[#181a1d] rounded-none p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full relative overflow-hidden">
          {/* 은은한 굵은 라인 SVG 수묵 워터마크 */}
          <div className="absolute right-2 bottom-1 opacity-[0.045] dark:opacity-[0.07] text-black dark:text-white select-none pointer-events-none group-hover:scale-105 transition-all duration-300 z-0">
            <AppIcon name={watermarkIcon} size={68} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0 z-10 relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {categoriesToDisplay.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 rounded-none text-xs font-bold tracking-tight bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700"
                >
                  {cat.replace(/^[^\s]+\s/, '')}
                </span>
              ))}
              <time className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 ml-2">
                <AppIcon name="calendar" size={13} strokeWidth={2} />
                <span>{post.date}</span>
              </time>
            </div>
            <div className="min-w-0 space-y-1.5 mt-1">
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-black dark:text-white group-hover:underline transition-all line-clamp-1 leading-snug break-keep">
                {post.title}
              </h3>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed break-keep">
                {post.summary}
              </p>
            </div>
          </div>

          <div className="sm:shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 sm:border-t-0 sm:border-l-2 sm:pl-6 flex items-center justify-end z-10 relative">
            <span className="text-xs font-black tracking-wide text-black dark:text-white flex items-center gap-1">
              <span>자세히 보기</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full h-full">
      <div className="bg-white dark:bg-[#181a1d] rounded-none p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 flex flex-col justify-between h-full relative overflow-hidden">
        {/* 은은한 굵은 라인 SVG 수묵 워터마크 */}
        <div className="absolute right-2 bottom-1 opacity-[0.045] dark:opacity-[0.07] text-black dark:text-white select-none pointer-events-none group-hover:scale-105 transition-all duration-300 z-0">
          <AppIcon name={watermarkIcon} size={68} strokeWidth={2} />
        </div>

        <div className="z-10 relative">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            {categoriesToDisplay.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 rounded-none text-xs font-bold tracking-tight bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700"
              >
                {cat.replace(/^[^\s]+\s/, '')}
              </span>
            ))}
            <time className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 ml-auto">
              <AppIcon name="calendar" size={13} strokeWidth={2} />
              <span>{post.date}</span>
            </time>
          </div>
          <div className="min-w-0 space-y-1.5 mt-2 mb-4">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-black dark:text-white group-hover:underline transition-all line-clamp-2 leading-snug break-keep">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed break-keep">
              {post.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end pt-2 border-t-2 border-zinc-100 dark:border-zinc-800/80 z-10 relative">
          <span className="text-xs font-black text-black dark:text-white flex items-center gap-1 transition-colors">
            <span>상세 안내</span>
            <AppIcon name="chevron-right" size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
