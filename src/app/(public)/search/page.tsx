'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import PostCard from '@/components/ui/PostCard';
import AppIcon from '@/components/ui/AppIcon';
import { PostData } from '@/lib/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to fetch');
        const allPosts: PostData[] = await res.json();

        const query = q.toLowerCase().trim();
        const filtered = allPosts.filter((post) => {
          const titleMatch = post.title.toLowerCase().includes(query);
          const summaryMatch = (post.summary || '').toLowerCase().includes(query);
          const tagsMatch = (post.tags || []).some((tag) => tag.toLowerCase().includes(query));
          const catMatch = Array.isArray(post.category)
            ? post.category.some((c) => c.toLowerCase().includes(query))
            : (post.category || '').toLowerCase().includes(query);
          return titleMatch || summaryMatch || tagsMatch || catMatch;
        });

        setResults(filtered);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [q]);

  const popularKeywords = ['청년', '지원금', '병원', '약국', '사랑카드', '이사비', '건강검진', '출산'];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. 검색 인트로 헤더 (모던 수묵 & 굵은 라인 SVG 스타일) */}
      <div className="mt-4 relative overflow-hidden rounded-none border-2 border-black dark:border-white bg-white dark:bg-[#181a1d] shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] p-6 sm:p-8 group">
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="search" size={160} strokeWidth={2} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider mb-3 border-2 border-black dark:border-white rounded-none">
            <AppIcon name="search" size={14} strokeWidth={2.5} />
            <span>통합 검색 센터</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
            {q ? (
              <span>
                ‘<span className="underline decoration-2">{q}</span>’ 검색 결과
              </span>
            ) : (
              '의정부 생활정보 검색'
            )}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            {q ? `총 ${results.length}개의 관련 소식을 찾았습니다.` : '찾으시는 혜택, 병원, 지원금 키워드를 입력해 보세요.'}
          </p>

          {/* 추천 키워드 칩 (수묵 흑백 칩) */}
          <div className="mt-5 flex items-center flex-wrap gap-1.5 pt-4 border-t-2 border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-black text-zinc-500 mr-1 flex items-center gap-1">
              <AppIcon name="zap" size={12} strokeWidth={2.5} />
              인기 키워드:
            </span>
            {popularKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="px-2.5 py-1 text-xs font-bold rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all"
              >
                #{kw}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 결과 목록 */}
      {isLoading ? (
        <div className="p-16 text-center border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a1d]">
          <AppIcon name="refresh" size={32} strokeWidth={2.5} className="animate-spin mx-auto text-zinc-500 mb-3" />
          <p className="text-sm font-black text-zinc-600 dark:text-zinc-400">데이터를 검색하고 있습니다...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} variant="grid" />
          ))}
        </div>
      ) : q ? (
        <div className="p-16 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#181a1d]">
          <AppIcon name="search" size={40} strokeWidth={2} className="mx-auto text-zinc-400 mb-3" />
          <h3 className="text-lg font-black text-black dark:text-white mb-1">검색 결과가 없습니다</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto break-keep">
            단어의 철자가 정확한지 확인하시거나 다른 유사 검색어로 다시 시도해 보세요.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/blog"
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-black text-xs border-2 border-black dark:border-white"
            >
              전체 소식 보기
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-zinc-500">검색 엔진 로딩 중...</div>}>
      <SearchResults />
    </Suspense>
  );
}
