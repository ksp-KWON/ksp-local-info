import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Ambulance, CreditCard, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';
import Image from 'next/image';
import EmergencyMapWidget from '@/components/emergency/EmergencyMapWidget';
import LocalCurrencyMapWidget from '@/components/local-currency/LocalCurrencyMapWidget';

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
      
      {/* 1. 메인 페이지 인트로 헤더 (Premium & Modern 스타일 개편) */}
      <div className="mt-4 relative overflow-hidden rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-2xl p-8 sm:p-12 lg:p-16">
        
        {/* 장식용 배경 빛 번짐 효과 (은은한 고급스러움) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
          
          {/* 텍스트 영역 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            {/* 상단 태그 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold text-xs tracking-wider uppercase border border-blue-100 dark:border-blue-800/50 shadow-sm rounded-none">
              <span className="w-2 h-2 rounded-none bg-blue-600 dark:bg-blue-500 animate-pulse" />
              Uijeongbu Local Info
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.2]">
              의정부 주민을 위한 <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">맞춤형 혜택·의료 포털</span>
            </h1>
            <p className="text-[16px] sm:text-[18px] text-gray-600 dark:text-gray-400 break-keep leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              흩어져 있는 의정부시의 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션합니다. 
              내게 꼭 필요한 혜택을 단 하나도 놓치지 마세요.
            </p>
          </div>

          {/* 로고 영역 (우측) - 각진 글래스모피즘 겹침 디자인 */}
          <div className="shrink-0 order-1 lg:order-2 relative group">
            <div className="relative w-40 h-40 lg:w-56 lg:h-56 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
              
              {/* 배경 유리 패널 1 (우측으로 살짝 회전) */}
              <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl rounded-none rotate-6 group-hover:rotate-12 transition-transform duration-500" />
              
              {/* 배경 유리 패널 2 (좌측으로 살짝 회전) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent border border-white/60 dark:border-white/10 shadow-xl rounded-none -rotate-3 group-hover:-rotate-6 transition-transform duration-500" />
              
              {/* 로고 본체 */}
              <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                <Image 
                  src="/images/uijeongbu-logo.png" 
                  alt="의정부 행복특별시 마크" 
                  fill
                  className="object-contain p-6 lg:p-8 drop-shadow-xl"
                  sizes="(max-width: 1024px) 160px, 224px"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. 서비스 위젯(Full Map) 영역 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        
        {/* 응급실/약국 찾기 위젯 */}
        <div className="w-full">
          <EmergencyMapWidget isWidget={true} />
        </div>

        {/* 의정부 사랑카드 가맹점 지도 위젯 */}
        <div className="w-full">
          <LocalCurrencyMapWidget isWidget={true} />
        </div>

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
