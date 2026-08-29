import React from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import PremiumBadge, { type BadgeColor } from '@/components/ui/PremiumBadge';

export interface MenuCardProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  themeColor?: 'emerald' | 'blue' | 'amber' | 'purple' | 'indigo' | 'rose' | 'default';
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
  themeColor = 'default',
  badgeText,
  description,
  buttonText,
  watermarkIcon,
}: MenuCardProps) {
  const iconColorMap = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-sky-600 dark:text-sky-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    amber: 'text-amber-600 dark:text-amber-400',
    purple: 'text-purple-600 dark:text-purple-400',
    rose: 'text-rose-600 dark:text-rose-400',
    default: 'text-zinc-700 dark:text-zinc-300',
  };

  const badgeColorMap: Record<string, BadgeColor> = {
    emerald: 'green',
    blue: 'blue',
    indigo: 'indigo',
    amber: 'amber',
    purple: 'purple',
    rose: 'rose',
    default: 'charcoal',
  };

  const content = (
    <PremiumCard
      borderColor="default"
      hoverEffect
      watermarkIcon={watermarkIcon}
      className="!p-4 sm:!p-5 relative overflow-hidden group"
    >
      <div className="relative z-10 space-y-2 flex flex-col min-w-0">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2 rounded-none bg-gradient-to-r from-zinc-100/70 to-transparent dark:from-zinc-800/40 dark:to-transparent">
            <span className={`${iconColorMap[themeColor] || iconColorMap.default} shrink-0 flex items-center justify-center`}>
              {icon}
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{title}</h3>
          </div>
          {badgeText && (
            <PremiumBadge color={badgeColorMap[themeColor] || 'charcoal'}>
              {badgeText}
            </PremiumBadge>
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
