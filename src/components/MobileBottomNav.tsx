'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useState } from 'react';
import { Home, Coins, Briefcase, Ambulance, Menu, X } from 'lucide-react';
import { CATEGORIES, getCategoryTheme } from '@/lib/constants';
import BottomSheet from '@/components/ui/BottomSheet';

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: '홈',
      href: '/',
      isActive: pathname === '/' && !category,
      icon: <Home className="w-6 h-6 mb-1" strokeWidth={pathname === '/' && !category ? 3 : 2} />
    },
    {
      id: 'benefits',
      label: '숨은 지원금',
      href: '/blog?category=💸 숨은 지원금 찾기',
      isActive: category === '💸 숨은 지원금 찾기',
      icon: <Coins className="w-6 h-6 mb-1" strokeWidth={category === '💸 숨은 지원금 찾기' ? 3 : 2} />
    },
    {
      id: 'jobs',
      label: '취업·창업',
      href: '/blog?category=💼 취업과 창업',
      isActive: category === '💼 취업과 창업',
      icon: <Briefcase className="w-6 h-6 mb-1" strokeWidth={category === '💼 취업과 창업' ? 3 : 2} />
    },
    {
      id: 'emergency',
      label: '응급·약국',
      href: '/services/emergency',
      isActive: pathname === '/services/emergency',
      icon: <Ambulance className="w-6 h-6 mb-1" strokeWidth={pathname === '/services/emergency' ? 3 : 2} />
    }
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white/85 dark:bg-[#1a1c20]/85 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)] border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              item.isActive
                ? 'text-black dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] font-black ${item.isActive ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </Link>
        ))}
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
            isMenuOpen
              ? 'text-black dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 mb-1" strokeWidth={3} />
          ) : (
            <Menu className="w-6 h-6 mb-1" strokeWidth={2} />
          )}
          <span className={`text-[10px] font-black ${isMenuOpen ? 'opacity-100' : 'opacity-80'}`}>
            전체메뉴
          </span>
        </button>
      </nav>

      {/* 전체 메뉴 팝업 */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        showBackdrop={true}
        bottomOffset="bottom-[64px]"
        padding="p-4 sm:p-6 pb-8"
        maxHeight="max-h-[85vh]"
      >
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-dohyeon">전체 카테고리</h3>
            <button onClick={() => setIsMenuOpen(false)} className="p-1 border-2 border-transparent hover:border-black dark:hover:border-white rounded-none-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {[
              {
                title: '💰 혜택 & 일자리',
                items: CATEGORIES.filter(c => c.label.includes('지원금') || c.label.includes('취업'))
              },
              {
                title: '👨‍👩‍👧 가족 & 건강',
                items: CATEGORIES.filter(c => c.label.includes('아이') || c.label.includes('아플 때'))
              },
              {
                title: '☕ 생활 & 즐길거리',
                items: CATEGORIES.filter(c => !c.label.includes('지원금') && !c.label.includes('취업') && !c.label.includes('아이') && !c.label.includes('아플 때'))
              }
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-gray-500 dark:text-gray-400 text-xs mb-3 pl-1">{group.title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {group.items.map((cat) => {
                    const theme = getCategoryTheme(cat.label);
                    const Icon = theme.icon;
                    const colorMap: Record<string, string> = {
                      blue: 'text-blue-500', pink: 'text-pink-500', yellow: 'text-yellow-500',
                      green: 'text-green-500', red: 'text-red-500', purple: 'text-purple-500',
                      orange: 'text-orange-500', cyan: 'text-cyan-500'
                    };
                    return (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${encodeURIComponent(cat.label)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-[#1a1c20] rounded-none-none border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${colorMap[theme.color] || 'text-gray-500'}`} strokeWidth={2} />
                        <span className="font-bold text-[13px] tracking-tight truncate text-gray-800 dark:text-gray-200">{cat.label.replace(/^[^\s]+\s/, '')}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/services/local-currency"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-none-none bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200"
            >
              <span className="font-bold text-sm tracking-tight truncate">💳 사랑카드 가맹점</span>
            </Link>
            <Link
              href="/services/health-check"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-none-none bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200"
            >
              <span className="font-bold text-sm tracking-tight truncate">🏥 무료 건강검진</span>
            </Link>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense fallback={<div className="lg:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 z-[100]"></div>}>
      <NavContent />
    </Suspense>
  );
}
