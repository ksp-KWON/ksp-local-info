'use client';

import React from 'react';
import Link from 'next/link';
import SidebarTagMore from './SidebarTagMore';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

interface SidebarContentProps {
  tags?: string[];
}

interface CivicQuickMenuItem {
  href: string;
  icon: AppIconName;
  title: string;
  subtitle: string;
  badge: string;
}

const CIVIC_QUICK_MENUS: CivicQuickMenuItem[] = [
  {
    href: '/services/emergency',
    icon: 'hospital',
    title: '달빛어린이병원 & 심야약국',
    subtitle: '야간·휴일 응급의료 실시간 지도',
    badge: '실시간',
  },
  {
    href: '/services/local-currency',
    icon: 'bank',
    title: '의정부사랑카드 가맹점',
    subtitle: '지역화폐 6~10% 인센티브 사용처',
    badge: '가맹점',
  },
  {
    href: '/services/health-check',
    icon: 'stethoscope',
    title: '국가 무료 건강검진 기관',
    subtitle: '일반·암·구강검진 지정병원 안내',
    badge: '지정병원',
  },
  {
    href: `/blog?category=${encodeURIComponent('숨은 지원금 찾기')}`,
    icon: 'shield-check',
    title: '의정부 숨은 지원금 공고',
    subtitle: '청년·출산·주거·생활안정 지원',
    badge: '핵심복지',
  },
  {
    href: `/blog?category=${encodeURIComponent('취업과 창업')}`,
    icon: 'trending-up',
    title: '일자리 & 청년 면접정장',
    subtitle: '취업박람회 및 무료 정장 대여',
    badge: '취업지원',
  },
];

const INITIAL_TAG_COUNT = 6;

export default function SidebarContent({ tags = [] }: SidebarContentProps) {
  const visibleTags = tags.slice(0, INITIAL_TAG_COUNT);
  const hiddenTags = tags.slice(INITIAL_TAG_COUNT);

  return (
    <div className="space-y-3.5">
      {/* ── 1. 의정부 시민 퀵서비스 허브 + 시청 콜센터 통합 카드 ── */}
      <PremiumCard borderColor="default" hoverEffect={false} watermarkIcon="compass" className="!p-4">
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between min-w-0 gap-2 mb-2.5 pb-2 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <AppIcon name="compass" size={16} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
            <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white tracking-tight">
              의정부 생활 퀵메뉴
            </h3>
          </div>
          <span className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700">
            바로가기
          </span>
        </div>

        {/* 5대 퀵메뉴 타일 리스트 */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/60">
          {CIVIC_QUICK_MENUS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center justify-between gap-2 py-2 group/item hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 -mx-1.5 px-1.5 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="p-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 group-hover/item:bg-zinc-900 group-hover/item:text-white dark:group-hover/item:bg-white dark:group-hover/item:text-zinc-950 transition-colors shrink-0">
                  <AppIcon name={item.icon} size={13} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover/item:text-zinc-950 dark:group-hover/item:white truncate block">
                    {item.title}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9.5px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.2">
                  {item.badge}
                </span>
                <AppIcon
                  name="chevron-right"
                  size={12}
                  strokeWidth={2.5}
                  className="text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 시청 대표 콜센터 직통 인라인 바 */}
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
            <AppIcon name="phone" size={13} strokeWidth={2.5} className="text-zinc-800 dark:text-zinc-200" />
            <span>의정부시 콜센터</span>
          </div>
          <a
            href="tel:031-828-1234"
            className="font-extrabold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1 text-[11.5px]"
          >
            <span>031-828-1234</span>
            <AppIcon name="chevron-right" size={11} strokeWidth={2.5} />
          </a>
        </div>
      </PremiumCard>

      {/* ── 2. [2-in-1] 카카오톡 주간 알림 & 보상스쿨 무료 진단 액션 바 ── */}
      <div className="grid grid-cols-1 gap-2">
        {/* 카카오톡 알림 */}
        <a
          href="https://pf.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-extrabold text-xs transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <AppIcon name="chat" size={14} strokeWidth={2.5} />
            <span>의정부 주간 핫알림 카톡 구독</span>
          </div>
          <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* 보상스쿨 무료 보상 진단 */}
        <a
          href="tel:1588-0000"
          className="flex items-center justify-between p-2.5 bg-gradient-to-r from-zinc-950 to-zinc-900 hover:from-zinc-900 hover:to-zinc-800 text-white font-bold text-xs border border-zinc-800 transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <AppIcon name="scale" size={14} strokeWidth={2.5} className="text-zinc-300" />
            <span>시민 무료 사고·상해 보상 진단</span>
          </div>
          <span className="text-[10px] text-zinc-300 font-normal flex items-center gap-0.5">
            <span>보상스쿨</span>
            <AppIcon name="chevron-right" size={11} strokeWidth={2.5} />
          </span>
        </a>
      </div>

      {/* ── 3. 실시간 인기 키워드 태그 카드 ── */}
      {tags.length > 0 && (
        <PremiumCard borderColor="default" hoverEffect={true} watermarkIcon="pin" className="!p-3.5">
          <div className="flex items-center justify-between min-w-0 gap-2 mb-2 pb-1.5 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <AppIcon name="pin" size={14} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
              <h3 className="text-xs font-extrabold text-zinc-950 dark:text-white tracking-tight">인기 키워드 태그</h3>
            </div>
            <span className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[9.5px] font-bold px-1.5 py-0.2 border border-zinc-200 dark:border-zinc-700">
              실시간
            </span>
          </div>
          <div className="flex flex-wrap gap-1 text-[11px] font-medium">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-none bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-gray-200/80 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all font-medium"
              >
                <span className="text-zinc-400 dark:text-zinc-500">#</span>
                {tag}
              </Link>
            ))}
          </div>
          {hiddenTags.length > 0 && <SidebarTagMore tags={hiddenTags} />}
        </PremiumCard>
      )}
    </div>
  );
}
