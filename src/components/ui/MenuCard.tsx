import React from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

export type MenuThemeColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'teal' | 'indigo' | 'rose';

export interface MenuCardProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  themeColor?: MenuThemeColor;
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
      borderColor="default"
      hoverEffect
      watermarkIcon={watermarkIcon}
      className="!p-4 sm:!p-5 relative overflow-hidden group !bg-white dark:!bg-[#181a1d] !border-2 !border-zinc-300 dark:!border-zinc-700 hover:!border-black dark:hover:!border-white transition-all"
    >
      <div className="relative z-10 space-y-2 flex flex-col min-w-0">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2 rounded-none bg-gradient-to-r from-black/[0.04] to-transparent dark:from-white/[0.06] dark:to-transparent">
            <span className="text-black dark:text-white shrink-0 flex items-center justify-center stroke-[2.5]">
              {icon}
            </span>
            <h3 className="text-sm font-black text-black dark:text-white truncate">{title}</h3>
          </div>
          {badgeText && (
            <span className="bg-black text-white dark:bg-white dark:text-black shrink-0 text-[10px] font-black px-2 py-0.5 rounded-none border border-black dark:border-white">
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed truncate sm:whitespace-normal font-medium">
          {description}
        </p>
        {buttonText && (
          <div className="mt-3 w-full text-xs font-black text-black dark:text-white flex items-center justify-between transition-all p-2 rounded-none bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-black dark:group-hover:border-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <div className="flex items-center gap-2 truncate">{buttonText}</div>
            <AppIcon
              name="chevron-right"
              size={13}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={3}
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
    <button onClick={onClick} className="block group w-full text-left cursor-pointer">
      {content}
    </button>
  );
}
