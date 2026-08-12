'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Search, X, TrendingUp } from 'lucide-react';

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

  return (
    <div className="flex items-center">
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 bg-white dark:bg-[#121417] border-2 border-black dark:border-white text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 flex items-center justify-center group"
        aria-label="검색 열기"
        title="검색"
      >
        <Search className="w-5 h-5 sm:w-[20px] sm:h-[20px] text-pink-500 dark:text-pink-400" strokeWidth={3} />
      </button>

      {/* Full Screen Search Modal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[200] bg-white dark:bg-[#121417] animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto w-full h-full flex flex-col mt-0 sm:mt-[10vh]">
            <div className="flex items-center p-3 sm:p-6 border-b-2 border-black dark:border-white sm:border-2 bg-white dark:bg-[#121417]">
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors mr-2 border-2 border-transparent hover:border-black dark:hover:border-white"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="무엇을 찾으시나요?"
                  className="w-full bg-white dark:bg-[#121417] border-2 border-black dark:border-white px-5 py-3 sm:py-4 outline-none text-base sm:text-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                  autoFocus
                />
              </form>
              <button 
                onClick={handleSearch} 
                className="ml-3 px-6 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black font-black border-2 border-black dark:border-white hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-all hidden sm:block"
              >
                검색
              </button>
            </div>
            
            <div className="p-6 sm:px-12 flex-1">
              <p className="text-sm font-black text-black dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                인기 검색 키워드
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {['청년지원금', '임산부', '일자리', '문화행사', '응급실', '도서관', '지역화폐'].map(keyword => (
                  <button 
                    key={keyword}
                    onClick={() => {
                      setQuery(keyword);
                      router.push(`/search?q=${encodeURIComponent(keyword)}`);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-[#121417] text-black dark:text-white border-2 border-black dark:border-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
