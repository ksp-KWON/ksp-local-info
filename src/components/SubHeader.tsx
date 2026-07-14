'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubHeaderProps {
  tags?: string[];
}

export default function SubHeader({ tags = [] }: SubHeaderProps) {
  const pathname = usePathname();
  const visibleTags = tags.slice(0, 6); // 상단 가로 스크롤에 보여줄 태그 수

  return (
    <div className="w-full bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-white/5 sticky top-[64px] z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto w-full sm:w-[92vw] xl:w-[85vw] px-2 sm:px-5">
        <div className="flex items-center h-14 overflow-x-auto no-scrollbar gap-3 sm:gap-6 whitespace-nowrap">
          
          {/* 주요 퀵 메뉴 */}
          <Link href="/services/local-currency" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#0090D6] dark:hover:text-[#0090D6] transition-colors group">
            <span className="text-base group-hover:scale-110 transition-transform">💳</span>
            지역화폐 가맹점
          </Link>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 shrink-0"></div>

          <Link href="/services/emergency" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
            <span className="text-base group-hover:scale-110 transition-transform">🚨</span>
            야간/휴일 병원·약국
          </Link>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 shrink-0"></div>

          <Link href="/services/health-check" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[var(--google-yellow)] transition-colors group">
            <span className="text-base group-hover:scale-110 transition-transform">🩺</span>
            무료 건강검진
          </Link>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 shrink-0 hidden sm:block"></div>

          <Link href="/blog?category=혜택" className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#137333] transition-colors group">
            <span className="text-base group-hover:scale-110 transition-transform">🏠</span>
            청년·신혼 주거지원
          </Link>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 shrink-0"></div>

          {/* 인기 태그 영역 */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">HOT</span>
            {visibleTags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog?tag=${tag}`}
                className="px-2.5 py-1 text-[11px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-[#0090D6]/10 hover:text-[#0090D6] hover:border-[#0090D6]/30 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
