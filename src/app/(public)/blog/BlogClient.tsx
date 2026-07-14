'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import NeoBox from '@/components/ui/NeoBox';
import NeoHeading from '@/components/ui/NeoHeading';
import NeoBadge from '@/components/ui/NeoBadge';

type PostData = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
};

const CATEGORIES = [
  { id: '혜택', title: '복지·지원금 소식', desc: '의정부시의 다양한 복지 및 지원금 혜택을 모아보세요.', keywords: ['지원금', '혜택', '복지'] },
  { id: '행사', title: '문화·행사 소식', desc: '의정부시 지역 행사와 축제 소식을 모아보세요.', keywords: ['행사', '축제', '문화'] },
  { id: '의료', title: '건강·의료 소식', desc: '의정부시의 건강 및 의료 관련 정보를 모아보세요.', keywords: ['의료', '건강', '병원'] },
  { id: '정보', title: '생활정보 소식', desc: '의정부시의 유용한 생활 및 민원 정보를 모아보세요.', keywords: ['정보', '민원', '기타'] }
];

function BlogClientContent({ initialPosts }: { initialPosts: PostData[] }) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Hydration 불일치를 막기 위해, 마운트 되기 전(SSR/SSG 단계)에는 전체 글을 렌더링
  let posts = initialPosts;
  let categoryTitle = '유용한 소식 및 생활 정보';
  let categoryDesc = '의정부시와 관련된 유용한 정보와 생활 소식을 정리하여 제공합니다.';

  if (mounted && categoryId) {
    const matchedCategory = CATEGORIES.find(c => c.id === categoryId);
    if (matchedCategory) {
      categoryTitle = matchedCategory.title;
      categoryDesc = matchedCategory.desc;
      posts = posts.filter(post => {
        if (!post.category) return false;
        return matchedCategory.keywords.some(keyword => post.category?.includes(keyword));
      });
    } else {
      // 키워드 직접 매칭 폴백
      categoryTitle = `${categoryId} 소식`;
      categoryDesc = `의정부시의 다양한 ${categoryId} 관련 정보를 모아보세요.`;
      posts = posts.filter((post) => post.category?.includes(categoryId));
    }
  }

  return (
    <div className="space-y-8 sm:px-0 pb-16">
      {/* 블로그 페이지 헤더 */}
      <NeoBox shadowColor="blue" hoverEffect className="mt-4 border-b-0">
        <NeoHeading level={1} highlighterColor="blue" className="mb-3">
          {categoryTitle}
        </NeoHeading>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 break-keep leading-relaxed font-jua font-normal">
          {categoryDesc}
        </p>
      </NeoBox>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col min-h-[160px]"
          >
            <NeoBox shadowColor="blue" hoverEffect className="!p-4 sm:!p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
                  <NeoBadge color="gray">
                    {post.category || '정보'}
                  </NeoBadge>
                  <time className="text-[11px] font-jua font-normal text-black dark:text-white flex items-center gap-1 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {post.date}
                  </time>
                </div>
                <div className="min-w-0 flex-1 space-y-2 mt-2">
                  <h3 className="text-lg sm:text-xl font-dohyeon font-normal tracking-wide text-black dark:text-white transition-colors line-clamp-2 leading-snug break-keep group-hover:underline">
                    <span className="highlighter-blue">{post.title}</span>
                  </h3>
                  <p className="text-[13px] sm:text-[14px] font-jua font-normal text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed break-keep">
                    {post.summary}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t-2 border-black dark:border-white flex items-center justify-end gap-2">
                <span className="shrink-0 text-sm font-dohyeon tracking-wide text-black dark:text-white group-hover:underline transition-colors flex items-center gap-1 ml-auto">
                  자세히 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </NeoBox>
          </Link>
        ))}

        {mounted && posts.length === 0 && (
          <NeoBox shadowColor="gray" className="text-center py-16 px-4 sm:p-16 col-span-full">
            <svg className="w-12 h-12 text-black dark:text-white mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 19h6"></path><path d="M10 15h8"></path><path d="M10 19h8"></path></svg>
            <p className="text-lg font-dohyeon tracking-wide text-black dark:text-white">
              해당 카테고리에 등록된 포스팅이 없습니다.
            </p>
          </NeoBox>
        )}
      </div>
    </div>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: PostData[] }) {
  return (
    <Suspense fallback={
      <div className="space-y-8 sm:px-0 pb-16 text-center text-gray-500 font-jua">
        불러오는 중...
      </div>
    }>
      <BlogClientContent initialPosts={initialPosts} />
    </Suspense>
  );
}
