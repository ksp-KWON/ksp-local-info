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
        if (res.ok) {
          const allPosts: PostData[] = await res.json();
          const query = q.toLowerCase().trim();
          const filtered = allPosts.filter((post) => {
            const titleMatch = post.title?.toLowerCase().includes(query);
            const summaryMatch = post.summary?.toLowerCase().includes(query);
            const contentMatch = post.content?.toLowerCase().includes(query);
            const categoryMatch = Array.isArray(post.category)
              ? post.category.some((c) => c.toLowerCase().includes(query))
              : post.category?.toLowerCase().includes(query);
            return titleMatch || summaryMatch || contentMatch || categoryMatch;
          });
          setResults(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch posts for search', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [q]);

  const displayResults = q ? results : [];
  const displayLoading = q ? isLoading : false;

  return (
    <div className="w-full space-y-6 sm:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 py-8">
      {/* 1. 상단 브레드크럼 */}
      <nav className="flex text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li className="text-gray-900 dark:text-white font-bold" aria-current="page">
            통합 검색
          </li>
        </ol>
      </nav>

      {/* 2. 헤더 섹션 */}
      <div className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 rounded-none shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-none border border-blue-100 dark:border-blue-800/40">
            <AppIcon name="search" size={18} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            {q ? `"${q}" 검색 결과` : '의정부 생활정보 통합 검색'}
          </h1>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 break-keep">
          {q
            ? `입력하신 키워드 "${q}"와 일치하는 시정 복지 지원금, 의료/약국, 생활 혜택 안내입니다.`
            : '궁금하신 지원금, 병원/약국, 청년/육아 혜택 등의 키워드를 입력해 보세요.'}
        </p>
        {q && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
            <span className="text-blue-600 dark:text-blue-400">
              {displayLoading ? '검색 중입니다...' : `총 ${displayResults.length}건이 발견되었습니다.`}
            </span>
          </div>
        )}
      </div>

      {/* 3. 검색 결과 목록 */}
      {!displayLoading && (
        <div className="space-y-4">
          {displayResults.length > 0 ? (
            displayResults.map((post) => <PostCard key={post.slug} post={post} variant="list" />)
          ) : (
            <div className="bg-white dark:bg-[#181a1d] border border-gray-200/80 dark:border-zinc-800 p-10 sm:p-14 text-center rounded-none shadow-md">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-none">
                  <AppIcon name="search" size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {q ? `"${q}"에 대한 일치하는 소식을 찾을 수 없습니다.` : '검색어를 입력해 주세요.'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed font-medium break-keep">
                  단어의 철자가 정확한지 확인하시거나, 보다 일반적인 키워드(예: 이사비, 청년, 사랑카드, 임산부)로 다시 검색해 보세요.
                </p>
                <div className="pt-2">
                  <Link
                    href="/blog"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors rounded-none"
                  >
                    <span>전체 생활소식 둘러보기</span>
                    <AppIcon name="chevron-right" size={13} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500 font-bold">검색 엔진을 로드하고 있습니다...</div>}>
      <SearchResults />
    </Suspense>
  );
}
