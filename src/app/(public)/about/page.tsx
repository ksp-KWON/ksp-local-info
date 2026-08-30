import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Metadata } from 'next';
import PageHeaderBanner from '@/components/ui/PageHeaderBanner';
import AppIcon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: '사이트 소개 및 운영 철학 | 의정부 건강·생활 정보 포털',
  description: '의정부 시민을 위한 공공데이터 기반 생활 복지, 의료, 지역화폐 정보 허브의 운영 목적과 데이터 출처를 투명하게 안내합니다.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
  let lastUpdated = '';

  try {
    if (fs.existsSync(localInfoPath)) {
      const data = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
      lastUpdated = data.lastUpdated || '';
    }
  } catch {
    // Ignore errors
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-10 space-y-8">
      {/* 1. 상단 브레드크럼 */}
      <nav className="flex text-xs text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5 font-medium">
          <li>
            <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
              <AppIcon name="home" size={13} strokeWidth={2} />
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1 text-zinc-400">/</span>
          </li>
          <li className="text-zinc-900 dark:text-white font-bold">플랫폼 소개</li>
        </ol>
      </nav>

      {/* 2. 메인 헤더 배너 */}
      <PageHeaderBanner
        badgeText="투명성과 공공성"
        badgeTone="emerald"
        badgeIcon="shield-check"
        title="의정부 건강·생활 정보 포털의 사명"
        description="시민들에게 꼭 필요한 공공 혜택과 응급의료 정보가 복잡한 행정 사이트에 흩어져 있어 놓치는 일이 없도록, 공공데이터를 실시간으로 연결하여 가장 읽기 쉽고 직관적인 형태로 큐레이션합니다."
        watermarkIcon="shield-check"
      >
        {lastUpdated && (
          <div className="pt-2 text-xs font-medium text-zinc-500">
            최근 데이터 동기화: {lastUpdated}
          </div>
        )}
      </PageHeaderBanner>

      {/* 3. 3대 핵심 가치 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-6 bg-white dark:bg-[#181a1d] border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-[0_0_20px_rgba(4,120,87,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(4,120,87,0.45),0_0_20px_rgba(4,120,87,0.25)] hover:-translate-y-1 space-y-2 relative overflow-hidden transition-all duration-300 rounded-none group">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-emerald-900 dark:text-emerald-100 pointer-events-none group-hover:scale-110 transition-transform">
            <AppIcon name="shield" size={60} strokeWidth={1.5} />
          </div>
          <div className="w-9 h-9 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <AppIcon name="shield-check" size={18} strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white pt-2">공식 데이터 검증</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            행정안전부 공공데이터포털, 경기도 공공데이터, 국립중앙의료원(NMC)의 공인된 Open API만을 기반으로 데이터를 정제합니다.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181a1d] border border-sky-200/80 dark:border-sky-900/40 hover:border-sky-500 dark:hover:border-sky-500 shadow-[0_0_20px_rgba(3,105,161,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(3,105,161,0.45),0_0_20px_rgba(3,105,161,0.25)] hover:-translate-y-1 space-y-2 relative overflow-hidden transition-all duration-300 rounded-none group">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-sky-900 dark:text-sky-100 pointer-events-none group-hover:scale-110 transition-transform">
            <AppIcon name="zap" size={60} strokeWidth={1.5} />
          </div>
          <div className="w-9 h-9 bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 flex items-center justify-center border border-sky-200 dark:border-sky-800">
            <AppIcon name="zap" size={18} strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white pt-2">실시간 혜택 큐레이션</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            의정부시청 공고와 경기지역화폐 혜택, 청년 및 출산 지원금 등 놓치기 쉬운 실생활 복지를 알기 쉽게 요약 제공합니다.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181a1d] border border-rose-200/80 dark:border-rose-900/40 hover:border-rose-500 dark:hover:border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(225,29,72,0.45),0_0_20px_rgba(225,29,72,0.25)] hover:-translate-y-1 space-y-2 relative overflow-hidden transition-all duration-300 rounded-none group">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-rose-900 dark:text-rose-100 pointer-events-none group-hover:scale-110 transition-transform">
            <AppIcon name="heart" size={60} strokeWidth={1.5} />
          </div>
          <div className="w-9 h-9 bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 flex items-center justify-center border border-rose-200 dark:border-rose-800">
            <AppIcon name="heart" size={18} strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white pt-2">시민 편의성 최우선</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            회원가입이나 개인정보 수집 없이 모든 공공지도와 혜택 안내를 누구나 100% 무료로 자유롭게 열람할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 4. 데이터 출처 명시 (E-E-A-T) */}
      <div className="p-6 sm:p-8 bg-zinc-50/70 dark:bg-zinc-900/60 border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] space-y-4 rounded-none">
        <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <AppIcon name="file-text" size={18} strokeWidth={2} className="text-zinc-600 dark:text-zinc-400" />
          <span>공식 데이터 출처 및 API 연동 명세</span>
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm font-normal text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <span><strong className="text-zinc-900 dark:text-white">응급의료 및 약국</strong> : 국립중앙의료원(NMC) 중앙응급의료센터 공공 API</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">✓</span>
            <span><strong className="text-zinc-900 dark:text-white">의정부사랑카드</strong> : 경기데이터드림(경기지역화폐 가맹점 현황 Open API)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">✓</span>
            <span><strong className="text-zinc-900 dark:text-white">국가 건강검진 기관</strong> : 건강보험심사평가원 및 국민건강보험공단 검진기관 데이터</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
