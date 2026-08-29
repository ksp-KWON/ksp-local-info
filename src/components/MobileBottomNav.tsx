'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Home, Coins, Briefcase, Ambulance, Menu, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import BottomSheet from '@/components/ui/BottomSheet';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

function getCategoryWatermark(label: string): AppIconName {
  if (label.includes('지원금') || label.includes('혜택')) return 'bank';
  if (label.includes('취업') || label.includes('창업')) return 'trending-up';
  if (label.includes('아이') || label.includes('가족')) return 'heart';
  if (label.includes('병원') || label.includes('아플 때')) return 'hospital';
  if (label.includes('생활') || label.includes('즐길거리')) return 'leaf';
  return 'file-text';
}

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
      icon: <Home className="w-5 h-5 mb-1 stroke-[2.5]" />,
    },
    {
      id: 'benefits',
      label: '지원금',
      href: `/blog?category=${encodeURIComponent('💸 숨은 지원금 찾기')}`,
      isActive: categoryParam === '💸 숨은 지원금 찾기',
      icon: <Coins className="w-5 h-5 mb-1 stroke-[2.5]" />,
    },
    {
      id: 'jobs',
      label: '취업·창업',
      href: `/blog?category=${encodeURIComponent('💼 취업과 창업')}`,
      isActive: categoryParam === '💼 취업과 창업',
      icon: <Briefcase className="w-5 h-5 mb-1 stroke-[2.5]" />,
    },
    {
      id: 'emergency',
      label: '응급·약국',
      href: '/services/emergency',
      isActive: pathname === '/services/emergency',
      icon: <Ambulance className="w-5 h-5 mb-1 stroke-[2.5]" />,
    },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/95 dark:bg-[#181a1d]/95 backdrop-blur-md border-t-2 border-black dark:border-white flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              item.isActive
                ? 'text-black dark:text-white font-black'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span className={`text-[10.5px] ${item.isActive ? 'font-black' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-all cursor-pointer ${
            isMenuOpen
              ? 'text-black dark:text-white font-black'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
          }`}
        >
          {isMenuOpen ? <X className="w-5 h-5 mb-1 stroke-[2.5]" /> : <Menu className="w-5 h-5 mb-1 stroke-[2.5]" />}
          <span className={`text-[10.5px] ${isMenuOpen ? 'font-black' : 'font-medium'}`}>전체메뉴</span>
        </button>
      </nav>

      {/* 전체 메뉴 바텀시트 (모던 수묵 & 굵은 라인 SVG 스타일) */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        showBackdrop={true}
        bottomOffset="bottom-[60px]"
        padding="p-4 sm:p-6 pb-8"
        maxHeight="max-h-[85vh]"
      >
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-black dark:border-white">
            <h3 className="text-base font-black text-black dark:text-white flex items-center gap-2">
              <AppIcon name="compass" size={18} strokeWidth={2.5} />
              <span>의정부 생활정보 전체 카테고리</span>
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-5">
            {[
              {
                title: '혜택 & 일자리',
                items: CATEGORIES.filter((c) => c.label.includes('지원금') || c.label.includes('취업')),
              },
              {
                title: '가족 & 건강',
                items: CATEGORIES.filter((c) => c.label.includes('아이') || c.label.includes('아플 때')),
              },
              {
                title: '생활 & 즐길거리',
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
                <h4 className="font-black text-zinc-400 dark:text-zinc-500 text-xs mb-2.5 pl-1">{group.title}</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {group.items.map((cat) => {
                    const theme = cat.label;
                    const watermark = getCategoryWatermark(theme);
                    return (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${encodeURIComponent(cat.label)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="relative overflow-hidden flex items-center gap-2 p-3 bg-white dark:bg-[#181a1d] rounded-none border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all group"
                      >
                        {/* 은은한 굵은 라인 SVG 수묵 워터마크 */}
                        <div className="absolute right-1 bottom-0 opacity-[0.045] dark:opacity-[0.07] text-black dark:text-white select-none pointer-events-none group-hover:scale-110 transition-transform duration-300 z-0">
                          <AppIcon name={watermark} size={44} strokeWidth={2} />
                        </div>

                        <span className="font-black text-xs tracking-tight truncate text-black dark:text-white relative z-10">
                          {cat.label.replace(/^[^\s]+\s/, '')}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 주요 3대 공공서비스 퀵링크 바 (모노톤 굵은 선 룩) */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t-2 border-zinc-200 dark:border-zinc-800">
            <Link
              href="/services/local-currency"
              onClick={() => setIsMenuOpen(false)}
              className="relative overflow-hidden flex items-center justify-center gap-1.5 p-3 rounded-none bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-black dark:text-white font-black text-xs group"
            >
              <div className="absolute -right-1 -bottom-1 opacity-[0.07] text-black dark:text-white pointer-events-none group-hover:scale-110 transition-transform">
                <AppIcon name="bank" size={42} strokeWidth={2} />
              </div>
              <AppIcon name="bank" size={14} strokeWidth={2.5} className="relative z-10" />
              <span className="relative z-10">사랑카드 가맹점</span>
            </Link>

            <Link
              href="/services/health-check"
              onClick={() => setIsMenuOpen(false)}
              className="relative overflow-hidden flex items-center justify-center gap-1.5 p-3 rounded-none bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-black dark:text-white font-black text-xs group"
            >
              <div className="absolute -right-1 -bottom-1 opacity-[0.07] text-black dark:text-white pointer-events-none group-hover:scale-110 transition-transform">
                <AppIcon name="stethoscope" size={42} strokeWidth={2} />
              </div>
              <AppIcon name="stethoscope" size={14} strokeWidth={2.5} className="relative z-10" />
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
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white/95 dark:bg-[#181a1d]/95 backdrop-blur-md border-t-2 border-black dark:border-white z-[100]"></div>
      }
    >
      <NavContent />
    </Suspense>
  );
}
