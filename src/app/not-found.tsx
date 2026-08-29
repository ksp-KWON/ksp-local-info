import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-8 sm:p-10 rounded-none shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 rounded-none">
          <AppIcon name="warning" size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
            404 Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            요청하신 페이지를 찾을 수 없습니다
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed break-keep">
            페이지의 주소가 변경되었거나 삭제되어 현재 찾을 수 없습니다. 아래의 주요 공공서비스 바로가기를 이용해 보세요.
          </p>
        </div>

        {/* 주요 퀵링크 4종 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <Link
            href="/"
            className="p-3.5 bg-gray-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/80 dark:border-zinc-800 rounded-none flex items-center gap-2.5 transition-all group"
          >
            <AppIcon name="home" size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                메인 홈으로 이동
              </div>
              <div className="text-[11px] text-gray-400 truncate">포털 첫 화면 가기</div>
            </div>
          </Link>

          <Link
            href="/services/emergency"
            className="p-3.5 bg-gray-50 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200/80 dark:border-zinc-800 rounded-none flex items-center gap-2.5 transition-all group"
          >
            <AppIcon name="hospital" size={16} className="text-red-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                달빛병원 & 약국
              </div>
              <div className="text-[11px] text-gray-400 truncate">야간·휴일 진료 지도</div>
            </div>
          </Link>

          <Link
            href="/services/local-currency"
            className="p-3.5 bg-gray-50 dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200/80 dark:border-zinc-800 rounded-none flex items-center gap-2.5 transition-all group"
          >
            <AppIcon name="bank" size={16} className="text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                사랑카드 가맹점
              </div>
              <div className="text-[11px] text-gray-400 truncate">지역화폐 사용처 검색</div>
            </div>
          </Link>

          <Link
            href="/blog"
            className="p-3.5 bg-gray-50 dark:bg-zinc-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200/80 dark:border-zinc-800 rounded-none flex items-center gap-2.5 transition-all group"
          >
            <AppIcon name="list" size={16} className="text-purple-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                생활소식 전체보기
              </div>
              <div className="text-[11px] text-gray-400 truncate">최신 지원금 공고</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
