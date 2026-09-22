import React from 'react';
import Link from 'next/link';
import AppIcon, { AppIconName } from '@/components/ui/AppIcon';
import { CIVIC_CATEGORIES, getCategoryIcon } from '@/lib/constants';
import { PostMeta, PostData } from '@/lib/types';

interface CivicCategoryGridProps {
  posts: (PostMeta | PostData)[];
}

interface CategoryMeta {
  name: string;
  tagline: string;
  subKeywords: string;
  icon: AppIconName;
}

const CATEGORY_METAS: CategoryMeta[] = [
  {
    name: '일자리·생활',
    tagline: '취업지원 & 생활민원',
    subKeywords: '일자리센터 · 공공근로 · 여권민원',
    icon: 'file-text',
  },
  {
    name: '교통·주차',
    tagline: '공영주차 & 교통정보',
    subKeywords: '주차요금감면 · 버스노선 · 단속안내',
    icon: 'car',
  },
  {
    name: '기업경제·농업',
    tagline: '상공인지원 & 입찰계약',
    subKeywords: '소상공인지원 · 공공입찰 · 법정계량',
    icon: 'bank',
  },
  {
    name: '체육·공원',
    tagline: '문화체육 & 힐링공원',
    subKeywords: '예술의전당 · 직동공원 · 거리예술제',
    icon: 'leaf',
  },
  {
    name: '청소·환경',
    tagline: '폐기물배출 & 자원순환',
    subKeywords: '대형폐기물 · 종량제봉투 · 분리수거',
    icon: 'trash',
  },
  {
    name: '주택·재개발',
    tagline: '주거환경 & 재개발정비',
    subKeywords: '공동주택관리 · 사랑의집 · 재개발',
    icon: 'home',
  },
  {
    name: '재난·민방위',
    tagline: '시민안전 & 비상대응',
    subKeywords: '시민안전보험 · 안심귀가 · 대피소',
    icon: 'shield-alert',
  },
  {
    name: '복지·돌봄',
    tagline: '영유아어르신 & 보건의료',
    subKeywords: '난임시술 · 응급의료 · 수도감면',
    icon: 'heart',
  },
];

export default function CivicCategoryGrid({ posts }: CivicCategoryGridProps) {
  // 카테고리별 포스트 수 집계
  const countMap: Record<string, number> = {};
  for (const post of posts) {
    if (post.category) {
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      for (const cat of cats) {
        countMap[cat] = (countMap[cat] || 0) + 1;
      }
    }
  }

  return (
    <section className="space-y-3.5">
      {/* 섹션 소제목 바 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-none shadow-2xs" />
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight">
            의정부시 공식 8대 분야 바로가기
          </h2>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          시청 누리집 1:1 직결 연계
        </span>
      </div>

      {/* 8대 분야 2x4 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORY_METAS.map((item) => {
          const count = countMap[item.name] || 0;
          return (
            <Link
              key={item.name}
              href={`/blog?category=${encodeURIComponent(item.name)}`}
              className="group relative flex flex-col justify-between p-4 sm:p-4.5 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.45)] hover:shadow-[0_0_35px_rgba(0,0,0,0.15),0_0_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_rgba(0,0,0,0.65),0_0_12px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all duration-200 overflow-hidden"
            >
              {/* 은은한 배경 워터마크 아이콘 */}
              <div className="absolute -right-3 -bottom-3 text-zinc-900/[0.04] dark:text-zinc-100/[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-300">
                <AppIcon name={item.icon} size={64} strokeWidth={1.5} />
              </div>

              <div>
                {/* 상단: 아이콘 + 카운트 배지 */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-none bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-950 transition-colors shadow-2xs">
                    <AppIcon name={item.icon} size={16} strokeWidth={2.2} />
                  </div>
                  {count > 0 ? (
                    <span className="px-2 py-0.5 text-[10.5px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-none">
                      {count}건
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                      준비중
                    </span>
                  )}
                </div>

                {/* 카테고리 명칭 및 태그라인 */}
                <h3 className="text-[14px] sm:text-[15px] font-extrabold text-zinc-950 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors tracking-tight">
                  {item.name}
                </h3>
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5 truncate">
                  {item.tagline}
                </p>
              </div>

              {/* 하단 세부 키워드 */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="truncate">{item.subKeywords}</span>
                <AppIcon
                  name="chevron-right"
                  size={12}
                  strokeWidth={2.5}
                  className="shrink-0 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
