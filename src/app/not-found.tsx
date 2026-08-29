import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* 404 헤더 박스 */}
      <div className="p-8 sm:p-12 bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="warning" size={180} strokeWidth={2} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white">
            <AppIcon name="warning" size={14} strokeWidth={2.5} />
            <span>404 Page Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
            요청하신 페이지를 찾을 수 없습니다
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium max-w-lg mx-auto break-keep">
            존재하지 않거나 주소가 변경된 페이지입니다. 아래의 주요 퀵메뉴나 홈으로 이동해 보세요.
          </p>

          {/* 4대 주요 퀵링크 그리드 (수묵 흑백 칩) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-2 border-zinc-200 dark:border-zinc-800 text-left">
            <Link
              href="/"
              className="p-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all group/card"
            >
              <AppIcon name="home" size={18} strokeWidth={2.5} className="mb-2 text-black dark:text-white" />
              <div className="text-xs font-black text-black dark:text-white">포털 홈</div>
              <div className="text-[11px] text-zinc-500 font-medium">메인 화면</div>
            </Link>

            <Link
              href="/services/emergency"
              className="p-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all group/card"
            >
              <AppIcon name="hospital" size={18} strokeWidth={2.5} className="mb-2 text-black dark:text-white" />
              <div className="text-xs font-black text-black dark:text-white">달빛병원·약국</div>
              <div className="text-[11px] text-zinc-500 font-medium">응급의료 지도</div>
            </Link>

            <Link
              href="/services/local-currency"
              className="p-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all group/card"
            >
              <AppIcon name="bank" size={18} strokeWidth={2.5} className="mb-2 text-black dark:text-white" />
              <div className="text-xs font-black text-black dark:text-white">사랑카드 가맹점</div>
              <div className="text-[11px] text-zinc-500 font-medium">지역화폐 지도</div>
            </Link>

            <Link
              href="/blog"
              className="p-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all group/card"
            >
              <AppIcon name="list" size={18} strokeWidth={2.5} className="mb-2 text-black dark:text-white" />
              <div className="text-xs font-black text-black dark:text-white">생활 혜택 소식</div>
              <div className="text-[11px] text-zinc-500 font-medium">지원금 가이드</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
