import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSortedPostsData } from '@/lib/posts';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: '의정부 생활 소식 & 시정 혜택 백과 | 의정부 건강·생활 포털',
  description: '의정부시 지원금·복지 혜택, 달빛어린이병원·심야약국 의료 안내, 문화 축제 행사, 의정부사랑카드 가맹점 꿀팁을 전해드립니다.',
  alternates: {
    canonical: 'https://ksp-local-info-edg.pages.dev/blog',
  },
  openGraph: {
    title: '의정부 생활 소식 & 시정 혜택 백과 | 의정부 건강·생활 포털',
    description: '의정부시 지원금·복지 혜택, 달빛어린이병원·심야약국 의료 안내, 문화 축제 행사, 의정부사랑카드 가맹점 꿀팁을 전해드립니다.',
    url: 'https://ksp-local-info-edg.pages.dev/blog',
    siteName: '의정부 건강·생활 정보 포털',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '의정부 생활 소식 & 시정 혜택 백과 | 의정부 건강·생활 포털',
    description: '의정부시 맞춤 지원금, 응급의료, 문화행사, 생활교통 종합 가이드',
  },
};

function BlogFallback() {
  return (
    <div className="py-20 text-center">
      <div className="inline-block w-8 h-8 border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">의정부 생활 소식을 불러오는 중입니다...</p>
    </div>
  );
}

export default function BlogList() {
  const posts = getSortedPostsData();

  return (
    <div className="mx-auto w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-10">
      <Suspense fallback={<BlogFallback />}>
        <BlogClient initialPosts={posts} />
      </Suspense>
    </div>
  );
}

