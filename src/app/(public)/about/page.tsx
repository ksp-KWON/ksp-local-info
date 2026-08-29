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
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12 space-y-8">
      {/* 1. 상단 브레드크럼 */}
      <nav className="flex text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li className="text-gray-900 dark:text-white font-bold" aria-current="page">
            사이트 소개
          </li>
        </ol>
      </nav>

      {/* 2. 헤더 카드 */}
      <div className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 rounded-none shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-blue-100 dark:border-blue-800/40 rounded-none">
          Transparency & E-E-A-T Standard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          의정부 건강ㆍ생활 정보 포털 소개
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed break-keep">
          의정부 시민들이 일상에서 꼭 필요한 공공 복지 혜택, 실시간 심야 의료 정보, 지역화폐 혜택을 가장 쉽고 빠르게 찾아볼 수 있도록 돕는 비영리 공공데이터 생활 정보 포털입니다.
        </p>
      </div>

      {/* 3. 본문 섹션 카드들 */}
      <div className="space-y-6">
        {/* 서비스 운영 목적 */}
        <section className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-7 rounded-none shadow-sm space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <AppIcon name="bullhorn" size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>1. 서비스 운영 목적</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-keep">
            매년 중앙정부와 의정부시, 경기도에서 다양한 주민 복지 및 청년·육아 지원책이 발표되지만, 여러 기관 웹사이트에 흩어져 있어 제때 혜택을 챙기지 못하는 이웃들이 많습니다. 본 포털은 이러한 정보 비대칭을 해소하고, 누구나 한눈에 알기 쉽게 맞춤형 생활 소식을 탐색할 수 있도록 돕습니다.
          </p>
        </section>

        {/* 공식 데이터 출처 */}
        <section className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-7 rounded-none shadow-sm space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <AppIcon name="shield-check" size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>2. 공공데이터 기반 공식 출처 및 연계</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-keep">
            본 사이트에서 제공하는 데이터는 대한민국 정부 <strong>행정안전부 공공데이터포털(data.go.kr)</strong>의 공공서비스 목록 API, <strong>국립중앙의료원(NMC)</strong>의 전국 응급의료기관 및 휴일지킴이약국 API, <strong>경기지역화폐</strong> 공식 가맹점 데이터를 기반으로 실시간 필터링 및 검증을 거쳐 제공됩니다.
          </p>
        </section>

        {/* 콘텐츠 제작 및 면책 고지 */}
        <section className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-7 rounded-none shadow-sm space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <AppIcon name="lightbulb" size={20} className="text-amber-500 shrink-0" />
            <span>3. 콘텐츠 작성 표준 및 이용자 안내</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-keep">
            모든 지원금 안내 및 공고 글은 공공기관 원문 고시를 바탕으로 독자의 가독성을 위해 항목별(신청 자격, 지원 금액, 신청 방법, 구비 서류)로 체계화하여 작성됩니다.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 p-4 rounded-none mt-3">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed break-keep">
              ※ <strong>이용 시 유의사항</strong>: 각 지자체의 예산 소진 상황이나 행정 지침 개정에 따라 지원 조건이 실시간 변동될 수 있습니다. 중요한 신청 전에는 본문 하단에 제공된 공식 소관 부서(동 행정복지센터 등) 또는 원문 웹사이트 링크를 통해 최종 공고를 반드시 재확인하시길 권장합니다.
            </p>
          </div>
        </section>
      </div>

      {lastUpdated && (
        <div className="text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
          <span>데이터 동기화 최종 기준일</span>
          <span className="font-bold">{lastUpdated}</span>
        </div>
      )}
    </div>
  );
}
