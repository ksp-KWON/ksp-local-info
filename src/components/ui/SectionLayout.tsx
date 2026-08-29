import React from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumHeading from '@/components/ui/PremiumHeading';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

export type SectionThemeColor = 'red' | 'rose' | 'blue' | 'cyan' | 'green' | 'teal' | 'orange' | 'purple' | 'indigo' | 'yellow' | 'default';

interface SectionLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  themeColor?: SectionThemeColor;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  viewAllLink?: {
    href: string;
    text?: string;
    isExternal?: boolean;
  };
  children: React.ReactNode;
  watermarkIcon?: AppIconName;
}

export default function SectionLayout({
  title,
  description,
  icon,
  themeColor = 'default',
  headingLevel = 2,
  viewAllLink,
  children,
  watermarkIcon,
  className = '',
  ...props
}: SectionLayoutProps) {
  return (
    <section className={`relative group/section ${className}`} {...props}>
      {/* 타이틀 박스 (수묵화 묵향 그라데이션 & 굵은 라인 SVG 워터마크) */}
      <PremiumCard
        borderColor="default"
        hoverEffect={true}
        watermarkIcon={watermarkIcon}
        className="mb-5 !p-5 sm:!p-6 group/headerbox !bg-gradient-to-r !from-black/[0.05] !via-black/[0.015] !to-transparent dark:!from-white/[0.08] dark:!via-white/[0.02] dark:!to-transparent !border-2 !border-black/70 dark:!border-white/70"
      >
        <div className={`flex items-center justify-between gap-3 ${description ? 'mb-2' : ''} relative z-10 group/header`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <span className="text-black dark:text-white shrink-0 stroke-[2.5]">{icon}</span>}
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-black dark:text-white truncate">
              {title}
            </h2>
          </div>

          {/* 슬림 샤프 굵은 선 전체보기 링크 */}
          {viewAllLink && (
            <Link
              href={viewAllLink.href}
              className="flex items-center gap-1 text-xs font-black text-black dark:text-white hover:opacity-70 transition-opacity group/link shrink-0 border-b-2 border-black dark:border-white pb-0.5"
            >
              <span>{viewAllLink.text || '전체보기'}</span>
              <AppIcon name="chevron-right" size={13} strokeWidth={3} className="group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 break-keep leading-relaxed font-medium relative z-10 mt-1">
            {description}
          </p>
        )}
      </PremiumCard>

      {/* 컨텐츠 그리드 */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
