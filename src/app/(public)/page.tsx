import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Ambulance, CreditCard, ArrowRight } from 'lucide-react';
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
      <div className="mt-4 relative overflow-hidden rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-xl p-6 sm:p-8 lg:p-10">
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          
          {/* 텍스트 영역 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2]">
              <span className="text-gray-900 dark:text-white">의정부</span> <br className="hidden sm:block lg:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">건강ㆍ생활 정보 포털</span>
            </h1>
          </div>

          {/* 로고 영역 (우측) */}
          <div className="shrink-0 order-1 lg:order-2 relative">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center">
              <Image 
                src="/images/uijeongbu-logo.png" 
                alt="의정부 행복특별시 마크" 
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 160px, 224px"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. 서비스 퀵메뉴 (Bento Box 영역) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        
        {/* 응급실/약국 찾기 카드 */}
        <Link 
          href="/services/emergency"
          className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 rounded-none p-6 sm:p-8 flex flex-col justify-between h-[200px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-white/5 hover:-translate-y-1 bg-white dark:bg-[#121212]"
        >
          <MiniMapPreview type="emergency" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-400 mb-2 block">
              달빛어린이병원 & 심야약국 찾기
            </h3>
            <p className="text-[14px] sm:text-[15px] font-medium text-gray-600 dark:text-gray-400 break-keep max-w-[85%]">
              갑자기 아플 때, 밤이나 휴일에도 문 여는 병원과 약국을 실시간으로 확인하세요.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center justify-end w-full">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
              바로가기 <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <Ambulance className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-900/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </Link>

        {/* 의정부 사랑카드 가맹점 지도 카드 */}
        <Link 
          href="/services/local-currency"
          className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 rounded-none p-6 sm:p-8 flex flex-col justify-between h-[200px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-white/5 hover:-translate-y-1 bg-white dark:bg-[#121212]"
        >
          <MiniMapPreview type="currency" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mb-2 block">
              의정부 사랑카드 가맹점 찾기
            </h3>
            <p className="text-[14px] sm:text-[15px] font-medium text-gray-600 dark:text-gray-400 break-keep max-w-[85%]">
              내 주변에서 의정부 지역화폐를 사용할 수 있는 착한 가맹점들을 한눈에 찾아보세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full">
            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
              바로가기 <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          
          <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-900/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-500" />
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
