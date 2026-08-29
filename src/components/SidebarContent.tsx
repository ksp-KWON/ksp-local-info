'use client';

import Link from 'next/link';
import SidebarTagMore from './SidebarTagMore';
import PremiumCard from '@/components/ui/PremiumCard';
import MenuCard from '@/components/ui/MenuCard';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

interface SidebarContentProps {
  tags?: string[];
}

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  title: string;
  badgeText: string;
  description: string;
  buttonText: string;
  watermarkIcon: AppIconName;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    href: '/services/emergency',
    icon: <AppIcon name="hospital" size={18} strokeWidth={2.5} />,
    title: '달빛병원 & 심야약국',
    badgeText: '실시간 지도',
    description: '휴일이나 야간에도 문 여는 의정부 관내 병원과 약국을 지도에서 확인하세요.',
    buttonText: '응급의료 지도 바로가기',
    watermarkIcon: 'hospital',
  },
  {
    href: '/services/local-currency',
    icon: <AppIcon name="bank" size={18} strokeWidth={2.5} />,
    title: '의정부사랑카드 가맹점',
    badgeText: '지역화폐',
    description: '내 주변에서 지역화폐 6~10% 인센티브를 쓸 수 있는 착한 가맹점을 검색해 보세요.',
    buttonText: '사랑카드 가맹점 찾기',
    watermarkIcon: 'bank',
  },
  {
    href: '/services/health-check',
    icon: <AppIcon name="stethoscope" size={18} strokeWidth={2.5} />,
    title: '국가 건강검진 기관',
    badgeText: '지정병원',
    description: '일반검진, 암검진, 구강검진이 가능한 의정부 내 국민건강보험 지정병원 안내입니다.',
    buttonText: '검진병원 조회하기',
    watermarkIcon: 'stethoscope',
  },
  {
    href: `/blog?category=${encodeURIComponent('💸 숨은 지원금 찾기')}`,
    icon: <AppIcon name="bank" size={18} strokeWidth={2.5} />,
    title: '의정부 지원금 혜택',
    badgeText: '핵심복지',
    description: '청년 이사비, 전세 대출이자, 출산지원금 등 놓치기 쉬운 시정 혜택을 모았습니다.',
    buttonText: '지원금 공고 전체보기',
    watermarkIcon: 'bank',
  },
  {
    href: `/blog?category=${encodeURIComponent('💼 취업과 창업')}`,
    icon: <AppIcon name="trending-up" size={18} strokeWidth={2.5} />,
    title: '일자리 & 청년창업',
    badgeText: '취업지원',
    description: '의정부 일자리 박람회, 청년 면접정장 대여, 창업 인큐베이팅 공고를 확인하세요.',
    buttonText: '일자리 소식 보기',
    watermarkIcon: 'trending-up',
  },
];

const INITIAL_TAG_COUNT = 6;

export default function SidebarContent({ tags = [] }: SidebarContentProps) {
  const visibleTags = tags.slice(0, INITIAL_TAG_COUNT);
  const hiddenTags = tags.slice(INITIAL_TAG_COUNT);

  return (
    <div className="space-y-5">
      {SIDEBAR_ITEMS.map((item, index) => (
        <MenuCard key={index} {...item} />
      ))}

      {/* 실시간 인기 키워드 태그 카드 (수묵 흑백 모노톤) */}
      {tags.length > 0 && (
        <PremiumCard borderColor="default" hoverEffect={true} watermarkIcon="pin" className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between min-w-0 gap-2 mb-3.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2 rounded-none bg-gradient-to-r from-black/[0.04] to-transparent dark:from-white/[0.06] dark:to-transparent">
              <span className="text-black dark:text-white shrink-0 flex items-center justify-center stroke-[2.5]">
                <AppIcon name="pin" size={16} />
              </span>
              <h3 className="text-sm font-black text-black dark:text-white truncate">인기 키워드 태그</h3>
            </div>
            <span className="bg-black text-white dark:bg-white dark:text-black shrink-0 text-[10px] font-black px-2 py-0.5 rounded-none border border-black dark:border-white">
              실시간
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all text-xs font-bold"
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
