import React from 'react';
import Link from 'next/link';
import AppIcon, { type AppIconName } from './AppIcon';

// 의정부 시그니처 수묵화 톤온톤 그라데이션 (좌진우연 SSOT)
const SECTION_GRADIENT =
  'bg-gradient-to-r from-zinc-200/90 via-zinc-100/40 to-transparent dark:from-zinc-800/90 dark:via-zinc-800/30 dark:to-transparent';

interface SectionLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
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
  headingLevel = 2,
  viewAllLink,
  children,
  watermarkIcon,
  className = '',
  ...props
}: SectionLayoutProps) {
  const HeadingTag = ('h' + headingLevel) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <section className={'relative group/section ' + className} {...props}>
      {/* 챕터 제목박스 (보상스쿨 벤치마킹 수묵화 좌진우연 그라데이션 + 3.5px 먹색 바) */}
      <div className={'mb-4 sm:mb-5 p-3.5 sm:p-4.5 ' + SECTION_GRADIENT + ' border border-gray-200/90 dark:border-zinc-800 border-l-[3.5px] border-l-zinc-950 dark:border-l-white shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.40)] hover:shadow-[0_0_35px_rgba(0,0,0,0.12),0_0_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_rgba(0,0,0,0.60),0_0_12px_rgba(0,0,0,0.40)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden rounded-none flex flex-col justify-between group'}>
        {/* 우측 하단 워터마크 SVG */}
        {watermarkIcon && (
          <div className="absolute right-3 bottom-1.5 opacity-[0.03] dark:opacity-[0.05] text-zinc-900 dark:text-zinc-100 select-none pointer-events-none group-hover:scale-105 transition-transform duration-300 z-0">
            <AppIcon name={watermarkIcon} size={64} strokeWidth={1.5} />
          </div>
        )}

        {/* 1행 : 아이콘 + 타이틀 + 전체보기 링크 */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            {icon && (
              <span className="text-zinc-900 dark:text-zinc-100 shrink-0 flex items-center justify-center">
                {icon}
              </span>
            )}
            <HeadingTag className="text-base sm:text-lg lg:text-xl font-extrabold text-zinc-950 dark:text-white tracking-tight truncate">
              {title}
            </HeadingTag>
          </div>

          {viewAllLink && (
            viewAllLink.isExternal ? (
              <a
                href={viewAllLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0 group/link"
              >
                <span>{viewAllLink.text || '전체보기'}</span>
                <AppIcon
                  name="chevron-right"
                  size={12}
                  strokeWidth={2.5}
                  className="group-hover/link:translate-x-0.5 transition-transform"
                />
              </a>
            ) : (
              <Link
                href={viewAllLink.href}
                className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0 group/link"
              >
                <span>{viewAllLink.text || '전체보기'}</span>
                <AppIcon
                  name="chevron-right"
                  size={12}
                  strokeWidth={2.5}
                  className="group-hover/link:translate-x-0.5 transition-transform"
                />
              </Link>
            )
          )}
        </div>

        {/* 2행 : 서술형 설명문 */}
        {description && (
          <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-1 relative z-10 break-keep">
            {description}
          </p>
        )}
      </div>

      {/* 하위 카드 목록 그리드 */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
