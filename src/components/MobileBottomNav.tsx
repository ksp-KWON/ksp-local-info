'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ModalType = 'none' | 'living' | 'welfare' | 'cityhall';

export default function MobileBottomNav() {
  const [openModal, setOpenModal] = useState<ModalType>('none');

  const closeModals = () => setOpenModal('none');

  // 모달 활성화 시 배경 스크롤 방지
  useEffect(() => {
    if (openModal !== 'none') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // iOS Safari 대응
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [openModal]);

  const navItems = [
    {
      id: 'home',
      label: '홈',
      onClick: () => { window.location.href = '/'; },
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      isActive: false
    },
    {
      id: 'blog',
      label: '소식·행사',
      onClick: () => { window.location.href = '/blog'; },
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M3 15h6"></path>
          <path d="M3 19h6"></path>
          <path d="M10 15h8"></path>
          <path d="M10 19h8"></path>
        </svg>
      ),
      isActive: false
    },
    {
      id: 'living',
      label: '생활·민원',
      onClick: () => setOpenModal(openModal === 'living' ? 'none' : 'living'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'living' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 22V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
          <line x1="12" y1="10" x2="12" y2="14"></line>
          <line x1="10" y1="12" x2="14" y2="12"></line>
          <line x1="3" y1="22" x2="21" y2="22"></line>
        </svg>
      ),
      isActive: openModal === 'living'
    },
    {
      id: 'welfare',
      label: '복지·혜택',
      onClick: () => setOpenModal(openModal === 'welfare' ? 'none' : 'welfare'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'welfare' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="16" y1="14" x2="16.01" y2="14"></line>
          <line x1="12" y1="14" x2="12.01" y2="14"></line>
          <line x1="8" y1="14" x2="8.01" y2="14"></line>
          <line x1="16" y1="18" x2="16.01" y2="18"></line>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
          <line x1="8" y1="18" x2="8.01" y2="18"></line>
          <line x1="16" y1="10" x2="16.01" y2="10"></line>
          <line x1="12" y1="10" x2="12.01" y2="10"></line>
          <line x1="8" y1="10" x2="8.01" y2="10"></line>
        </svg>
      ),
      isActive: openModal === 'welfare'
    },
    {
      id: 'cityhall',
      label: '시청안내',
      onClick: () => setOpenModal(openModal === 'cityhall' ? 'none' : 'cityhall'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'cityhall' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      isActive: openModal === 'cityhall'
    }
  ];

  return (
    <>
      {/* 팝업 모달 백그라운드 오버레이 */}
      {openModal !== 'none' && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-[90] animate-in fade-in duration-200"
          onClick={closeModals}
          onTouchMove={(e) => e.preventDefault()}
        ></div>
      )}

      {/* 1. 생활·민원 팝업 */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'living' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'living' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">생활·민원</h3>
          
          <Link href="/blog?tag=의정부사랑카드" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[var(--google-blue)] hover:shadow-[0_8px_30px_rgba(26,115,232,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">💳</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[var(--google-blue)] transition-colors">의정부 사랑카드</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">지역화폐 인센티브 혜택 안내</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--google-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="/blog?tag=민원안내" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-red-500 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">🏛️</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-red-500 transition-colors">주요 민원 안내</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">전입신고 등 필수 행정 서비스</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 2. 복지·혜택 팝업 */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'welfare' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'welfare' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">복지·혜택</h3>
          
          <Link href="/blog?category=혜택" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#137333] hover:shadow-[0_8px_30px_rgba(19,115,51,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">🏠</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#137333] transition-colors">청년·신혼 주거지원</h2>
              <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[12px] mt-0.5">안심 주거 복지 정책 안내</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#137333] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="/blog?category=의료" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[var(--google-yellow)] hover:shadow-[0_8px_30px_rgba(251,188,4,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">🩺</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[var(--google-yellow)] transition-colors">무료 건강검진</h2>
              <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[12px] mt-0.5">지정 우수 검진기관 정보</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--google-yellow)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 3. 시청안내 팝업 */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'cityhall' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'cityhall' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">시청 안내</h3>
          
          <Link href="/about" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#9c27b0] hover:shadow-[0_8px_30px_rgba(156,39,176,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">🏢</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#9c27b0] transition-colors">플랫폼 소개</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">의정부 지역포털 소개</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#9c27b0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="https://www.ui4u.go.kr/" target="_blank" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[var(--google-blue)] hover:shadow-[0_8px_30px_rgba(26,115,232,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">🌐</div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[var(--google-blue)] transition-colors">의정부시청 홈페이지</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">공식 홈페이지 이동</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--google-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 5개의 탭 버튼 바 */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[64px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 flex items-center justify-around px-1 z-[100] pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              item.isActive
                ? 'text-[var(--google-blue)] dark:text-[#8ab4f8]'
                : 'text-gray-900 dark:text-gray-200 hover:text-[var(--google-blue)] dark:hover:text-[#8ab4f8]'
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
