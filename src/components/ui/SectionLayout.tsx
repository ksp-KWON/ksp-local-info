import React from 'react';
import Link from 'next/link';
import PremiumCard from './PremiumCard';
import PremiumHeading from './PremiumHeading';
import { type AppIconName } from './AppIcon';

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
      <PremiumCard
        borderColor="charcoal"
        hoverEffect={true}
        watermarkIcon={watermarkIcon}
        className="mb-6 !p-5 sm:!p-6 !bg-gradient-to-r !from-zinc-100/90 !via-zinc-50/40 !to-transparent dark:!from-zinc-900/40 dark:!via-zinc-900/20 dark:!to-transparent"
      >
        <div className={`flex items-center justify-between gap-3 ${description ? 'mb-2.5' : ''} relative z-10`}>
          <PremiumHeading
            level={headingLevel}
            gradient="charcoal"
            icon={icon}
            className="!mb-0 !text-xl sm:!text-2xl"
            showLeftBorder={false}
          >
            {title}
          </PremiumHeading>

          {viewAllLink && (
            <Link
              href={viewAllLink.href}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
            >
              {viewAllLink.text || '전체보기'}
            </Link>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed relative z-10 font-normal">
            {description}
          </p>
        )}
      </PremiumCard>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
