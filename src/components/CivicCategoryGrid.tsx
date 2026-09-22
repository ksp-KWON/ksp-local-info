'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppIcon, { AppIconName } from '@/components/ui/AppIcon';
import { PostMeta, PostData } from '@/lib/types';
import { UIJEONGBU_TAXONOMY, CivicCategoryDefinition, CivicSubCategory } from '@/data/uijeongbu-taxonomy';

interface CivicCategoryGridProps {
  posts: (PostMeta | PostData)[];
}

export default function CivicCategoryGrid({ posts }: CivicCategoryGridProps) {
  // 기본적으로 글이 가장 풍부한 대표 카테고리들을 펼쳐둡니다.
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '일자리·생활': true,
    '문화·예술': true,
    '복지·돌봄': false,
  });

  // 카테고리별 & 하위 카테고리별 포스트 매핑 인덱스 구축
  const { categoryPostCount, subCategoryPostsMap } = useMemo(() => {
    const catCount: Record<string, number> = {};
    const subMap: Record<string, (PostMeta | PostData)[]> = {};

    for (const post of posts) {
      // 1. 상위 카테고리 집계
      if (post.category) {
        const cats = Array.isArray(post.category) ? post.category : [post.category];
        for (const cat of cats) {
          catCount[cat] = (catCount[cat] || 0) + 1;
        }
      }

      // 2. 하위 카테고리 집계
      if (post.subCategory) {
        if (!subMap[post.subCategory]) {
          subMap[post.subCategory] = [];
        }
        subMap[post.subCategory].push(post);
      }
    }

    return { categoryPostCount: catCount, subCategoryPostsMap: subMap };
  }, [posts]);

  // 개별 카테고리 아코디언 토글
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // 전체 펼치기 / 접기
  const allExpanded = useMemo(() => {
    return UIJEONGBU_TAXONOMY.every((c) => expandedCategories[c.name]);
  }, [expandedCategories]);

  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    for (const cat of UIJEONGBU_TAXONOMY) {
      updated[cat.name] = nextState;
    }
    setExpandedCategories(updated);
  };

  // 퀵 내비게이션 클릭 시 해당 카테고리 펼치고 스크롤 이동
  const handleQuickJump = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: true,
    }));
    const el = document.getElementById(`category-section-${categoryName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="space-y-4">
      {/* 1. 섹션 헤더 & 전체 펼치기/접기 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-none shadow-2xs" />
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight">
            의정부시 공식 9대 분야 및 세부 행정 가이드
          </h2>
          <span className="hidden sm:inline-block text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
            시청 누리집 1:1 직결
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-none shadow-2xs"
          >
            <AppIcon name={allExpanded ? 'chevron-up' : 'chevron-down'} size={13} strokeWidth={2.2} />
            <span>{allExpanded ? '전체 아코디언 접기' : '전체 아코디언 펼치기'}</span>
          </button>
        </div>
      </div>

      {/* 2. 상단 9대 분야 퀵 탭 바 (Quick Filter Chips) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {UIJEONGBU_TAXONOMY.map((cat) => {
          const count = categoryPostCount[cat.name] || 0;
          const isOpen = !!expandedCategories[cat.name];
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleQuickJump(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all border rounded-none shadow-2xs ${
                isOpen
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <AppIcon name={cat.icon} size={13} strokeWidth={2} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-none font-extrabold ${
                  isOpen
                    ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. 9대 분야 아코디언 스택 */}
      <div className="space-y-3">
        {UIJEONGBU_TAXONOMY.map((categoryDef) => {
          const isOpen = !!expandedCategories[categoryDef.name];
          const postCount = categoryPostCount[categoryDef.name] || 0;

          return (
            <div
              key={categoryDef.name}
              id={`category-section-${categoryDef.name}`}
              className="bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.45)] transition-all overflow-hidden"
            >
              {/* 카테고리 아코디언 헤더 (클릭 시 토글) */}
              <button
                type="button"
                onClick={() => toggleCategory(categoryDef.name)}
                className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors focus:outline-hidden"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* 카테고리 아이콘 큐브 */}
                  <div
                    className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-none border transition-colors shadow-2xs ${
                      isOpen
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-700'
                    }`}
                  >
                    <AppIcon name={categoryDef.icon} size={18} strokeWidth={2.2} />
                  </div>

                  {/* 명칭 & 태그라인 */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] sm:text-[16px] font-extrabold text-zinc-950 dark:text-white tracking-tight">
                        {categoryDef.name}
                      </h3>
                      {postCount > 0 ? (
                        <span className="px-1.5 py-0.5 text-[10.5px] font-extrabold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-none">
                          {postCount}건
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                          시청 직결
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {categoryDef.tagline}
                    </p>
                  </div>
                </div>

                {/* 우측 인디케이터 */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                    {isOpen ? '접기' : '하위 카테고리 보기'}
                  </span>
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-zinc-900 dark:text-zinc-100' : ''
                    }`}
                  >
                    <AppIcon name="chevron-down" size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </button>

              {/* 아코디언 바디 (하위 카테고리 및 분류된 글 목록) */}
              {isOpen && (
                <div className="border-t border-gray-100 dark:border-zinc-800/90 bg-zinc-50/50 dark:bg-[#151619] p-4 sm:p-5 space-y-4">
                  {/* 상단 퀵 액션 링크 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/70 dark:border-zinc-800 text-xs">
                    <span className="font-bold text-zinc-600 dark:text-zinc-400">
                      공식 하위 행정 분야 ({categoryDef.subCategories.length}개 분야)
                    </span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blog?category=${encodeURIComponent(categoryDef.name)}`}
                        className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white underline underline-offset-4 flex items-center gap-1"
                      >
                        <span>{categoryDef.name} 전체 글 모아보기</span>
                        <AppIcon name="chevron-right" size={12} strokeWidth={2.5} />
                      </Link>
                      <a
                        href={categoryDef.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 font-medium"
                      >
                        <span>시청 누리집</span>
                        <AppIcon name="external-link" size={11} strokeWidth={2} />
                      </a>
                    </div>
                  </div>

                  {/* 하위 카테고리별 분류 목록 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {categoryDef.subCategories.map((sub) => {
                      const subPosts = subCategoryPostsMap[sub.name] || [];
                      const hasPosts = subPosts.length > 0;

                      return (
                        <div
                          key={sub.id}
                          className="bg-white dark:bg-[#1c1e22] border border-gray-200/90 dark:border-zinc-800/90 p-3.5 rounded-none shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* 하위 카테고리 제목 헤더 */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 bg-zinc-900 dark:bg-zinc-100 rounded-none shrink-0" />
                                  <h4 className="text-[13.5px] font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
                                    {sub.name}
                                  </h4>
                                </div>
                                <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                  {sub.description}
                                </p>
                              </div>

                              {hasPosts ? (
                                <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-none">
                                  {subPosts.length}건
                                </span>
                              ) : (
                                <span className="shrink-0 px-1.5 py-0.5 text-[9.5px] font-medium text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-none">
                                  시청 직결
                                </span>
                              )}
                            </div>

                            {/* 분류된 포스트 목록 (존재할 경우) */}
                            {hasPosts ? (
                              <ul className="mt-2.5 space-y-1.5 border-t border-gray-100 dark:border-zinc-800/80 pt-2">
                                {subPosts.map((post) => (
                                  <li key={post.slug}>
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      className="group/item flex items-center justify-between gap-2 py-1 px-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-none transition-colors"
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <AppIcon
                                          name="file-text"
                                          size={12}
                                          strokeWidth={2}
                                          className="text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100 shrink-0"
                                        />
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover/item:text-zinc-950 dark:group-hover/item:white truncate">
                                          {post.title}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-zinc-400 shrink-0 whitespace-nowrap">
                                        {post.date}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500 border-t border-gray-100 dark:border-zinc-800/80 pt-2">
                                현재 발행 준비 중인 행정 안내 분야입니다.
                              </div>
                            )}
                          </div>

                          {/* 하단 시청 공식 안내 직통 버튼 */}
                          <div className="mt-2.5 pt-2 border-t border-gray-100/80 dark:border-zinc-800/60 flex items-center justify-end">
                            <a
                              href={sub.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10.5px] font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1 group/link"
                            >
                              <span>공식 안내 누리집</span>
                              <AppIcon
                                name="external-link"
                                size={10}
                                strokeWidth={2.2}
                                className="group-hover/link:translate-x-0.5 transition-transform"
                              />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
