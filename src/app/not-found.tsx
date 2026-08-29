import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* 404 헤더 박스 */}
      <div className="p-8 sm:p-12 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] relative overflow-hidden group rounded-none transition-all duration-300">
        <div className="absolute -right-6 -bottom-6 text-zinc-900/[0.03] dark:text-zinc-100/[0.05] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="warning" size={180} strokeWidth={1.5} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800 rounded-none shadow-2xs">
            <AppIcon name="warning" size={14} strokeWidth={2} className="text-amber-600 dark:text-amber-400" />
            <span>404 Page Not Found</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            요청하신 페이지를 찾을 수 없습니다
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal max-w-lg mx-auto break-keep">
            존재하지 않거나 주소가 변경된 페이지입니다. 아래의 주요 퀵메뉴나 홈으로 이동해 보세요.
          </p>

          {/* 4대 주요 퀵링크 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 text-left">
            <Link
              href="/"
              className="p-3.5 bg-zinc-50/70 dark:bg-zinc-900/60 border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all rounded-none shadow-2xs group/card"
            >
              <AppIcon name="home" size={18} strokeWidth={2} className="mb-2 text-zinc-700 dark:text-zinc-300 group-hover/card:text-zinc-950 dark:group-hover/card:text-white" />
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">포털 홈</div>
              <div className="text-[11px] text-zinc-500 font-medium">메인 화면</div>
            </Link>

            <Link
              href="/services/emergency"
              className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all rounded-none shadow-2xs group/card"
            >
              <AppIcon name="hospital" size={18} strokeWidth={2} className="mb-2 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">달빛병원·약국</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">응급의료 지도</div>
            </Link>

            <Link
              href="/services/local-currency"
              className="p-3.5 bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/40 hover:border-sky-400 dark:hover:border-sky-600 transition-all rounded-none shadow-2xs group/card"
            >
              <AppIcon name="bank" size={18} strokeWidth={2} className="mb-2 text-sky-600 dark:text-sky-400" />
              <div className="text-xs font-bold text-sky-950 dark:text-sky-200">사랑카드 가맹점</div>
              <div className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">지역화폐 지도</div>
            </Link>

            <Link
              href="/blog"
              className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-none shadow-2xs group/card"
            >
              <AppIcon name="list" size={18} strokeWidth={2} className="mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-xs font-bold text-amber-950 dark:text-amber-200">생활 혜택 소식</div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">지원금 가이드</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
