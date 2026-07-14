import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { RefreshCw, Ambulance } from 'lucide-react';
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
      
      {/* 1. 메인 페이지 인트로 헤더 (Neo-brutalism 스타일) */}
      <div className="bg-white dark:bg-[#121417] p-5 sm:p-6 mb-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 mt-4 group">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 mb-3">
          <span className="text-black dark:text-white">의정부 주민 맞춤형 혜택·의료 포털</span>
        </h1>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 break-keep leading-relaxed font-bold">
          의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 제공합니다.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-black dark:text-white font-black bg-white dark:bg-[#121417] px-3 py-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={3} />
            최종 업데이트 : {data.lastUpdated || '2026-05-29'}
          </span>
          <Link 
            href="/services/emergency" 
            className="group/btn relative inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white font-black text-xs sm:text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all"
          >
            <Ambulance className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            <span className="tracking-wide">응급실/약국 찾기</span>
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
