import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Ambulance, CreditCard, Stethoscope, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';
import Image from 'next/image';
import MiniMapPreview from '@/components/MiniMapPreview';

interface LocalData {
  lastUpdated: string;
}

async function getLocalData(): Promise<LocalData> {
  const filePath = path.join(process.cwd(), 'public/data/local-info.json');
  if (!fs.existsSync(filePath)) {
    return { lastUpdated: '' };
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const data = await getLocalData();
  const posts = getSortedPostsData();

  return (
    <div className="space-y-8 pb-16">
      {/* 1. 메인 페이지 인트로 헤더 (Premium & Compact 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-none border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-[#181a1d] shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* 텍스트 영역 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-blue-100 dark:border-blue-800/40 rounded-none">
              Uijeongbu Civic & Health Portal
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-gray-900 dark:text-white">
              의정부 <br className="hidden sm:block lg:hidden" />
              건강ㆍ생활 정보 포털
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium break-keep max-w-xl">
              달빛어린이병원, 심야약국, 의정부사랑카드 가맹점 지도부터 놓치기 쉬운 시정 지원금과 복지 혜택까지 한눈에 확인하세요.
            </p>
          </div>

          {/* 로고 영역 (우측) */}
          <div className="shrink-0 order-1 lg:order-2 relative">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              <Image
                src="/images/uijeongbu-logo.png"
                alt="의정부 행복특별시 마크"
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 144px, 180px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3대 핵심 공공서비스 퀵메뉴 (Bento Box 영역) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-8">
        {/* 응급실/약국 찾기 카드 */}
        <Link
          href="/services/emergency"
          className="group relative overflow-hidden border border-gray-200/80 dark:border-zinc-800 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#181a1d]"
        >
          <MiniMapPreview type="emergency" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-[11px] font-extrabold mb-2 border border-red-100 dark:border-red-800/40 rounded-none">
              응급의료 지도
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 block">
              달빛어린이병원 & 심야약국
            </h3>
            <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 break-keep">
              휴일이나 야간에도 문 여는 병원·약국을 실시간으로 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
              지도 보기 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <Ambulance className="absolute -bottom-3 -right-3 w-24 h-24 text-gray-900/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </Link>

        {/* 의정부 사랑카드 가맹점 지도 카드 */}
        <Link
          href="/services/local-currency"
          className="group relative overflow-hidden border border-gray-200/80 dark:border-zinc-800 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#181a1d]"
        >
          <MiniMapPreview type="currency" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-[11px] font-extrabold mb-2 border border-emerald-100 dark:border-emerald-800/40 rounded-none">
              지역화폐 가맹점
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 block">
              의정부 사랑카드 가맹점
            </h3>
            <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 break-keep">
              내 주변에서 의정부 지역화폐를 쓸 수 있는 가맹점을 찾아보세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
              가맹점 검색 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <CreditCard className="absolute -bottom-3 -right-3 w-24 h-24 text-gray-900/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </Link>

        {/* 국가 건강검진 지정병원 찾기 카드 */}
        <Link
          href="/services/health-check"
          className="group relative overflow-hidden border border-gray-200/80 dark:border-zinc-800 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#181a1d]"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[11px] font-extrabold mb-2 border border-blue-100 dark:border-blue-800/40 rounded-none">
              건강검진 기관
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 block">
              국가 건강검진 지정병원
            </h3>
            <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 break-keep">
              일반검진, 암검진, 구강검진이 가능한 의정부 내 의료기관을 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
              지정병원 조회 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <Stethoscope className="absolute -bottom-3 -right-3 w-24 h-24 text-gray-900/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </Link>
      </div>

      {/* 3. 블로그 콘텐츠 큐레이션 리스트 */}
      <HomePostList initialPosts={posts} />

      {/* 광고 영역 */}
      <div className="py-8">
        <AdBanner slot="home-middle-ad" />
      </div>
    </div>
  );
}
