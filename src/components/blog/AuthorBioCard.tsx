import Image from 'next/image';

export default function AuthorBioCard() {
  return (
    <div className="mt-12 mb-10 bg-white dark:bg-[#202124] px-4 py-5 sm:p-6 border-2 border-black dark:border-white shadow-marker-pink transition-all duration-300 relative overflow-hidden group">
      <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] dark:opacity-[0.05] text-[120px] select-none pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
        📝
      </div>
      <div className="relative z-10">
        <div className="border-b-2 border-black dark:border-white pb-3 mb-4">
          <h3 className="text-xl font-dohyeon text-black dark:text-white flex items-center gap-2 pl-1 mb-1">
            <span className="text-xl leading-none">📝</span>
            <span className="highlighter-pink px-1">저자 소개</span>
          </h3>
        </div>

        <div className="flex items-start gap-4">
          {/* 아바타 */}
          <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-200 p-1 overflow-hidden">
            <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-bold text-xl">
              K
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[16px] font-extrabold text-gray-900 dark:text-white tracking-tight">에디터 K</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                의정부 공공데이터 분석가
              </span>
            </div>
            <p className="text-[13.5px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed break-keep">
              의정부시 공공데이터포털(data.go.kr) 및 시청 고시/공고를 실시간으로 분석하여, 시민들이 놓치기 쉬운 혜택과 지역 정보를 가장 빠르고 알기 쉽게 전달합니다.
            </p>
            <div className="mt-3 flex items-center gap-3 text-[12px] font-jua font-normal text-blue-600 dark:text-blue-400">
              <a href="/about" className="hover:underline flex items-center gap-1 group/link">
                <svg className="w-4 h-4 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                저자 소개 보기
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400">의정부 생활 정보 공식 에디터</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
