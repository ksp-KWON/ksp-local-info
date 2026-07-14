'use client';

import Link from 'next/link';

type PostData = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
};

const getCategoryTheme = (category: string) => {
  if (category === '복지·지원금') {
    return {
      title: '💰 최신 복지·지원금 소식',
      headerBg: 'from-emerald-50 to-transparent dark:from-emerald-900/20 dark:to-transparent',
      titleColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-500 hover:shadow-[0_12px_40px_rgba(16,185,129,0.2)]',
      hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
    };
  }
  if (category === '행사·축제') {
    return {
      title: '🎉 우리동네 문화·행사',
      headerBg: 'from-yellow-50 to-transparent dark:from-yellow-900/20 dark:to-transparent',
      titleColor: 'text-yellow-600 dark:text-yellow-400',
      badge: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      hoverBorder: 'hover:border-yellow-500 hover:shadow-[0_12px_40px_rgba(234,179,8,0.2)]',
      hoverText: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
    };
  }
  if (category === '건강·의료') {
    return {
      title: '🏥 건강·의료 생활 정보',
      headerBg: 'from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent',
      titleColor: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      hoverBorder: 'hover:border-blue-500 hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]',
      hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
    };
  }
  return {
    title: '💡 꼭 알아야 할 생활 꿀팁',
    headerBg: 'from-gray-50 to-transparent dark:from-gray-800/20 dark:to-transparent',
    titleColor: 'text-gray-700 dark:text-gray-300',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    hoverBorder: 'hover:border-gray-500 hover:shadow-[0_12px_40px_rgba(107,114,128,0.2)]',
    hoverText: 'group-hover:text-gray-700 dark:group-hover:text-gray-300'
  };
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
            <div className="flex items-center justify-between mb-5 px-4 sm:px-5 py-3 sm:py-3.5 relative z-10">
              <div className={`flex items-center gap-2 bg-gradient-to-r ${theme.headerBg} px-3 sm:px-4 py-1.5 sm:py-2`}>
                <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${theme.titleColor}`}>
                  {theme.title}
                </h2>
              </div>
              <Link href={`/blog?category=${categoryId}`} className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors group">
                전체보기
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            </div>
            
            {/* 게시물 그리드 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {displayPosts.map(post => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.slug}
                  className={`group relative bg-white dark:bg-[#1e1f22] rounded-none overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col min-h-[160px] ${theme.hoverBorder}`}
                >
                  <div className="p-4 sm:p-5 flex flex-col justify-between h-full flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border border-transparent ${theme.badge}`}>
                        {post.category}
                      </span>
                      <time className="text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1 shrink-0">
                        🗓 {post.date}
                      </time>
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className={`text-sm sm:text-[15px] font-bold text-[#202124] dark:text-[#e8eaed] transition-colors line-clamp-2 leading-snug break-keep ${theme.hoverText}`}>
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed font-normal break-keep">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
