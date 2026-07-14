import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { RefreshCw, Ambulance, CreditCard } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData } from '@/lib/posts';
import HomePostList from '@/components/HomePostList';
import { Metadata } from 'next';
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
      <NeoBox shadowColor="blue" hoverEffect className="mt-4">
        <NeoHeading level={1} highlighterColor="blue" className="mb-3">
          의정부 주민 맞춤형 혜택·의료 포털
        </NeoHeading>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 break-keep leading-relaxed font-jua font-normal">
          의정부시의 유용한 생활 밀착 혜택과 주요 정책들을 전문가의 시선으로 큐레이션하여 제공합니다.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
          <NeoButton 
            href="/services/local-currency" 
            variant="primary" 
            icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
          >
            의정부사랑카드 사용처 지도
          </NeoButton>
          <NeoButton 
            href="/services/emergency" 
            variant="danger" 
            icon={<Ambulance className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
          >
            응급실/약국 찾기
          </NeoButton>
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
