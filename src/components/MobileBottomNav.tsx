'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { CATEGORIES } from '@/lib/constants';
import BottomSheet from '@/components/ui/BottomSheet';
import AppIcon from '@/components/ui/AppIcon';

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: '홈',
      href: '/',
      isActive: pathname === '/' && !categoryParam,
      iconName: 'home' as const,
    },
    {
      id: 'benefits',
      label: '지원금',
      href: `/blog?category=${encodeURIComponent('숨은 지원금 찾기')}`,
      isActive: categoryParam === '숨은 지원금 찾기' || categoryParam?.includes('지원금'),
      iconName: 'bank' as const,
    },
    {
      id: 'jobs',
      label: '취업·창업',
      href: `/blog?category=${encodeURIComponent('취업과 창업')}`,
      isActive: categoryParam === '취업과 창업' || categoryParam?.includes('취업'),
      iconName: 'trending-up' as const,
    },
    {
      id: 'emergency',
      label: '응급·약국',
      href: '/services/emergency',
      isActive: pathname === '/services/emergency',
      iconName: 'hospital' as const,
    },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/95 dark:bg-[#181a1d]/95 backdrop-blur-md border-t border-gray-200/90 dark:border-zinc-800 flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)] transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.40)]">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              item.isActive
                ? 'text-zinc-950 dark:text-white font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <AppIcon name={item.iconName} size={20} strokeWidth={item.isActive ? 2.5 : 2} className={`mb-0.5 ${item.isActive ? 'text-zinc-900 dark:text-white' : ''}`} />
            <span className={`text-[10.5px] ${item.isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-all cursor-pointer ${
            isMenuOpen
              ? 'text-zinc-950 dark:text-white font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <AppIcon name={isMenuOpen ? 'close' : 'menu'} size={20} strokeWidth={isMenuOpen ? 2.5 : 2} className="mb-0.5" />
          <span className={`text-[10.5px] ${isMenuOpen ? 'font-bold' : 'font-medium'}`}>전체메뉴</span>
        </button>
      </nav>

      {/* 전체 메뉴 바텀시트 */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        showBackdrop={true}
        bottomOffset="bottom-[60px]"
        padding="p-4 sm:p-6 pb-8"
        maxHeight="max-h-[85vh]"
      >
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <AppIcon name="compass" size={18} strokeWidth={2} className="text-zinc-700 dark:text-zinc-300" />
              <span>의정부 생활정보 전체 카테고리</span>
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <AppIcon name="close" size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setIsMenuOpen(false)}
                className="relative overflow-hidden flex items-center gap-2.5 p-3 bg-white dark:bg-[#181a1d] rounded-none border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group shadow-2xs"
              >
                {/* 은은한 워터마크 */}
                <div className="absolute right-1 bottom-0 opacity-[0.045] dark:opacity-[0.07] text-zinc-900 dark:text-zinc-100 select-none pointer-events-none group-hover:scale-110 transition-transform duration-300 z-0">
                  <AppIcon name={cat.watermarkIcon} size={44} strokeWidth={1.5} />
                </div>

                <AppIcon name={cat.iconName} size={15} strokeWidth={2} className="text-zinc-700 dark:text-zinc-300 relative z-10 shrink-0" />
                <span className="font-bold text-xs tracking-tight truncate text-zinc-900 dark:text-zinc-100 relative z-10">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {/* 주요 3대 공공서비스 퀵링크 바 */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Link
              href="/services/local-currency"
              onClick={() => setIsMenuOpen(false)}
              className="relative overflow-hidden flex items-center justify-center gap-1.5 p-3 rounded-none bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-600 text-sky-950 dark:text-sky-200 font-bold text-xs group transition-all"
            >
              <AppIcon name="bank" size={14} strokeWidth={2} className="relative z-10 text-sky-700 dark:text-sky-400" />
              <span className="relative z-10">사랑카드 가맹점</span>
            </Link>

            <Link
              href="/services/health-check"
              onClick={() => setIsMenuOpen(false)}
              className="relative overflow-hidden flex items-center justify-center gap-1.5 p-3 rounded-none bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 text-amber-950 dark:text-amber-200 font-bold text-xs group transition-all"
            >
              <AppIcon name="stethoscope" size={14} strokeWidth={2} className="relative z-10 text-amber-700 dark:text-amber-400" />
              <span className="relative z-10">건강검진 지정병원</span>
            </Link>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense
      fallback={
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/95 dark:bg-[#181a1d]/95 backdrop-blur-md border-t border-gray-200/90 dark:border-zinc-800 z-[100]"></div>
      }
    >
      <NavContent />
    </Suspense>
  );
}
