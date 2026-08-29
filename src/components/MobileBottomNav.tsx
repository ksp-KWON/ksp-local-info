'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Home, Coins, Briefcase, Ambulance, Menu, X } from 'lucide-react';
import { CATEGORIES, getCategoryTheme } from '@/lib/constants';
import BottomSheet from '@/components/ui/BottomSheet';

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
      icon: <Home className="w-5 h-5 mb-1" strokeWidth={pathname === '/' && !categoryParam ? 2.5 : 2} />,
    },
    {
      id: 'benefits',
      label: '지원금',
      href: `/blog?category=${encodeURIComponent('💸 숨은 지원금 찾기')}`,
      isActive: categoryParam === '💸 숨은 지원금 찾기',
      icon: <Coins className="w-5 h-5 mb-1" strokeWidth={categoryParam === '💸 숨은 지원금 찾기' ? 2.5 : 2} />,
    },
    {
      id: 'jobs',
      label: '취업·창업',
      href: `/blog?category=${encodeURIComponent('💼 취업과 창업')}`,
      isActive: categoryParam === '💼 취업과 창업',
      icon: <Briefcase className="w-5 h-5 mb-1" strokeWidth={categoryParam === '💼 취업과 창업' ? 2.5 : 2} />,
    },
    {
      id: 'emergency',
      label: '응급·약국',
      href: '/services/emergency',
      isActive: pathname === '/services/emergency',
      icon: <Ambulance className="w-5 h-5 mb-1" strokeWidth={pathname === '/services/emergency' ? 2.5 : 2} />,
    },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/90 dark:bg-[#181a1d]/90 backdrop-blur-md shadow-lg border-t border-gray-200/80 dark:border-zinc-800 flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              item.isActive
                ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span className={`text-[10.5px] ${item.isActive ? 'font-extrabold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 cursor-pointer ${
            isMenuOpen
              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {isMenuOpen ? <X className="w-5 h-5 mb-1" strokeWidth={2.5} /> : <Menu className="w-5 h-5 mb-1" strokeWidth={2} />}
          <span className={`text-[10.5px] ${isMenuOpen ? 'font-extrabold' : 'font-medium'}`}>전체메뉴</span>
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
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">의정부 생활정보 전체 카테고리</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            {[
              {
                title: '💰 혜택 & 일자리',
                items: CATEGORIES.filter((c) => c.label.includes('지원금') || c.label.includes('취업')),
              },
              {
                title: '👨‍👩‍👧 가족 & 건강',
                items: CATEGORIES.filter((c) => c.label.includes('아이') || c.label.includes('아플 때')),
              },
              {
                title: '☕ 생활 & 즐길거리',
                items: CATEGORIES.filter(
                  (c) =>
                    !c.label.includes('지원금') &&
                    !c.label.includes('취업') &&
                    !c.label.includes('아이') &&
                    !c.label.includes('아플 때')
                ),
              },
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-gray-400 dark:text-gray-500 text-xs mb-2.5 pl-1">{group.title}</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {group.items.map((cat) => {
                    const theme = getCategoryTheme(cat.label);
                    const Icon = theme.icon;
                    const colorMap: Record<string, string> = {
                      blue: 'text-blue-500',
                      pink: 'text-rose-500',
                      yellow: 'text-amber-500',
                      green: 'text-emerald-500',
                      red: 'text-red-500',
                      purple: 'text-purple-500',
                      orange: 'text-orange-500',
                      cyan: 'text-cyan-500',
                    };
                    return (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${encodeURIComponent(cat.label)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#181a1d] rounded-none border border-gray-200/80 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${colorMap[theme.color] || 'text-gray-500'}`} strokeWidth={2} />
                        <span className="font-bold text-xs tracking-tight truncate text-gray-800 dark:text-gray-200">
                          {cat.label.replace(/^[^\s]+\s/, '')}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Link
              href="/services/local-currency"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-none bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
            >
              💳 사랑카드 가맹점
            </Link>
            <Link
              href="/services/health-check"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-none bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 font-bold text-xs"
            >
              🏥 건강검진 지정병원
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
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/90 dark:bg-[#181a1d]/90 backdrop-blur-md border-t border-gray-200/80 dark:border-zinc-800 z-[100]"></div>
      }
    >
      <NavContent />
    </Suspense>
  );
}
