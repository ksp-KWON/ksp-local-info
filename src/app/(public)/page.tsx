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
      <div className="bg-white dark:bg-[#121417] p-5 sm:p-6 mb-6 border-2 border-black dark:border-white shadow-marker-blue hover:-translate-y-1 hover:-translate-x-1 hover:shadow-marker-blue transition-all duration-200 mt-4 group">
        <h1 className="text-2xl sm:text-3xl font-dohyeon font-normal tracking-wide flex items-center gap-2 mb-3">
          <span className="text-black dark:text-white highlighter-blue px-1">의정부 주민 맞춤형 혜택·의료 포털</span>
        </h1>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 break-keep leading-relaxed font-jua font-normal">
          의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 제공합니다.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
          <Link 
            href="/services/emergency" 
            className="group/btn relative inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white font-jua font-normal text-xs sm:text-sm border-2 border-black dark:border-white shadow-marker-yellow hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-marker-yellow transition-all"
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
