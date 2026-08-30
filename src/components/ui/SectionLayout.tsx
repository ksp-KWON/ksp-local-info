import React from 'react';
import Link from 'next/link';
import PremiumHeading from './PremiumHeading';
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
  headingLevel = 2,
  viewAllLink,
  children,
  watermarkIcon,
  className = '',
  ...props
}: SectionLayoutProps) {
  return (
    <section className={`relative group/section ${className}`} {...props}>
      {/* 정갈하고 슬림한 수묵 헤더 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-4 pb-2.5 border-b border-gray-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          <PremiumHeading
            level={headingLevel}
            gradient="charcoal"
            icon={icon}
            className="!mb-0 !p-0 !bg-transparent !border-0 !shadow-none text-lg sm:text-xl font-extrabold"
            showLeftBorder={true}
          >
            {title}
          </PremiumHeading>
          {description && (
            <span className="hidden md:inline-block text-xs text-zinc-500 dark:text-zinc-400 font-normal truncate pl-2.5 border-l border-zinc-200 dark:border-zinc-700">
              {description}
            </span>
          )}
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink.href}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0 group/link self-end sm:self-auto"
          >
            <span>{viewAllLink.text || '전체보기'}</span>
            <AppIcon name="chevron-right" size={13} strokeWidth={2.5} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
