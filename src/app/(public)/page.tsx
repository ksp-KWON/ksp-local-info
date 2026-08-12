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
      <div className="mt-4 relative overflow-hidden rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-2xl p-6 sm:p-8 lg:p-10">
        
        {/* 장식용 배경 빛 번짐 효과 (은은한 고급스러움) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          
          {/* 텍스트 영역 (좌측) */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.2]">
              의정부 <br className="hidden sm:block lg:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">건강ㆍ생활 정보 포털</span>
            </h1>
          </div>

          {/* 로고 영역 (우측) - 각진 글래스모피즘 겹침 디자인 */}
          <div className="shrink-0 order-1 lg:order-2 relative group">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
              
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

      {/* 2. 서비스 퀵메뉴 (Bento Box 영역) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        
        {/* 응급실/약국 찾기 카드 */}
        <Link 
          href="/services/emergency"
          className="group relative overflow-hidden border border-red-100 dark:border-red-900/50 rounded-none p-6 sm:p-8 flex flex-col justify-between h-[200px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 dark:hover:shadow-red-500/10 hover:-translate-y-1"
        >
          <MiniMapPreview type="emergency" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
              우리아이 달빛어린이병원 <br className="hidden sm:block" />& 심야약국 찾기
            </h3>
            <p className="text-[14px] sm:text-[15px] font-medium text-red-900/70 dark:text-red-300/70 break-keep max-w-[85%]">
              갑자기 아플 때, 밤이나 휴일에도 문 여는 병원과 약국을 실시간으로 확인하세요.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center justify-end w-full">
            <span className="flex items-center gap-1.5 text-sm font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
              바로가기 <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <Ambulance className="absolute -bottom-4 -right-4 w-32 h-32 text-red-500/10 dark:text-red-500/5 group-hover:scale-110 transition-transform duration-500" />
        </Link>

        {/* 의정부 사랑카드 가맹점 지도 카드 */}
        <Link 
          href="/services/local-currency"
          className="group relative overflow-hidden border border-blue-100 dark:border-blue-900/50 rounded-none p-6 sm:p-8 flex flex-col justify-between h-[200px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 hover:-translate-y-1"
        >
          <MiniMapPreview type="currency" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
              의정부 사랑카드 (지역화폐) <br className="hidden sm:block" />가맹점 지도
            </h3>
            <p className="text-[14px] sm:text-[15px] font-medium text-blue-900/70 dark:text-blue-300/70 break-keep max-w-[85%]">
              내 주변에서 의정부 지역화폐를 사용할 수 있는 착한 가맹점들을 한눈에 찾아보세요.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-end w-full">
            <span className="flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              바로가기 <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          
          <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/10 dark:text-blue-500/5 group-hover:scale-110 transition-transform duration-500" />
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
