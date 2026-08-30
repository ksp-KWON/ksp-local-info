import React from 'react';
import Link from 'next/link';
import PremiumCard from './PremiumCard';
import PremiumHeading from './PremiumHeading';
import AppIcon, { type AppIconName } from './AppIcon';

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
  return (
    <section className={`relative group/section ${className}`} {...props}>
      <PremiumCard
        borderColor="charcoal"
        hoverEffect={true}
        watermarkIcon={watermarkIcon}
        className="mb-4 sm:mb-5 !p-3.5 sm:!p-4.5 !bg-gradient-to-r !from-zinc-100/90 !via-zinc-50/40 !to-transparent dark:!from-zinc-900/50 dark:!via-zinc-900/20 dark:!to-transparent"
      >
        <div className={`flex items-center justify-between gap-3 ${description ? 'mb-1 sm:mb-1.5' : ''} relative z-10`}>
          <PremiumHeading
            level={headingLevel}
            gradient="charcoal"
            icon={icon}
            className="!mb-0 !text-base sm:!text-lg lg:!text-xl font-extrabold !bg-transparent !p-0 !border-0 !shadow-none tracking-tight text-zinc-950 dark:text-white"
            showLeftBorder={false}
          >
            {title}
          </PremiumHeading>

          {viewAllLink && (
            <Link
              href={viewAllLink.href}
              className="flex items-center gap-1 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0 group/link"
            >
              <span>{viewAllLink.text || '전체보기'}</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={2.5} className="group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed relative z-10 font-normal break-keep">
            {description}
          </p>
        )}
      </PremiumCard>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
