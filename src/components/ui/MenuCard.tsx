import React from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

export interface MenuCardProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  themeColor?: string;
  badgeText?: string;
  description: string;
  buttonText?: string;
  watermarkIcon?: AppIconName;
}

export default function MenuCard({
  href,
  onClick,
  icon,
  title,
  badgeText,
  description,
  buttonText,
  watermarkIcon,
}: MenuCardProps) {
  const content = (
    <PremiumCard
      borderColor="charcoal"
      hoverEffect
      watermarkIcon={watermarkIcon}
      className="!p-4 sm:!p-5 relative overflow-hidden group"
    >
      <div className="relative z-10 space-y-2 flex flex-col min-w-0">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2 rounded-none bg-gradient-to-r from-zinc-100/80 to-transparent dark:from-zinc-800/40 dark:to-transparent">
            <span className="text-zinc-900 dark:text-zinc-100 shrink-0 flex items-center justify-center">
              {icon}
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{title}</h3>
          </div>
          {badgeText && (
            <span className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-none border border-zinc-200 dark:border-zinc-700">
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed truncate sm:whitespace-normal font-normal">
          {description}
        </p>
        {buttonText && (
          <div className="mt-3 w-full text-xs sm:text-[12.5px] font-bold text-[#202124] dark:text-[#e8eaed] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50/90 dark:bg-white/5 border border-gray-100 dark:border-zinc-800/80 group-hover:border-zinc-700 dark:group-hover:border-zinc-300">
            <div className="flex items-center gap-2 truncate">{buttonText}</div>
            <AppIcon
              name="chevron-right"
              size={14}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
            />
          </div>
        )}
      </div>
    </PremiumCard>
  );

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block group w-full text-left" onClick={onClick}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="block group w-full text-left" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block group w-full text-left">
      {content}
    </button>
  );
}
