
'use client';

/**
 * SidebarContent.tsx
 * 사이드바 컴포넌트 (Client Component)
 *
 * [리팩토링] 태그 목록을 외부(layout.tsx)에서 props로 받아 렌더링
 * - 이전: fetch('/api/posts') → 정적 배포에서 API 없어 태그 빈칸 버그
 * - 현재: layout.tsx 서버에서 미리 계산된 tags를 props로 주입
 *         클라이언트에서 추가 네트워크 요청 없이 즉시 렌더링
 */

import Link from 'next/link';
import SidebarTagMore from './SidebarTagMore';

interface SidebarContentProps {
  tags?: string[];
}

const INITIAL_TAG_COUNT = 4;

export default function SidebarContent({ tags = [] }: SidebarContentProps) {
  const visibleTags = tags.slice(0, INITIAL_TAG_COUNT);
  const hiddenTags  = tags.slice(INITIAL_TAG_COUNT);

  return (
    <div className="space-y-6">
      {/* 💳 의정부 사랑카드 안내 */}
      <Link href="/blog?tag=의정부사랑카드" className="block group">
        <div className="bg-white dark:bg-[#1e1f22]  p-5 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(26,115,232,0.25)] hover:border-[var(--google-blue)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] dark:opacity-[0.05] text-[90px] select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">💳</div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2.5 py-1.5">
                <span className="text-[var(--google-blue)] text-lg leading-none">💳</span>
                의정부 사랑카드 혜택
              </h3>
              <span className="bg-[#e8f0fe] dark:bg-[#174ea6]/20 text-[var(--google-blue)] dark:text-[#8ab4f8] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#d2e3fc]/30 dark:border-[#174ea6]/30">인기 혜택</span>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">의정부시 지역화폐 가맹점 조회, 캐시백 인센티브 혜택 및 모바일 신청 방법을 한눈에 확인하세요.</p>
            <div className="mt-3 w-full text-[13px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-[#e8f0fe] dark:group-hover:bg-[#174ea6]/20 group-hover:text-[var(--google-blue)] dark:group-hover:text-[#8ab4f8]">
              <div className="flex items-center gap-2">
                사랑카드 혜택보기
              </div>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </Link>

      {/* 🏛️ 의정부시 주요 민원 포털 */}
      <Link href="/blog?tag=민원안내" className="block group">
        <div className="bg-white dark:bg-[#1e1f22]  p-5 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(239,68,68,0.25)] hover:border-red-500 transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] dark:opacity-[0.05] text-[90px] select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🏛️</div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2.5 py-1.5">
                <span className="text-red-500 text-lg leading-none">🏛️</span>
                의정부시 주요 민원
              </h3>
              <span className="bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-red-100/30 dark:border-red-950/30">행정 서비스</span>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">전입신고, 여권발급, 지방세 납부 등 의정부 시민들이 가장 자주 찾는 필수 행정 민원 서비스를 안내합니다.</p>
            <div className="mt-3 w-full text-[13px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-red-50 dark:group-hover:bg-red-950/20 group-hover:text-red-500 dark:group-hover:text-red-400">
              <div className="flex items-center gap-2">
                민원 서비스 바로가기
              </div>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </Link>

      {/* 🏠 청년/신혼부부 주거지원 센터 */}
      <Link href="/blog?category=혜택" className="block group">
        <div className="bg-white dark:bg-[#1e1f22]  p-5 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(19,115,51,0.25)] hover:border-[#137333] transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] dark:opacity-[0.05] text-[90px] select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🏠</div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2.5 py-1.5">
                <span className="text-[#137333] text-lg leading-none">🏠</span>
                청년·신혼 주거지원
              </h3>
              <span className="bg-green-50 dark:bg-green-950/20 text-[#137333] dark:text-[#81c995] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-green-100/30 dark:border-green-950/30">주거 복지</span>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">청년 월세 특별지원, 신혼부부 전세자금 대출 이자 지원 등 의정부시의 다양한 주거 안심 정책을 확인하세요.</p>
            <div className="mt-3 w-full text-[13px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-green-50 dark:group-hover:bg-green-950/20 group-hover:text-[#137333] dark:group-hover:text-[#81c995]">
              <div className="flex items-center gap-2">
                지원 조건 확인하기
              </div>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </Link>

      {/* 🩺 동네 무료 건강검진 예약 */}
      <Link href="/blog?category=의료" className="block group">
        <div className="bg-white dark:bg-[#1e1f22]  p-5 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(251,188,4,0.3)] hover:border-[var(--google-yellow)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] dark:opacity-[0.05] text-[90px] select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🩺</div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2.5 py-1.5">
                <span className="text-[var(--google-yellow)] text-lg leading-none">🩺</span>
                무료 건강검진 안내
              </h3>
              <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-yellow-100/30 dark:border-yellow-900/30">건강 관리</span>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">올해 국가건강검진 대상자 여부 조회 및 의정부 관내 검진 지정 우수 병원 목록을 간편하게 확인해보세요.</p>
            <div className="mt-3 w-full text-[13px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 group-hover:text-yellow-600 dark:group-hover:text-yellow-500">
              <div className="flex items-center gap-2">
                지정 병원 조회하기
              </div>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </Link>

      {/* 인기 키워드 태그 (layout.tsx 서버에서 전달된 정적 데이터) */}
      {tags.length > 0 && (
        <div className="bg-white dark:bg-[#1e1f22]  p-5 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] mb-4 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2.5 py-1.5">
            <svg className="w-4 h-4 text-[var(--google-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            인기 키워드 태그
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--google-surface-variant)] dark:bg-[#303134] text-[#5f6368] dark:text-[#c4c7c5] border border-transparent hover:border-[var(--google-blue)] hover:bg-[#e8f0fe] dark:hover:bg-[#174ea6]/20 hover:text-[var(--google-blue)] dark:hover:text-[#8ab4f8] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <span className="text-[var(--google-red)] opacity-70">#</span>
                {tag}
              </Link>
            ))}
          </div>
          {hiddenTags.length > 0 && <SidebarTagMore tags={hiddenTags} />}
        </div>
      )}
    </div>
  );
}
