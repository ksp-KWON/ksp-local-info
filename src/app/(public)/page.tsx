import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';

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
    <div className="space-y-8 sm:px-0 pb-16">
      
      {/* 1. 메인 페이지 인트로 헤더 (입체 박스 스타일) */}
      <div className="bg-white dark:bg-[#1e1f22]  p-5 sm:p-6 mb-6 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(0,144,214,0.2)] hover:border-[#0090D6] transition-all duration-300 relative overflow-hidden group/headerbox mt-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-3 sm:px-4 py-1.5 sm:py-2 mb-3">
          <span className="bg-gradient-to-r from-[#0090D6] to-[#00b4d8] dark:from-[#00b4d8] dark:to-[#90e0ef] bg-clip-text text-transparent">의정부 주민 맞춤형 혜택·의료 포털 🏥</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#9aa0a6] break-keep leading-relaxed font-medium">
          의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 제공합니다.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-[#0090D6] font-semibold bg-[#0090D6]/10 px-2.5 py-1.5 rounded-sm border border-[#0090D6]/20">
            🔄 최종 업데이트 : {data.lastUpdated || '2026-05-29'}
          </span>
          <Link 
            href="/services/emergency" 
            className="group relative inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF2D55] text-white font-bold text-xs sm:text-sm shadow-[0_4px_15px_rgba(255,59,48,0.35)] hover:shadow-[0_8px_25px_rgba(255,59,48,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Hover 빛반사 효과 가상요소 */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative flex items-center justify-center z-10">
              <span className="animate-pulse mr-1 sm:mr-1.5 text-[14px] sm:text-[16px]">🚨</span>
              <span className="tracking-wide text-white drop-shadow-sm">응급실/약국 찾기</span>
            </span>
            <svg className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. 블로그 콘텐츠 큐레이션 리스트 */}
      <HomePostList initialPosts={posts} />

      {/* 광고 영역 */}
      <div className="py-8">
        <AdBanner slot="home-middle-ad" />
      </div>
      
    </div>
  );
}
