'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import PremiumHeading from '@/components/ui/PremiumHeading';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import PostCard from '@/components/ui/PostCard';
import { PostData, PostMeta } from '@/lib/types';
import { UIJEONGBU_TAXONOMY, CivicCategoryDefinition, CivicSubCategory } from '@/data/uijeongbu-taxonomy';

interface CivicCategorySectionProps {
  posts: (PostMeta | PostData)[];
}

export default function CivicCategorySection({ posts }: CivicCategorySectionProps) {
  // 카테고리별 활성 하위 탭 상태 (기본값: '전체')
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});

  // 카테고리별 & 하위 카테고리별 포스트 인덱싱
  const { categoryPostsMap, subCategoryPostsMap } = useMemo(() => {
    const catMap: Record<string, (PostMeta | PostData)[]> = {};
    const subMap: Record<string, (PostMeta | PostData)[]> = {};

    for (const post of posts) {
      if (post.category) {
        const cats = Array.isArray(post.category) ? post.category : [post.category];
        for (const cat of cats) {
          if (!catMap[cat]) catMap[cat] = [];
          catMap[cat].push(post);
        }
      }

      if (post.subCategory) {
        if (!subMap[post.subCategory]) subMap[post.subCategory] = [];
        subMap[post.subCategory].push(post);
      }
    }

    return { categoryPostsMap: catMap, subCategoryPostsMap: subMap };
  }, [posts]);

  // 카테고리 우선순위 정렬 (공연 관련 '문화·예술' 1순위 보장)
  const CATEGORY_ORDER = [
    '문화·예술',
    '일자리·생활',
    '복지·돌봄',
    '교통·주차',
    '기업경제·농업',
    '청소·환경',
    '주택·재개발',
    '재난·민방위',
    '체육·공원',
  ];

  // 포스트가 등록된 카테고리를 우선순위 순서대로 정렬하여 표시
  const activeCategories = useMemo(() => {
    return UIJEONGBU_TAXONOMY.filter((cat) => (categoryPostsMap[cat.name] || []).length > 0).sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a.name);
      const idxB = CATEGORY_ORDER.indexOf(b.name);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });
  }, [categoryPostsMap]);

  // 최신 발행 소식 상위 3건
  const latestPosts = posts.slice(0, 3);

  const handleTabChange = (categoryName: string, tabName: string) => {
    setActiveTabs((prev) => ({
      ...prev,
      [categoryName]: tabName,
    }));
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 🚀 [최상단] 최신 의정부 생활 브리핑 위젯 */}
      {latestPosts.length > 0 && (
        <PremiumCard hoverEffect={false} watermarkIcon="sparkles" className="!p-0 overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-200/90 via-zinc-100/40 to-transparent dark:from-zinc-800/80 dark:via-zinc-800/20 dark:to-transparent border-b border-gray-200/90 dark:border-zinc-800 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-none bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-2xs">
                <AppIcon name="sparkles" size={17} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight truncate">
                    최신 의정부 생활 브리핑
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold bg-zinc-200/80 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 rounded-none">
                    전체 {posts.length}건
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal truncate mt-0.5">
                  의정부 시민이 지금 가장 많이 찾는 최신 생활·의료 소식입니다.
                </p>
              </div>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-bold rounded-none shadow-xs hover:shadow transition-all shrink-0 group/btn"
            >
              <span>전체 소식</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 relative z-10">
            {latestPosts.map((post) => {
              const mainCat = Array.isArray(post.category) ? post.category[0] : post.category || '일자리·생활';
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group/row flex items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 transition-all border-l-4 border-l-transparent hover:border-l-zinc-900 dark:hover:border-l-zinc-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="shrink-0 px-2 py-0.5 text-[11px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                      {mainCat}
                    </span>
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 group-hover/row:text-zinc-950 dark:group-hover/row:white truncate leading-snug">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <time className="text-[11.5px] sm:text-xs font-medium text-zinc-400 dark:text-zinc-500">
                      {post.date.substring(5)}
                    </time>
                    <AppIcon
                      name="chevron-right"
                      size={14}
                      strokeWidth={2}
                      className="text-zinc-400 group-hover/row:text-zinc-900 dark:group-hover/row:text-zinc-100 group-hover/row:translate-x-0.5 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </PremiumCard>
      )}
      {activeCategories.map((catDef) => {
        const categoryPosts = categoryPostsMap[catDef.name] || [];
        const currentTab = activeTabs[catDef.name] || '전체';

        // 현재 선택된 탭에 따라 노출할 포스트 결정 (섹션별 2개 고정)
        const displayPosts = (
          currentTab === '전체'
            ? categoryPosts
            : subCategoryPostsMap[currentTab] || []
        ).slice(0, 2);

        // 현재 선택된 하위 카테고리 정보
        const currentSubDef =
          currentTab !== '전체'
            ? catDef.subCategories.find((s) => s.name === currentTab)
            : undefined;

        return (
          <section key={catDef.name} className="space-y-4">
            {/* 1. 카테고리별 대제목 (공통 컴포넌트 PremiumHeading) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-200/90 dark:border-zinc-800">
              <div className="min-w-0">
                <PremiumHeading
                  level={2}
                  icon={<AppIcon name={catDef.icon} size={22} strokeWidth={2.5} />}
                  className="!my-0 !py-1 !bg-transparent !border-l-4 !border-l-zinc-950 dark:!border-l-white pl-3"
                >
                  <span className="flex items-center gap-2">
                    <span>{catDef.name}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
                      — {catDef.tagline}
                    </span>
                  </span>
                </PremiumHeading>
              </div>

              {/* 우측 공통 버튼: 전체보기 */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <PremiumButton
                  href={`/blog?category=${encodeURIComponent(catDef.name)}`}
                  variant="outline"
                  size="xs"
                  icon="chevron-right"
                  iconPosition="right"
                >
                  {catDef.name} 전체 ({categoryPosts.length}건)
                </PremiumButton>
              </div>
            </div>

            {/* 2. 대제목 밑 하위 카테고리 탭버튼 (네이버 뉴스·라이프 판 스타일) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {/* 전체 탭 */}
              <button
                type="button"
                onClick={() => handleTabChange(catDef.name, '전체')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-none border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  currentTab === '전체'
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 font-extrabold'
                    : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 font-bold'
                }`}
              >
                <span>전체보기</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-none font-bold ${
                    currentTab === '전체'
                      ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {categoryPosts.length}
                </span>
              </button>

              {/* 하위 카테고리 탭 버튼들 */}
              {catDef.subCategories.map((sub) => {
                const subPosts = subCategoryPostsMap[sub.name] || [];
                const subCount = subPosts.length;
                const isSelected = currentTab === sub.name;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleTabChange(catDef.name, sub.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-none border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                      isSelected
                        ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 font-extrabold'
                        : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 font-bold'
                    }`}
                  >
                    <span>{sub.shortName}</span>
                    {subCount > 0 ? (
                      <span
                        className={`text-[10px] px-1 py-0.2 rounded-none font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {subCount}
                      </span>
                    ) : (
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-normal">
                        시청직결
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3. 그 아래 포스팅 박스 배치 (공통 컴포넌트 PostCard / PremiumCard) */}
            {displayPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {displayPosts.map((post) => (
                  <PostCard key={post.slug} post={post} variant="grid" />
                ))}
              </div>
            ) : (
              /* 포스트가 아직 없는 하위 카테고리 선택 시 시청 공식 안내 배너 */
              <PremiumCard hoverEffect={false} watermarkIcon="compass" className="!p-5 sm:!p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shrink-0">
                      <AppIcon name="info" size={18} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white">
                        ‘{currentTab}’ 관련 행정 정보
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        {currentSubDef?.description ||
                          '의정부시청 공식 누리집을 통해 실시간 행정 소식과 신청 절차를 확인하실 수 있습니다.'}
                      </p>
                    </div>
                  </div>

                  {currentSubDef?.officialUrl && (
                    <div className="shrink-0 self-end sm:self-center">
                      <PremiumButton
                        href={currentSubDef.officialUrl}
                        isExternal={true}
                        variant="primary"
                        size="sm"
                        icon="external-link"
                        iconPosition="right"
                      >
                        시청 공식 누리집 바로가기
                      </PremiumButton>
                    </div>
                  )}
                </div>
              </PremiumCard>
            )}

            {/* 4. 전체보기 추가 버튼 (카테고리에 포스트가 2개 초과이고 '전체' 탭일 때) */}
            {currentTab === '전체' && categoryPosts.length > 2 && (
              <div className="pt-1 flex justify-center">
                <PremiumButton
                  href={`/blog?category=${encodeURIComponent(catDef.name)}`}
                  variant="outline"
                  size="sm"
                  icon="chevron-right"
                  iconPosition="right"
                >
                  ‘{catDef.name}’ 가이드 포스트 {categoryPosts.length - 2}건 더보기
                </PremiumButton>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
