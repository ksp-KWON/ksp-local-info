'use client';

import Link from 'next/link';
import { Coins, PartyPopper, Stethoscope, Lightbulb, Calendar } from 'lucide-react';
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

const getCategoryTheme = (category: string) => {
  if (category === '복지·지원금') {
    return { title: '최신 복지·지원금 소식', icon: <Coins className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />, color: 'green' as const };
  }
  if (category === '행사·축제') {
    return { title: '우리동네 문화·행사', icon: <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />, color: 'pink' as const };
  }
  if (category === '건강·의료') {
    return { title: '건강·의료 생활 정보', icon: <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />, color: 'blue' as const };
  }
  return { title: '꼭 알아야 할 생활 꿀팁', icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />, color: 'yellow' as const };
};

const CATEGORIES = [
  { id: '혜택', label: '복지·지원금', keywords: ['지원금', '혜택', '복지'] },
  { id: '행사', label: '행사·축제', keywords: ['행사', '축제', '문화'] },
  { id: '의료', label: '건강·의료', keywords: ['의료', '건강', '병원'] },
  { id: '정보', label: '생활정보', keywords: ['정보', '민원', '기타'] }
];

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {
  // 카테고리별 포스트 분류
  const categoriesWithPosts = CATEGORIES.map(cat => {
    const posts = initialPosts.filter(post => {
      if (!post.category) return false;
      return cat.keywords.some(keyword => post.category?.includes(keyword));
    });
    return { categoryId: cat.id, categoryLabel: cat.label, posts };
  }).filter(item => item.posts.length > 0);

  return (
    <div className="space-y-12">
      {categoriesWithPosts.map(({ categoryId, categoryLabel, posts }) => {
        const theme = getCategoryTheme(categoryLabel);
        const displayPosts = posts.slice(0, 3); // 3개 노출

        return (
          <section key={categoryId} className="relative">
            {/* 카테고리 헤더 */}
            <div className="flex items-center justify-between mb-5 px-4 sm:px-0 py-3 sm:py-3.5 relative z-10 border-b-4 border-black dark:border-white">
              <NeoHeading level={2} highlighterColor={theme.color} icon={theme.icon} className="!mb-0">
                {theme.title}
              </NeoHeading>
              <Link href={`/blog?category=${categoryId}`} className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-black dark:text-white hover:underline transition-colors group shrink-0 ml-4">
                전체보기
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            </div>
            
            {/* 게시물 그리드 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {displayPosts.map(post => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.slug}
                  className="group flex flex-col min-h-[160px]"
                >
                  <NeoBox shadowColor={theme.color} hoverEffect className="!p-4 sm:!p-5 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <NeoBadge color="gray">{post.category}</NeoBadge>
                      <time className="text-[11px] font-jua font-normal text-black dark:text-white flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" strokeWidth={3} />
                        {post.date}
                      </time>
                    </div>
                    <div className="min-w-0 flex-1 space-y-2 mt-2">
                      <h3 className="text-lg sm:text-xl font-jua font-normal tracking-wide text-black dark:text-white transition-colors line-clamp-2 leading-snug break-keep group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 font-bold line-clamp-2 leading-relaxed break-keep">
                        {post.summary}
                      </p>
                    </div>
                  </NeoBox>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
