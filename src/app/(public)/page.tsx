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
      
      {/* 1. 메인 페이지 인트로 헤더 (Premium 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50/30 dark:from-[#1a1c20] dark:via-[#1a1c20] dark:to-blue-900/20 border border-blue-100 dark:border-gray-800 p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          
          {/* 텍스트 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              의정부 주민 맞춤형 <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">혜택·의료 포털</span>
            </h1>
            <p className="text-[15px] sm:text-[17px] text-gray-600 dark:text-gray-400 break-keep leading-relaxed font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
              의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 알기 쉽게 제공합니다.
            </p>
            
            {/* 버튼 영역 (제거됨 - 벤토 박스로 분리) */}
          </div>

          {/* 로고 (우측) */}
          <div className="shrink-0 w-full lg:w-auto flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 drop-shadow-xl bg-white dark:bg-white/10 rounded-full p-4 border-4 border-white/50 backdrop-blur-sm">
              <Image 
                src="/images/uijeongbu-logo.png" 
                alt="의정부 행복특별시 마크" 
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                priority
              />
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
