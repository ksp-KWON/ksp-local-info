import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Metadata } from 'next';
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
        <ol className="inline-flex items-center space-x-1.5 font-bold">
          <li>
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
              <AppIcon name="home" size={13} strokeWidth={2.5} />
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1 text-zinc-400">/</span>
          </li>
          <li className="text-black dark:text-white font-black">플랫폼 소개</li>
        </ol>
      </nav>

      {/* 2. 메인 헤더 배너 (수묵 굵은 라인 SVG) */}
      <div className="relative overflow-hidden rounded-none border-2 border-black dark:border-white bg-white dark:bg-[#181a1d] shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] p-6 sm:p-10 group">
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="shield-check" size={180} strokeWidth={2} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white rounded-none">
            <AppIcon name="shield-check" size={14} strokeWidth={2.5} />
            <span>투명성과 공공성</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black dark:text-white">
            의정부 건강·생활 정보 포털의 사명
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed break-keep max-w-2xl">
            시민들에게 꼭 필요한 공공 혜택과 응급의료 정보가 복잡한 행정 사이트에 흩어져 있어 놓치는 일이 없도록,
            공공데이터를 실시간으로 연결하여 가장 읽기 쉽고 직관적인 형태로 큐레이션합니다.
          </p>
          {lastUpdated && (
            <div className="pt-2 text-xs font-bold text-zinc-500">
              최근 데이터 동기화: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* 3. 3대 핵심 가치 카드 (모노톤 굵은 선 룩) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-6 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 shadow-[2px_2px_0px_rgba(0,0,0,0.06)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.06)] space-y-2 relative overflow-hidden">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-black dark:text-white pointer-events-none">
            <AppIcon name="shield" size={60} strokeWidth={2} />
          </div>
          <div className="w-9 h-9 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-black dark:border-white">
            <AppIcon name="shield-check" size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-black text-black dark:text-white pt-2">공식 데이터 검증</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            행정안전부 공공데이터포털, 경기도 공공데이터, 국립중앙의료원(NMC)의 공인된 Open API만을 기반으로 데이터를 정제합니다.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 shadow-[2px_2px_0px_rgba(0,0,0,0.06)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.06)] space-y-2 relative overflow-hidden">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-black dark:text-white pointer-events-none">
            <AppIcon name="zap" size={60} strokeWidth={2} />
          </div>
          <div className="w-9 h-9 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-black dark:border-white">
            <AppIcon name="zap" size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-black text-black dark:text-white pt-2">실시간 혜택 큐레이션</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            의정부시청 공고와 경기지역화폐 혜택, 청년 및 출산 지원금 등 놓치기 쉬운 실생활 복지를 알기 쉽게 요약 제공합니다.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 shadow-[2px_2px_0px_rgba(0,0,0,0.06)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.06)] space-y-2 relative overflow-hidden">
          <div className="absolute right-2 bottom-1 opacity-[0.05] text-black dark:text-white pointer-events-none">
            <AppIcon name="heart" size={60} strokeWidth={2} />
          </div>
          <div className="w-9 h-9 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-black dark:border-white">
            <AppIcon name="heart" size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-black text-black dark:text-white pt-2">시민 편의성 최우선</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            회원가입이나 개인정보 수집 없이 모든 공공지도와 혜택 안내를 누구나 100% 무료로 자유롭게 열람할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 4. 데이터 출처 명시 (E-E-A-T) */}
      <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 space-y-4">
        <h3 className="text-base sm:text-lg font-black text-black dark:text-white flex items-center gap-2">
          <AppIcon name="file-text" size={18} strokeWidth={2.5} />
          공식 데이터 출처 및 API 연동 명세
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-black dark:text-white font-black shrink-0">■</span>
            <span><strong>응급의료 및 약국</strong> : 국립중앙의료원(NMC) 중앙응급의료센터 공공 API</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black dark:text-white font-black shrink-0">■</span>
            <span><strong>의정부사랑카드</strong> : 경기데이터드림(경기지역화폐 가맹점 현황 Open API)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black dark:text-white font-black shrink-0">■</span>
            <span><strong>국가 건강검진 기관</strong> : 건강보험심사평가원 및 국민건강보험공단 검진기관 데이터</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
