'use client';

import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';

export type UijeongbuAdminTab = 'hospitals' | 'events' | 'benefits' | 'posts' | 'settings';

type ModalType = 'none' | 'more';

interface MobileAdminNavProps {
  activeTab: UijeongbuAdminTab;
  setActiveTab: (tab: UijeongbuAdminTab) => void;
  onLogout?: () => void;
}

export default function MobileAdminNav({ activeTab, setActiveTab, onLogout }: MobileAdminNavProps) {
  const [openModal, setOpenModal] = useState<ModalType>('none');

  const closeModals = () => {
    setOpenModal('none');
  };

  const handleNavClick = (id: 'hospitals' | 'events' | 'benefits' | 'more') => {
    if (id === 'more') {
      if (openModal === 'more') closeModals();
      else setOpenModal('more');
      return;
    }
    setActiveTab(id);
    closeModals();
  };

  const navItems = [
    {
      id: 'hospitals',
      label: '병원',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeTab === 'hospitals' ? "2" : "1.5"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      ),
      isActive: activeTab === 'hospitals'
    },
    {
      id: 'events',
      label: '행사',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeTab === 'events' ? "2" : "1.5"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
        </svg>
      ),
      isActive: activeTab === 'events'
    },
    {
      id: 'benefits',
      label: '혜택',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeTab === 'benefits' ? "2" : "1.5"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
        </svg>
      ),
      isActive: activeTab === 'benefits'
    },
    {
      id: 'more',
      label: '더보기',
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'more' || activeTab === 'posts' || activeTab === 'settings' ? "2" : "1.5"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      ),
      isActive: openModal === 'more' || activeTab === 'posts' || activeTab === 'settings'
    }
  ];

  return (
    <>
      <BottomSheet isOpen={openModal === 'more'} onClose={closeModals} showBackdrop={true}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white px-1 mb-4">추가 메뉴</h3>
        
        <button onClick={() => { setActiveTab('posts'); closeModals(); }} className={`w-full flex items-center gap-3 p-4 border rounded-none-none transition-colors mb-3 ${activeTab === 'posts' ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100'}`}>
          <span className="text-base text-gray-900 dark:text-white font-bold">📝 블로그 포스트 관리</span>
        </button>
        
        <button onClick={() => { setActiveTab('settings'); closeModals(); }} className={`w-full flex items-center gap-3 p-4 border rounded-none-none transition-colors mb-4 ${activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100'}`}>
          <span className="text-base text-gray-900 dark:text-white font-bold">⚙️ API 및 환경 설정</span>
        </button>

        {onLogout && (
          <button onClick={() => { onLogout(); closeModals(); }} className="w-full flex items-center p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-none-none hover:bg-red-100 dark:hover:bg-red-900/20 text-left transition-colors">
            <span className="text-base text-red-600 dark:text-red-400 font-bold">🚪 로그아웃</span>
          </button>
        )}
      </BottomSheet>

      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as any)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              item.isActive
                ? 'text-[var(--google-blue,blue)] dark:text-[#8ab4f8]'
                : 'text-gray-900 dark:text-gray-200 hover:text-[var(--google-blue,blue)] dark:hover:text-[#8ab4f8]'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] font-bold ${item.isActive ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
