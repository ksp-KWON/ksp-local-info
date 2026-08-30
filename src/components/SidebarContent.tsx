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

const INITIAL_TAG_COUNT = 8;

export default function SidebarContent({ tags = [] }: SidebarContentProps) {
  const visibleTags = tags.slice(0, INITIAL_TAG_COUNT);
  const hiddenTags = tags.slice(INITIAL_TAG_COUNT);

  return (
    <div className="space-y-4">
      {/* ── 1. 의정부 시민 퀵서비스 허브 (단일 통합 프리미엄 카드) ── */}
      <PremiumCard borderColor="default" hoverEffect={false} watermarkIcon="compass" className="!p-4 sm:!p-5">
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between min-w-0 gap-2 mb-3.5 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <AppIcon name="compass" size={17} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
            <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white tracking-tight">
              의정부 생활 퀵메뉴
            </h3>
          </div>
          <span className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 border border-zinc-200 dark:border-zinc-700">
            바로가기
          </span>
        </div>

        {/* 5대 퀵메뉴 타일 리스트 */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {CIVIC_QUICK_MENUS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center justify-between gap-2.5 py-3 group/item hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 -mx-2 px-2 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="mt-0.5 p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 group-hover/item:bg-zinc-900 group-hover/item:text-white dark:group-hover/item:bg-white dark:group-hover/item:text-zinc-950 transition-colors shrink-0">
                  <AppIcon name={item.icon} size={15} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover/item:text-zinc-950 dark:group-hover/item:white truncate">
                      {item.title}
                    </span>
                    <span className="text-[9.5px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.2 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <AppIcon
                name="chevron-right"
                size={13}
                strokeWidth={2.5}
                className="text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all shrink-0"
              />
            </Link>
          ))}
        </div>
      </PremiumCard>

      {/* ── 2. [Phase 2] 카카오톡 채널 주간 알림톡 구독 위젯 ── */}
      <div className="p-4 border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-[#181a1d] shadow-[0_0_15px_rgba(0,0,0,0.04)] dark:shadow-[0_0_15px_rgba(0,0,0,0.30)] relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-2">
          <AppIcon name="chat" size={15} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
          <h4 className="text-xs font-extrabold text-zinc-950 dark:text-white">의정부 주간 핫알림 구독</h4>
        </div>
        <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
          이번 주말 문 여는 소아과 & 이번 달 지원금 공고를 카카오톡으로 받아보세요.
        </p>
        <a
          href="https://pf.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-between w-full py-2 px-3 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-extrabold text-xs transition-colors rounded-none"
        >
          <span>카카오톡 알림 받기</span>
          <AppIcon name="chevron-right" size={12} strokeWidth={3} />
        </a>
      </div>

      {/* ── 3. [Phase 3] 보상스쿨 연계 : 의정부 시민 무료 사고·상해 보상 진단 ── */}
      <div className="p-4 border border-zinc-900 dark:border-zinc-700 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <AppIcon name="scale" size={14} strokeWidth={2.5} className="text-zinc-300" />
            <span className="text-xs font-extrabold text-white">시민 무료 보상 진단</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-300 bg-white/10 px-1.5 py-0.5 border border-white/20">
            보상스쿨 연계
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed font-normal mt-1">
          교통사고, 낙상, 일상 상해 보험금 및 후유장해 1:1 무료 상담
        </p>
        <a
          href="tel:1588-0000"
          className="mt-2.5 inline-flex items-center justify-between w-full p-2 bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-colors"
        >
          <span>1:1 무료 진단 요청</span>
          <AppIcon name="chevron-right" size={12} strokeWidth={2.5} />
        </a>
      </div>

      {/* ── 4. 실시간 인기 키워드 태그 카드 ── */}
      {tags.length > 0 && (
        <PremiumCard borderColor="default" hoverEffect={true} watermarkIcon="pin" className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between min-w-0 gap-2 mb-3.5 pb-2 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <AppIcon name="pin" size={15} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
              <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white tracking-tight">인기 키워드 태그</h3>
            </div>
            <span className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 border border-zinc-200 dark:border-zinc-700">
              실시간
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs font-medium">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-none bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-gray-200/80 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all text-xs font-medium"
              >
                <span className="text-zinc-400 dark:text-zinc-500">#</span>
                {tag}
              </Link>
            ))}
          </div>
          {hiddenTags.length > 0 && <SidebarTagMore tags={hiddenTags} />}
        </PremiumCard>
      )}

      {/* ── 5. 의정부시 공식 행정 직통 안내 배너 ── */}
      <div className="p-4 border border-gray-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <AppIcon name="phone" size={14} strokeWidth={2.5} className="text-zinc-700 dark:text-zinc-300" />
          <span className="text-xs font-extrabold text-zinc-950 dark:text-white">의정부시 대표 콜센터</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
          시정 문의 및 생활 민원 안내 (평일 09:00 ~ 18:00)
        </p>
        <a
          href="tel:031-828-1234"
          className="mt-2.5 inline-flex items-center justify-between w-full p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white transition-colors"
        >
          <span>031-828-1234</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">전화연결 &gt;</span>
        </a>
      </div>
    </div>
  );
}
