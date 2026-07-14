'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Home, HandHeart, PartyPopper, Stethoscope, Ambulance } from 'lucide-react';

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

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
      label: '복지·지원',
      href: '/blog?category=혜택',
      isActive: category === '혜택',
      icon: <HandHeart className="w-6 h-6 mb-1" strokeWidth={category === '혜택' ? 3 : 2} />
    },
    {
      id: 'events',
      label: '행사·축제',
      href: '/blog?category=행사',
      isActive: category === '행사',
      icon: <PartyPopper className="w-6 h-6 mb-1" strokeWidth={category === '행사' ? 3 : 2} />
    },
    {
      id: 'medical',
      label: '건강·의료',
      href: '/blog?category=의료',
      isActive: category === '의료',
      icon: <Stethoscope className="w-6 h-6 mb-1" strokeWidth={category === '의료' ? 3 : 2} />
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
    <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white dark:bg-[#121417] border-t-2 border-black dark:border-white flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
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
    </nav>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense fallback={<div className="lg:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 z-[100]"></div>}>
      <NavContent />
    </Suspense>
  );
}
