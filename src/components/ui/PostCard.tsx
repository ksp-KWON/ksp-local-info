import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { PostData } from '@/lib/types';
import { getCategoryTheme } from '@/lib/constants';

interface PostCardProps {
  post: PostData;
  variant?: 'grid' | 'list';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoriesToDisplay = Array.isArray(post.category) ? post.category : (post.category ? [post.category] : []);
  const mainCategory = categoriesToDisplay[0] || '생활·민원';
  const theme = getCategoryTheme(mainCategory);

  // 색상 맵핑 (프리미엄 룩)
  const colorStyles: Record<string, string> = {
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 ring-emerald-100 dark:ring-emerald-800',
    pink: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 ring-rose-100 dark:ring-rose-800',
    yellow: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 ring-amber-100 dark:ring-amber-800',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-blue-100 dark:ring-blue-800',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 ring-red-100 dark:ring-red-800',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 ring-orange-100 dark:ring-orange-800',
    cyan: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 ring-cyan-100 dark:ring-cyan-800',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 ring-purple-100 dark:ring-purple-800',
  };

  const currentStyle = colorStyles[theme.color] || colorStyles.blue;

  if (variant === 'list') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full">
        <div className="bg-white dark:bg-[#1a1c20] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full relative overflow-hidden">
          {/* 호버 시 배경 이펙트 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex-1 min-w-0 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {categoriesToDisplay.map(cat => (
                <span key={cat} className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight ring-1 ring-inset ${currentStyle}`}>
                  {cat.replace(/^[^\s]+\s/, '')} {/* 아이콘 이모지 제거 */}
                </span>
              ))}
              <time className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 shrink-0 ml-2">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </time>
            </div>
            <div className="min-w-0 space-y-2 mt-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm sm:text-[15px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed break-keep">
                {post.summary}
              </p>
            </div>
          </div>
          
          <div className="sm:shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 dark:border-gray-800 sm:border-t-0 sm:border-l sm:pl-6 flex items-center justify-end z-10">
            <span className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              자세히 보기
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full h-full">
      <div className="bg-white dark:bg-[#1a1c20] rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-between h-full relative overflow-hidden hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="z-10">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            {categoriesToDisplay.map(cat => (
              <span key={cat} className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight ring-1 ring-inset ${currentStyle}`}>
                {cat.replace(/^[^\s]+\s/, '')}
              </span>
            ))}
            <time className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 shrink-0 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </time>
          </div>
          <div className="min-w-0 space-y-2 mt-2 mb-4">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug break-keep">
              {post.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed break-keep">
              {post.summary}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
