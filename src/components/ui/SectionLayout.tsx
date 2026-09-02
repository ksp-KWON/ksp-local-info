import React from 'react';
import Link from 'next/link';
import AppIcon, { type AppIconName } from './AppIcon';

export type SectionTheme = 'default' | 'zinc' | 'blue' | 'emerald' | 'sky' | 'amber' | 'indigo' | 'rose';

interface ThemeStyles {
  gradient: string;
  leftBorder: string;
  titleColor: string;
  iconColor: string;
}

const THEME_STYLES: Record<SectionTheme, ThemeStyles> = {
  default: {
    gradient: 'bg-gradient-to-r from-zinc-200/90 via-zinc-100/50 to-transparent dark:from-zinc-800/90 dark:via-zinc-800/40 dark:to-transparent border-gray-200/90 dark:border-zinc-800',
    leftBorder: 'border-l-zinc-950 dark:border-l-white',
    titleColor: 'text-zinc-950 dark:text-white',
    iconColor: 'text-zinc-900 dark:text-zinc-100',
  },
  zinc: {
    gradient: 'bg-gradient-to-r from-zinc-200/90 via-zinc-100/50 to-transparent dark:from-zinc-800/90 dark:via-zinc-800/40 dark:to-transparent border-gray-200/90 dark:border-zinc-800',
    leftBorder: 'border-l-zinc-950 dark:border-l-white',
    titleColor: 'text-zinc-950 dark:text-white',
    iconColor: 'text-zinc-900 dark:text-zinc-100',
  },
  blue: {
    gradient: 'bg-gradient-to-r from-blue-100/90 via-indigo-50/40 to-transparent dark:from-blue-950/70 dark:via-indigo-950/20 dark:to-transparent border-blue-200/90 dark:border-blue-900/50',
    leftBorder: 'border-l-blue-600 dark:border-l-blue-400',
    titleColor: 'text-blue-950 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    gradient: 'bg-gradient-to-r from-emerald-100/90 via-teal-50/40 to-transparent dark:from-emerald-950/70 dark:via-teal-950/20 dark:to-transparent border-emerald-200/90 dark:border-emerald-900/50',
    leftBorder: 'border-l-emerald-600 dark:border-l-emerald-400',
    titleColor: 'text-emerald-950 dark:text-emerald-100',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    gradient: 'bg-gradient-to-r from-sky-100/90 via-blue-50/40 to-transparent dark:from-sky-950/70 dark:via-blue-950/20 dark:to-transparent border-sky-200/90 dark:border-sky-900/50',
    leftBorder: 'border-l-sky-600 dark:border-l-sky-400',
    titleColor: 'text-sky-950 dark:text-sky-100',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  amber: {
    gradient: 'bg-gradient-to-r from-amber-100/90 via-yellow-50/40 to-transparent dark:from-amber-950/70 dark:via-yellow-950/20 dark:to-transparent border-amber-200/90 dark:border-amber-900/50',
    leftBorder: 'border-l-amber-600 dark:border-l-amber-400',
    titleColor: 'text-amber-950 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  indigo: {
    gradient: 'bg-gradient-to-r from-indigo-100/90 via-purple-50/40 to-transparent dark:from-indigo-950/70 dark:via-purple-950/20 dark:to-transparent border-indigo-200/90 dark:border-indigo-900/50',
    leftBorder: 'border-l-indigo-600 dark:border-l-indigo-400',
    titleColor: 'text-indigo-950 dark:text-indigo-100',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  rose: {
    gradient: 'bg-gradient-to-r from-rose-100/90 via-pink-50/40 to-transparent dark:from-rose-950/70 dark:via-pink-950/20 dark:to-transparent border-rose-200/90 dark:border-rose-900/50',
    leftBorder: 'border-l-rose-600 dark:border-l-rose-400',
    titleColor: 'text-rose-950 dark:text-rose-100',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
};

interface SectionLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  theme?: SectionTheme;
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
  theme = 'default',
  headingLevel = 2,
  viewAllLink,
  children,
  watermarkIcon,
  className = '',
  ...props
}: SectionLayoutProps) {
  const HeadingTag = ('h' + headingLevel) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const styles = THEME_STYLES[theme] || THEME_STYLES.default;

  return (
    <section className={'relative group/section ' + className} {...props}>
      {/* 챕터 제목박스 (보상스쿨 벤치마킹 좌진우연 그라데이션 + 3.5px 좌측 굵은 바) */}
      <div className={'mb-4 sm:mb-5 p-3.5 sm:p-4.5 ' + styles.gradient + ' border border-l-[3.5px] ' + styles.leftBorder + ' shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.40)] hover:shadow-[0_0_35px_rgba(0,0,0,0.12),0_0_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_rgba(0,0,0,0.60),0_0_12px_rgba(0,0,0,0.40)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden rounded-none flex flex-col justify-between group'}>
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
              <span className={styles.iconColor + ' shrink-0 flex items-center justify-center'}>
                {icon}
              </span>
            )}
            <HeadingTag className={'text-base sm:text-lg lg:text-xl font-extrabold ' + styles.titleColor + ' tracking-tight truncate'}>
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
          <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed mt-1 relative z-10 break-keep">
            {description}
          </p>
        )}
      </div>

      {/* 하위 카드 목록 그리드 */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
