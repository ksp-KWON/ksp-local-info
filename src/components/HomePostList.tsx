'use client';

import React from 'react';
import Link from 'next/link';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PremiumCard from '@/components/ui/PremiumCard';
import { PostData, PostMeta } from '@/lib/types';

interface HomePostListProps {
  initialPosts: (PostMeta | PostData)[];
}

interface MasterChapter {
  id: string;
  categoryName: string;
  title: string;
  desc: string;
  icon: AppIconName;
  watermarkIcon: AppIconName;
}

const MASTER_CHAPTERS: MasterChapter[] = [
  {
    id: 'welfare',
    categoryName: '복지·돌봄',
    title: '복지 & 돌봄 지원',
    desc: '의정부시 영유아·난임, 어르신 노인복지 및 안심 병원·의료 혜택 안내입니다.',
    icon: 'heart',
    watermarkIcon: 'heart',
  },
  {
    id: 'traffic',
    categoryName: '교통·주차',
    title: '교통정보 & 공영주차',
    desc: '공영주차장 요금 감면, 거주자우선주차 및 시내버스·지하철 노선 안내입니다.',
    icon: 'car',
    watermarkIcon: 'car',
  },
  {
    id: 'environment',
    categoryName: '청소·환경',
    title: '청소 & 자원순환',
    desc: '대형폐기물 스티커 수수료, 종량제봉투 배출 및 재활용 분리수거 기준입니다.',
    icon: 'trash',
    watermarkIcon: 'trash',
  },
  {
    id: 'housing',
    categoryName: '주택·재개발',
    title: '주택 & 도시재개발',
    desc: '공동주택 관리인 신고, 주거환경 개선 집수리 및 주택정비사업 안내입니다.',
    icon: 'home',
    watermarkIcon: 'home',
  },
  {
    id: 'safety',
    categoryName: '재난·민방위',
    title: '재난안전 & 민방위',
    desc: '의정부시민 안전보험 보상금, 안심귀가 동행 및 비상대피시설 안내입니다.',
    icon: 'shield-alert',
    watermarkIcon: 'shield-alert',
  },
  {
    id: 'sports',
    categoryName: '체육·공원',
    title: '체육시설 & 힐링공원',
    desc: '직동·추동공원 산책로, 공공체육시설 대관 및 문화예술 버스킹 축제 소식입니다.',
    icon: 'leaf',
    watermarkIcon: 'leaf',
  },
  {
    id: 'economy',
    categoryName: '기업경제·농업',
    title: '기업경제 & 상공농업',
    desc: '소상공인 지원금, 공공입찰·수의계약 등록 및 법정계량기 정기검사 안내입니다.',
    icon: 'bank',
    watermarkIcon: 'bank',
  },
  {
    id: 'jobs',
    categoryName: '일자리·생활',
    title: '일자리 & 시민생활',
    desc: '의정부 일자리센터 채용공고, 맞춤 취업지원 및 야간민원실 생활 편의입니다.',
    icon: 'file-text',
    watermarkIcon: 'file-text',
  },
];

export default function HomePostList({ initialPosts }: HomePostListProps) {
  if (!initialPosts || initialPosts.length === 0) return null;

  // 1. 최신 발행 소식 (카테고리 불문 상위 3개)
  const latestPosts = initialPosts.slice(0, 3);

  // 2. 5대 공식 마스터 챕터별 1:1 매핑
  const chaptersWithPosts = MASTER_CHAPTERS.map((chapter) => {
    const matched = initialPosts.filter((post) => {
      if (!post.category) return false;
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      return cats.some((cat) => cat === chapter.categoryName || cat.includes(chapter.categoryName));
    });

    return {
      ...chapter,
      totalCount: matched.length,
      posts: matched.slice(0, 3),
    };
  }).filter((ch) => ch.posts.length > 0);

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 🚀 [섹션 1] 최신 의정부 생활 브리핑 위젯 카드 */}
      {latestPosts.length > 0 && (
        <PremiumCard
          hoverEffect={false}
          watermarkIcon="sparkles"
          className="!p-0 overflow-hidden"
        >
          {/* 위젯 헤더 */}
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
                    전체 {initialPosts.length}건
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal truncate mt-0.5">
                  의정부 시민이 지금 가장 많이 찾는 최신 생활·의료 소식입니다.
                </p>
              </div>
            </div>

            {/* 눈에 띄는 포인트 컬러 '전체 소식 보기' 배지 버튼 */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-bold rounded-none shadow-xs hover:shadow transition-all shrink-0 group/btn"
            >
              <span>전체 소식</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 슬림 칸(Row) 분할 리스트 */}
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

      {/* 🏛️ [섹션 2~6] 5대 공식 마스터 챕터 위젯 카드 */}
      {chaptersWithPosts.map((chapter) => (
        <PremiumCard
          key={chapter.id}
          hoverEffect={false}
          watermarkIcon={chapter.watermarkIcon}
          className="!p-0 overflow-hidden"
        >
          {/* 위젯 헤더 */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/60 dark:via-zinc-800/20 dark:to-transparent border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-none bg-white dark:bg-zinc-800 border border-gray-200/90 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-2xs">
                <AppIcon name={chapter.icon} size={17} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight truncate">
                    {chapter.title}
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold bg-zinc-200/70 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 rounded-none">
                    {chapter.totalCount}건
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal truncate mt-0.5">
                  {chapter.desc}
                </p>
              </div>
            </div>

            {/* 눈에 띄는 포인트 컬러 '전체보기 (N건)' 배지 버튼 */}
            <Link
              href={`/blog?category=${encodeURIComponent(chapter.categoryName)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-bold rounded-none shadow-xs hover:shadow transition-all shrink-0 group/btn"
            >
              <span>전체보기</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 내부 행(Row) 리스트 - divide-y로 정밀 칸 분할 */}
          <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 relative z-10">
            {chapter.posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group/row flex items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 transition-all border-l-4 border-l-transparent hover:border-l-zinc-900 dark:hover:border-l-zinc-100"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-[10px] text-zinc-400 group-hover/row:text-zinc-900 dark:group-hover/row:text-zinc-100 shrink-0 font-bold select-none leading-none">
                    ▪
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
            ))}
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}
