import React from 'react';
import Link from 'next/link';
import AppIcon, { type AppIconName } from './AppIcon';

interface SectionLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  themeColor?: string;
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
  viewAllLink,
  children,
  className = '',
  ...props
}: SectionLayoutProps) {
  return (
    <section className={`relative group/section ${className}`} {...props}>
      {/* 완성형 수묵 앰비언트 배너 바 */}
      <div className="mb-4 sm:mb-5 relative overflow-hidden rounded-none border-l-4 border-zinc-950 dark:border-white border-y border-r border-gray-200/90 dark:border-zinc-800 bg-gradient-to-r from-zinc-100/90 via-zinc-50/50 to-transparent dark:from-zinc-900/70 dark:via-zinc-900/30 dark:to-transparent px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 shadow-[0_0_15px_rgba(0,0,0,0.04)] dark:shadow-[0_0_15px_rgba(0,0,0,0.30)]">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 text-zinc-950 dark:text-white">
            {icon && <span className="text-zinc-800 dark:text-zinc-200 shrink-0">{icon}</span>}
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {title}
            </h2>
          </div>
          {description && (
            <span className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 font-normal leading-tight break-keep">
              {description}
            </span>
          )}
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink.href}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all shrink-0 group/link self-end sm:self-auto py-1 px-2.5 bg-white/90 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 shadow-2xs"
          >
            <span>{viewAllLink.text || '전체보기'}</span>
            <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
