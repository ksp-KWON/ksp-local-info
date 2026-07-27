import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { RefreshCw, Ambulance, CreditCard } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';
import Image from 'next/image';
import NeoBox from '@/components/ui/NeoBox';
import NeoHeading from '@/components/ui/NeoHeading';
import NeoButton from '@/components/ui/NeoButton';

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
      
      {/* 1. 메인 페이지 인트로 헤더 (Neo-brutalism 스타일) */}
      <NeoBox shadowColor="blue" hoverEffect className="mt-4 relative overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* 로고 (좌측) */}
          <div className="shrink-0 w-full md:w-auto flex justify-center items-center self-stretch relative">
            {/* 이미지 원본의 미세한 회색 테두리를 없애기 위해 clip-path로 가장자리 2px을 잘라냅니다 */}
            <Image 
              src="/images/uijeongbu-logo.png" 
              alt="의정부 행복특별시 마크" 
              width={200} 
              height={200} 
              className="w-32 md:w-auto md:h-full min-h-[120px] object-contain"
              style={{ clipPath: 'inset(2px)' }}
              priority
            />
          </div>

          {/* 텍스트 (중앙) */}
          <div className="flex-1 text-center md:text-left">
            <NeoHeading level={1} highlighterColor="blue" className="mb-3">
              의정부 주민 맞춤형 혜택·의료 포털
            </NeoHeading>
            <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 break-keep leading-relaxed font-jua font-normal">
              의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 제공합니다.
            </p>
          </div>

          {/* 버튼 영역 (우측, 수직 정렬) */}
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <NeoButton 
              href="/services/emergency" 
              variant="danger" 
              icon={<Ambulance className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
              className="w-full justify-center"
            >
              응급실/약국 찾기
            </NeoButton>
            <NeoButton 
              href="/services/local-currency" 
              variant="primary" 
              icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
              className="w-full justify-center"
            >
              의정부사랑카드 사용처 지도
            </NeoButton>
          </div>

        </div>
      </NeoBox>

      {/* 2. 블로그 콘텐츠 큐레이션 리스트 */}
      <HomePostList initialPosts={posts} />

      {/* 광고 영역 */}
      <div className="py-8">
        <AdBanner slot="home-middle-ad" />
      </div>
      
    </div>
  );
}
