import Link from 'next/link';
import { Calendar } from 'lucide-react';
import NeoBox from '@/components/ui/NeoBox';
import NeoBadge from '@/components/ui/NeoBadge';
import { PostData } from '@/lib/types';
import { getCategoryTheme } from '@/lib/constants';

interface PostCardProps {
  post: PostData;
  variant?: 'grid' | 'list';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoryLabel = post.category || '정보';
  const theme = getCategoryTheme(categoryLabel);

  if (variant === 'list') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex flex-col min-h-[160px]">
        <NeoBox shadowColor={theme.color} hoverEffect className="!p-4 sm:!p-5 h-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
              <NeoBadge color="gray">{categoryLabel}</NeoBadge>
              <time className="text-[11px] font-jua font-normal text-black dark:text-white flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5" strokeWidth={3} />
                {post.date}
              </time>
            </div>
            <div className="min-w-0 space-y-2 mt-2">
              <h3 className="text-lg sm:text-xl font-dohyeon font-normal tracking-wide text-black dark:text-white transition-colors line-clamp-1 leading-snug group-hover:underline">
                <span className={`highlighter-${theme.color}`}>{post.title}</span>
              </h3>
              <p className="text-[13px] sm:text-[14px] font-jua font-normal text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed break-keep">
                {post.summary}
              </p>
            </div>
          </div>
          
          <div className="sm:shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t-2 sm:border-t-0 sm:border-l-2 border-black dark:border-white sm:pl-5 flex items-center justify-end">
            <span className="text-sm font-dohyeon tracking-wide text-black dark:text-white group-hover:underline transition-colors flex items-center gap-1">
              자세히 보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </NeoBox>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col min-h-[160px]">
      <NeoBox shadowColor={theme.color} hoverEffect className="!p-4 sm:!p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <NeoBadge color="gray">{categoryLabel}</NeoBadge>
          <time className="text-[11px] font-jua font-normal text-black dark:text-white flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" strokeWidth={3} />
            {post.date}
          </time>
        </div>
        <div className="min-w-0 flex-1 space-y-2 mt-2">
          <h3 className="text-lg sm:text-xl font-dohyeon font-normal tracking-wide text-black dark:text-white transition-colors line-clamp-2 leading-snug break-keep group-hover:underline">
            <span className={`highlighter-${theme.color}`}>{post.title}</span>
          </h3>
          <p className="text-[13px] sm:text-[14px] font-jua font-normal text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed break-keep">
            {post.summary}
          </p>
        </div>
      </NeoBox>
    </Link>
  );
}
