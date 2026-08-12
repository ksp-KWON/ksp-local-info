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
