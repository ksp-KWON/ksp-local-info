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
      {/* 1. 메인 인트로 헤더 (모던 수묵화 앰비언트 글로우) */}
      <div className="mt-4 relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-[#181a1d] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)] dark:hover:shadow-[0_14px_44px_rgba(255,255,255,0.08)] p-6 sm:p-8 lg:p-10 group transition-all duration-300">
        {/* 좌측 1.5px 수묵 포인트 획 & 먹물 번짐 워시 */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-900 dark:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/70 via-zinc-50/20 to-transparent dark:from-zinc-800/40 dark:via-zinc-800/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

        {/* 우측 배경 수묵 워터마크 (SVG) */}
        <div className="absolute -right-6 -bottom-6 text-zinc-900/[0.035] dark:text-zinc-100/[0.055] pointer-events-none transition-transform duration-500 group-hover:scale-105 z-0">
          <AppIcon name="compass" size={190} strokeWidth={1.5} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* 텍스트 영역 */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-xs font-bold uppercase tracking-wider mb-4 border border-zinc-200/80 dark:border-zinc-700 rounded-none shadow-xs">
              <AppIcon name="shield-check" size={14} strokeWidth={2} />
              <span>의정부시 공공데이터 생활 포털</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-zinc-950 dark:text-white">
              의정부 <br className="hidden sm:block lg:hidden" />
              <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">건강·생활 정보 포털</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal break-keep max-w-xl leading-relaxed">
              달빛어린이병원, 심야약국, 의정부사랑카드 가맹점 지도부터 놓치기 쉬운 시정 지원금과 복지 혜택까지 한눈에 확인하세요.
            </p>
          </div>

          {/* 로고 영역 */}
          <div className="shrink-0 order-1 lg:order-2 relative">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              <Image
                src="/images/uijeongbu-logo.png"
                alt="의정부시 로고"
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 144px, 180px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3대 핵심 공공서비스 퀵메뉴 (고명도 시빅 벤토 박스) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* 달빛어린이병원 & 심야약국 카드 */}
        <Link
          href="/services/emergency"
          className="group relative overflow-hidden border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(4,120,87,0.12)] bg-white dark:bg-[#181a1d]"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600 dark:bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-emerald-50/10 to-transparent dark:from-emerald-950/30 dark:via-emerald-950/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
          <MiniMapPreview type="emergency" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold mb-2 border border-emerald-200 dark:border-emerald-800 rounded-none shadow-2xs">
              <AppIcon name="hospital" size={13} strokeWidth={2.5} className="text-emerald-700 dark:text-emerald-400" />
              <span>응급의료 지도</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-1.5 block group-hover:text-emerald-950 dark:group-hover:text-emerald-200 transition-colors">
              달빛어린이병원 & 심야약국
            </h3>
            <p className="text-[13px] font-normal text-zinc-600 dark:text-zinc-400 break-keep leading-relaxed">
              휴일이나 야간에도 문 여는 병원·약국을 실시간으로 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 group-hover:translate-x-1 transition-transform">
              <span>지도 보기</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={2.5} />
            </span>
          </div>

          <div className="absolute -bottom-3 -right-3 text-emerald-900/[0.04] dark:text-emerald-100/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500 z-0">
            <AppIcon name="hospital" size={110} strokeWidth={1.5} />
          </div>
        </Link>

        {/* 의정부 사랑카드 가맹점 지도 카드 */}
        <Link
          href="/services/local-currency"
          className="group relative overflow-hidden border border-sky-200/80 dark:border-sky-900/40 hover:border-sky-400 dark:hover:border-sky-600 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(3,105,161,0.12)] bg-white dark:bg-[#181a1d]"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-600 dark:bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-sky-50/10 to-transparent dark:from-sky-950/30 dark:via-sky-950/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
          <MiniMapPreview type="currency" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-bold mb-2 border border-sky-200 dark:border-sky-800 rounded-none shadow-2xs">
              <AppIcon name="bank" size={13} strokeWidth={2.5} className="text-sky-700 dark:text-sky-400" />
              <span>지역화폐 가맹점</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-1.5 block group-hover:text-sky-950 dark:group-hover:text-sky-200 transition-colors">
              의정부 사랑카드 가맹점
            </h3>
            <p className="text-[13px] font-normal text-zinc-600 dark:text-zinc-400 break-keep leading-relaxed">
              내 주변에서 의정부 지역화폐를 쓸 수 있는 가맹점을 찾아보세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-sky-300 group-hover:translate-x-1 transition-transform">
              <span>가맹점 검색</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={2.5} />
            </span>
          </div>

          <div className="absolute -bottom-3 -right-3 text-sky-900/[0.04] dark:text-sky-100/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500 z-0">
            <AppIcon name="bank" size={110} strokeWidth={1.5} />
          </div>
        </Link>

        {/* 국가 건강검진 지정병원 찾기 카드 */}
        <Link
          href="/services/health-check"
          className="group relative overflow-hidden border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600 rounded-none p-5 sm:p-6 flex flex-col justify-between min-h-[190px] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(180,83,9,0.12)] bg-white dark:bg-[#181a1d]"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-600 dark:bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-amber-50/10 to-transparent dark:from-amber-950/30 dark:via-amber-950/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[11px] font-bold mb-2 border border-amber-200 dark:border-amber-800 rounded-none shadow-2xs">
              <AppIcon name="stethoscope" size={13} strokeWidth={2.5} className="text-amber-700 dark:text-amber-400" />
              <span>건강검진 기관</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-1.5 block group-hover:text-amber-950 dark:group-hover:text-amber-200 transition-colors">
              국가 건강검진 지정병원
            </h3>
            <p className="text-[13px] font-normal text-zinc-600 dark:text-zinc-400 break-keep leading-relaxed">
              일반검진, 암검진, 구강검진이 가능한 의정부 내 의료기관을 확인하세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full mt-3">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>지정병원 조회</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={2.5} />
            </span>
          </div>

          <div className="absolute -bottom-3 -right-3 text-amber-900/[0.04] dark:text-amber-100/[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500 z-0">
            <AppIcon name="stethoscope" size={110} strokeWidth={1.5} />
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
