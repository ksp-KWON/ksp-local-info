import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { PostData } from '@/lib/types';
import { getCategoryTheme } from '@/lib/constants';

interface PostCardProps {
  post: PostData;
  variant?: 'grid' | 'list';
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const categoriesToDisplay = Array.isArray(post.category) ? post.category : post.category ? [post.category] : [];
  const mainCategory = categoriesToDisplay[0] || '생활·민원';
  const theme = getCategoryTheme(mainCategory);

  const colorStyles: Record<string, string> = {
    green: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/25 border-emerald-200 dark:border-emerald-800/40',
    pink: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/25 border-rose-200 dark:border-rose-800/40',
    yellow: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/25 border-amber-200 dark:border-amber-800/40',
    blue: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/25 border-blue-200 dark:border-blue-800/40',
    red: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/25 border-red-200 dark:border-red-800/40',
    orange: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/25 border-orange-200 dark:border-orange-800/40',
    cyan: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/25 border-cyan-200 dark:border-cyan-800/40',
    purple: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/25 border-purple-200 dark:border-purple-800/40',
  };

  const currentStyle = colorStyles[theme.color] || colorStyles.blue;

  if (variant === 'list') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full">
        <div className="bg-white dark:bg-[#181a1d] rounded-none p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full relative overflow-hidden">
          <div className="flex-1 min-w-0 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {categoriesToDisplay.map((cat) => (
                <span
                  key={cat}
                  className={`px-2.5 py-0.5 rounded-none text-xs font-bold tracking-tight border ${currentStyle}`}
                >
                  {cat.replace(/^[^\s]+\s/, '')}
                </span>
              ))}
              <time className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0 ml-2">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </time>
            </div>
            <div className="min-w-0 space-y-1.5 mt-1">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug break-keep">
                {post.title}
              </h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed break-keep">
                {post.summary}
              </p>
            </div>
          </div>

          <div className="sm:shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 dark:border-zinc-800 sm:border-t-0 sm:border-l sm:pl-6 flex items-center justify-end z-10">
            <span className="text-xs font-bold tracking-wide text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              자세히 보기
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col w-full h-full">
      <div className="bg-white dark:bg-[#181a1d] rounded-none p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/80 dark:border-zinc-800 flex flex-col justify-between h-full relative overflow-hidden hover:-translate-y-1">
        <div className="z-10">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            {categoriesToDisplay.map((cat) => (
              <span
                key={cat}
                className={`px-2.5 py-0.5 rounded-none text-xs font-bold tracking-tight border ${currentStyle}`}
              >
                {cat.replace(/^[^\s]+\s/, '')}
              </span>
            ))}
            <time className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </time>
          </div>
          <div className="min-w-0 space-y-1.5 mt-2 mb-4">
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug break-keep">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed break-keep">
              {post.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-zinc-800/60">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1 transition-colors">
            상세 안내 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
