'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import AppIcon from '@/components/ui/AppIcon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const popularKeywords = ['청년 이사비', '사랑카드 가맹점', '달빛어린이병원', '심야약국', '국가건강검진', '출산축하금'];

  return (
    <>
      {/* 1. 헤더 검색 트리거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all cursor-pointer"
        aria-label="통합 검색 열기"
      >
        <AppIcon name="search" size={14} strokeWidth={2.5} />
        <span className="hidden sm:inline">통합 검색...</span>
      </button>

      {/* 2. 모달 팝업 */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden">
              <form onSubmit={handleSearch} className="flex items-center p-4 border-b-2 border-black dark:border-white">
                <AppIcon name="search" size={20} strokeWidth={2.5} className="text-black dark:text-white mr-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="혜택, 병원, 지원금 키워드를 입력하세요"
                  autoFocus
                  className="w-full bg-transparent text-black dark:text-white placeholder-zinc-400 font-bold text-base focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <AppIcon name="close" size={20} strokeWidth={2.5} className="text-black dark:text-white" />
                </button>
              </form>

              {/* 인기 검색어 안내 */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center gap-1.5 text-xs font-black text-zinc-500 mb-2.5">
                  <AppIcon name="trending-up" size={14} strokeWidth={2.5} />
                  <span>실시간 추천 검색어</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(kw)}`);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-[#181a1d] text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all cursor-pointer"
                    >
                      #{kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
