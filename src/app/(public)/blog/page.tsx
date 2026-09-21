import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSortedPostsData } from '@/lib/posts';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: '의정부 생활 가이드',
  description: '응급실 안내와 국가건강검진, 민원 등 의정부 생활 가이드를 전해드립니다.',
  alternates: {
    canonical: 'https://ksp-local-info-edg.pages.dev/blog',
  },
  openGraph: {
    title: '의정부 생활 가이드 | 의정부 건강·생활 포털',
    description: '응급실 안내와 국가건강검진, 민원 등 의정부 생활 가이드를 전해드립니다.',
    url: 'https://ksp-local-info-edg.pages.dev/blog',
    siteName: '의정부 건강·생활 정보 포털',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '의정부 생활 가이드 | 의정부 건강·생활 포털',
    description: '응급의료, 국가건강검진, 민원 등 의정부 생활 가이드',
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
    <div className="w-full space-y-6">
      <Suspense fallback={<BlogFallback />}>
        <BlogClient initialPosts={posts} />
      </Suspense>
    </div>
  );
}

