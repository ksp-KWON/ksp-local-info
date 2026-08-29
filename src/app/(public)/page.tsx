import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';
import Image from 'next/image';
import MiniMapPreview from '@/components/MiniMapPreview';
import AppIcon from '@/components/ui/AppIcon';

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
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* 1. 메인 인트로 헤더 (모던 수묵 & 굵은 라인 SVG 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-none border-2 border-black dark:border-white bg-white dark:bg-[#181a1d] shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] p-6 sm:p-8 lg:p-10 group">
        {/* 우측 배경 수묵 워터마크 (굵은 라인 SVG) */}
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none transition-transform duration-500 group-hover:scale-105">
          <AppIcon name="compass" size={190} strokeWidth={2} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* 텍스트 영역 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider mb-4 border-2 border-black dark:border-white rounded-none">
              <AppIcon name="shield-check" size={14} strokeWidth={2.5} />
              <span>의정부시 공공데이터 생활 포털</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2] text-black dark:text-white">
              의정부 <br className="hidden sm:block lg:hidden" />
              건강ㆍ생활 정보 포털
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium break-keep max-w-xl">
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

      {/* 2. 3대 핵심 공공서비스 퀵메뉴 (수묵 명도 & 굵은 라인 SVG 벤토 박스) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* 달빛어린이병원 & 심야약국 카드 */}
        <Link
          href="/services/emergency"
          className="group relative overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] bg-gradient-to-br from-black/[0.03] via-white to-white dark:from-white/[0.05] dark:via-[#181a1d] dark:to-[#181a1d]"
        >
          <MiniMapPreview type="emergency" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black mb-2 border border-black dark:border-white rounded-none">
              <AppIcon name="hospital" size={13} strokeWidth={2.5} />
              <span>응급의료 지도</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5 block">
              달빛어린이병원 & 심야약국
            </h3>
            <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 break-keep">
              휴일이나 야간에도 문 여는 병원·약국을 실시간으로 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-black text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>지도 보기</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={3} />
            </span>
          </div>

          {/* 굵은 SVG 수묵 워터마크 */}
          <div className="absolute -bottom-3 -right-3 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <AppIcon name="hospital" size={110} strokeWidth={2} />
          </div>
        </Link>

        {/* 의정부 사랑카드 가맹점 지도 카드 */}
        <Link
          href="/services/local-currency"
          className="group relative overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] bg-gradient-to-br from-black/[0.03] via-white to-white dark:from-white/[0.05] dark:via-[#181a1d] dark:to-[#181a1d]"
        >
          <MiniMapPreview type="currency" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black mb-2 border border-black dark:border-white rounded-none">
              <AppIcon name="bank" size={13} strokeWidth={2.5} />
              <span>지역화폐 가맹점</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5 block">
              의정부 사랑카드 가맹점
            </h3>
            <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 break-keep">
              내 주변에서 의정부 지역화폐를 쓸 수 있는 가맹점을 찾아보세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-black text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>가맹점 검색</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={3} />
            </span>
          </div>

          {/* 굵은 SVG 수묵 워터마크 */}
          <div className="absolute -bottom-3 -right-3 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <AppIcon name="bank" size={110} strokeWidth={2} />
          </div>
        </Link>

        {/* 국가 건강검진 지정병원 찾기 카드 */}
        <Link
          href="/services/health-check"
          className="group relative overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] bg-gradient-to-br from-black/[0.03] via-white to-white dark:from-white/[0.05] dark:via-[#181a1d] dark:to-[#181a1d]"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black mb-2 border border-black dark:border-white rounded-none">
              <AppIcon name="stethoscope" size={13} strokeWidth={2.5} />
              <span>건강검진 기관</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5 block">
              국가 건강검진 지정병원
            </h3>
            <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 break-keep">
              일반검진, 암검진, 구강검진이 가능한 의정부 내 의료기관을 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-black text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>지정병원 조회</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={3} />
            </span>
          </div>

          {/* 굵은 SVG 수묵 워터마크 */}
          <div className="absolute -bottom-3 -right-3 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <AppIcon name="stethoscope" size={110} strokeWidth={2} />
          </div>
        </Link>
      </div>

      {/* 3. 블로그 콘텐츠 큐레이션 리스트 */}
      <HomePostList initialPosts={posts} />

      {/* 광고 영역 */}
      <div className="py-6">
        <AdBanner slot="home-middle-ad" />
      </div>
    </div>
  );
}
