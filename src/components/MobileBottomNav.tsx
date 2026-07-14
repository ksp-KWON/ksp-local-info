'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ModalType = 'none' | 'home' | 'partner' | 'calculator' | 'hospital' | 'consult';

export default function MobileBottomNav() {
  const [openModal, setOpenModal] = useState<ModalType>('none');

  const closeModals = () => setOpenModal('none');

  // 모달 활성화 시 배경 스크롤 방지
  useEffect(() => {
    if (openModal !== 'none') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openModal]);

  const navItems = [
    {
      id: 'home',
      label: '홈',
      onClick: () => setOpenModal(openModal === 'home' ? 'none' : 'home'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'home' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      isActive: openModal === 'home'
    },
    {
      id: 'partner',
      label: '생활·민원',
      onClick: () => setOpenModal(openModal === 'partner' ? 'none' : 'partner'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'partner' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      isActive: openModal === 'partner'
    },
    {
      id: 'calculator',
      label: '복지·지원',
      onClick: () => setOpenModal(openModal === 'calculator' ? 'none' : 'calculator'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'calculator' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
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
      isActive: openModal === 'calculator'
    },
    {
      id: 'hospital',
      label: '의료·건강',
      onClick: () => setOpenModal(openModal === 'hospital' ? 'none' : 'hospital'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'hospital' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 22V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
          <line x1="12" y1="10" x2="12" y2="14"></line>
          <line x1="10" y1="12" x2="14" y2="12"></line>
          <line x1="3" y1="22" x2="21" y2="22"></line>
        </svg>
      ),
      isActive: openModal === 'hospital'
    },
    {
      id: 'consult',
      label: '시청·안내',
      onClick: () => setOpenModal(openModal === 'consult' ? 'none' : 'consult'),
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={openModal === 'consult' ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      isActive: openModal === 'consult'
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

      {/* 1. 홈 팝업 */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'home' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'home' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">전체 메뉴</h3>
          
          <Link href="/" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#0090D6] hover:shadow-[0_8px_30px_rgba(0,144,214,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors">홈</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">의정부 생활 포털 메인 화면</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="/blog" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#0090D6] hover:shadow-[0_8px_30px_rgba(0,144,214,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors">소식 및 행사</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">의정부시 지역 행사와 새소식</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 2. 생활·민원 팝업 (Partner 아이콘) */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'partner' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'partner' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">생활·민원</h3>
          
          <Link href="/services/local-currency" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#0090D6] hover:shadow-[0_8px_30px_rgba(0,144,214,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              💳
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors">의정부 사랑카드 가맹점 지도</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">내 주변 결제 가능 매장 실시간 찾기</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="/blog?tag=민원안내" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-red-500 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              🏛️
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-red-500 transition-colors">주요 민원 안내</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">전입신고 등 필수 행정 서비스</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 3. 복지·지원 팝업 (Calculator 아이콘) */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'calculator' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'calculator' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">복지·지원 혜택</h3>
          
          <Link href="/blog?category=혜택" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#0090D6] hover:shadow-[0_8px_30px_rgba(0,144,214,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              🏠
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors">청년·신혼 주거지원</h2>
              <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[12px] mt-0.5">안심 주거 복지 정책 안내</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 4. 의료·건강 팝업 (Hospital 아이콘) */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'hospital' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'hospital' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">의료·건강</h3>
          
          <Link href="/services/health-check" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[var(--google-yellow)] hover:shadow-[0_8px_30px_rgba(251,188,4,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              🩺
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[var(--google-yellow)] transition-colors">무료 건강검진 및 병원</h2>
              <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[12px] mt-0.5">올해 대상자 조회 및 지정 우수병원</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--google-yellow)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* 5. 시청·안내 팝업 (Consult 아이콘) */}
      <div 
        className={`lg:hidden fixed bottom-[64px] left-0 w-full bg-white dark:bg-[#202124] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[95] transition-transform duration-300 transform ${openModal === 'consult' ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ touchAction: openModal === 'consult' ? 'auto' : 'none' }}
      >
        <div className="p-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto overscroll-contain">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 className="font-bold text-lg text-[#202124] dark:text-white mb-4">시청·안내</h3>
          
          <Link href="/about" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#9c27b0] hover:shadow-[0_8px_30px_rgba(156,39,176,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              🏢
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#9c27b0] transition-colors">플랫폼 소개</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">의정부 지역포털 소개</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#9c27b0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </Link>

          <Link href="https://www.ui4u.go.kr/" target="_blank" onClick={closeModals} className="group flex items-center bg-gray-50 dark:bg-[#2d2e30] rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-[#0090D6] hover:shadow-[0_8px_30px_rgba(0,144,214,0.15)] transition-all duration-300 gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#3a3b3d] rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 text-xl">
              🌐
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors">의정부시청 홈페이지</h2>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">공식 홈페이지 이동</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0090D6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
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
                ? 'text-[#0090D6] dark:text-[#0090D6]'
                : 'text-gray-900 dark:text-gray-200 hover:text-[#0090D6] dark:hover:text-[#0090D6]'
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
