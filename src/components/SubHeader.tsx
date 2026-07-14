'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SubHeader() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    // Check if current path matches
    return `flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors group px-3 py-1.5 rounded-full ${
      pathname === path
        ? 'bg-[#0090D6]/10 text-[#0090D6]'
        : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#202124] dark:hover:text-[#e8eaed]'
    }`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#1e1f22] border-b border-gray-100 dark:border-white/5 sticky top-[64px] z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto w-full sm:w-[92vw] xl:w-[85vw] px-2 sm:px-5">
        <div className="flex items-center justify-between h-14">
          
          {/* 좌측: 주요 카테고리 탭 */}
          <nav className="flex items-center overflow-x-auto no-scrollbar gap-1 sm:gap-2 whitespace-nowrap pr-4">
            <Link href="/" className={getLinkClass('/')}>
              홈
            </Link>
            <Link href="/blog" className={getLinkClass('/blog')}>
              전체 소식
            </Link>
            <Link href="/blog?category=혜택" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5f6368] dark:text-[#9aa0a6] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group px-3 py-1.5 rounded-full">
              <span className="text-base group-hover:scale-110 transition-transform">💰</span>
              복지·지원금
            </Link>
            <Link href="/blog?category=행사" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5f6368] dark:text-[#9aa0a6] hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors group px-3 py-1.5 rounded-full">
              <span className="text-base group-hover:scale-110 transition-transform">🎉</span>
              행사·축제
            </Link>
            <Link href="/blog?category=의료" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5f6368] dark:text-[#9aa0a6] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#0090D6] dark:hover:text-[#00b4d8] transition-colors group px-3 py-1.5 rounded-full">
              <span className="text-base group-hover:scale-110 transition-transform">🏥</span>
              건강·의료
            </Link>
            <Link href="/blog?category=정보" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5f6368] dark:text-[#9aa0a6] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#202124] dark:hover:text-[#e8eaed] transition-colors group px-3 py-1.5 rounded-full">
              <span className="text-base group-hover:scale-110 transition-transform">💡</span>
              생활정보
            </Link>
          </nav>

          {/* 우측: 긴급 버튼 */}
          <div className="shrink-0 pl-2 sm:pl-4 border-l border-gray-100 dark:border-white/10 flex items-center">
            <Link 
              href="/services/emergency" 
              className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm transition-all"
            >
              <span className="animate-pulse">🚨</span>
              응급실/약국
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
