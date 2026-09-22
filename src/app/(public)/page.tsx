import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Metadata } from 'next';
import Image from 'next/image';
import MiniMapPreview from '@/components/MiniMapPreview';
import AppIcon from '@/components/ui/AppIcon';
import PremiumCard from '@/components/ui/PremiumCard';
import CivicCategorySection from '@/components/CivicCategorySection';

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
    <div className="space-y-8 sm:space-y-10">
      {/* 1. 메인 인트로 헤더 (보상스쿨 Google Material 스타일) */}
      <div className="relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-[#202124] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-md p-6 sm:p-8 lg:p-10 group transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-blue-50/10 to-transparent dark:from-blue-950/20 dark:via-blue-950/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

        {/* 우측 배경 수묵 워터마크 (SVG) */}
        <div className="absolute -right-6 -bottom-6 text-zinc-900/[0.035] dark:text-zinc-100/[0.055] pointer-events-none transition-transform duration-500 group-hover:scale-105 z-0">
          <AppIcon name="compass" size={190} strokeWidth={1.5} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* 텍스트 영역 */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8f0fe] text-[var(--google-blue)] dark:bg-[#174ea6]/20 dark:text-[#8ab4f8] text-xs font-bold uppercase tracking-wider mb-4 border border-[#d2e3fc]/60 dark:border-[#174ea6]/40 rounded-none shadow-xs">
              <AppIcon name="shield-check" size={14} strokeWidth={2} />
              <span>의정부시 생활·의료 정보 포털</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-[#202124] dark:text-white">
              의정부 <br className="hidden sm:block lg:hidden" />
              <span className="bg-gradient-to-r from-[#0d47a1] to-[#1a73e8] dark:from-[#8ab4f8] dark:to-[#aecbfa] bg-clip-text text-transparent">건강·생활 정보 포털</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal break-keep max-w-xl leading-relaxed">
              의정부 응급실 위치와 전화번호, 국가건강검진·민원 안내를 한눈에 확인하세요.
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

      {/* 2. 핵심 공공서비스 퀵메뉴 (의정부시 24시간 응급실 안내 - 배경 지도 비침 & 우측 지도보기 버튼) */}
      <div className="w-full">
        <Link href="/services/emergency" className="group block w-full">
          <PremiumCard
            hoverEffect={true}
            className="p-4 sm:p-5 min-h-0 relative overflow-hidden"
          >
            {/* 배경 은은한 카카오맵 지도 비침 레이어 */}
            <MiniMapPreview type="emergency" />

            {/* 카드 전면 콘텐츠 (텍스트 좌측, 버튼 우측 분할 배치) */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-none bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-2xs backdrop-blur-xs">
                  <AppIcon name="hospital" size={20} strokeWidth={2.5} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100/90 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200 text-[11px] font-bold rounded-none">
                      야간·응급의료
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white group-hover:text-emerald-950 dark:group-hover:text-emerald-200 transition-colors truncate">
                      의정부시 24시간 응급실 안내
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium truncate mt-0.5">
                    의정부성모병원·을지대병원 응급실 위치, 비상전화번호, 진료과목을 지도에서 확인하세요.
                  </p>
                </div>
              </div>

              {/* 우측 정렬 지도보기 버튼 */}
              <div className="flex justify-end sm:justify-center shrink-0">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 group-hover:bg-emerald-800 text-white text-xs font-bold shrink-0 shadow-xs transition-colors rounded-none">
                  <span>지도 보기</span>
                  <AppIcon name="chevron-right" size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </PremiumCard>
        </Link>
      </div>

      {/* 3. 네이버형 분야별 대제목-하위탭-포스팅 허브 (최상단 브리핑 + 1순위 공연 섹션) */}
      <CivicCategorySection posts={posts} />
    </div>
  );
}
