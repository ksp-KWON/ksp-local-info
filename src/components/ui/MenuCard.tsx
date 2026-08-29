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
  themeColor: MenuThemeColor;
  badgeText?: string;
  description: string;
  buttonText?: string;
  watermarkIcon?: AppIconName;
}

const THEME_STYLES: Record<
  MenuThemeColor,
  { textIcon: string; badgeBg: string; buttonHoverBg: string; buttonHoverText: string }
> = {
  blue: {
    textIcon: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50',
    buttonHoverBg: 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/25',
    buttonHoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  red: {
    textIcon: 'text-red-500',
    badgeBg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-900/50',
    buttonHoverBg: 'group-hover:bg-red-50 dark:group-hover:bg-red-950/25',
    buttonHoverText: 'group-hover:text-red-500 dark:group-hover:text-red-400',
  },
  green: {
    textIcon: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/50',
    buttonHoverBg: 'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/25',
    buttonHoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  teal: {
    textIcon: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border-teal-200/50 dark:border-teal-900/50',
    buttonHoverBg: 'group-hover:bg-teal-50 dark:group-hover:bg-teal-950/25',
    buttonHoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
  },
  indigo: {
    textIcon: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/50',
    buttonHoverBg: 'group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/25',
    buttonHoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
  },
  rose: {
    textIcon: 'text-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/50',
    buttonHoverBg: 'group-hover:bg-rose-50 dark:group-hover:bg-rose-950/25',
    buttonHoverText: 'group-hover:text-rose-500 dark:group-hover:text-rose-400',
  },
  yellow: {
    textIcon: 'text-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50',
    buttonHoverBg: 'group-hover:bg-amber-50 dark:group-hover:bg-amber-900/25',
    buttonHoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
  purple: {
    textIcon: 'text-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50',
    buttonHoverBg: 'group-hover:bg-purple-50 dark:group-hover:bg-purple-900/25',
    buttonHoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
  },
};

const bgGradients: Record<string, string> = {
  blue: 'bg-gradient-to-r from-blue-100/80 to-transparent dark:from-blue-900/30 dark:to-transparent',
  red: 'bg-gradient-to-r from-red-100/80 to-transparent dark:from-red-900/30 dark:to-transparent',
  green: 'bg-gradient-to-r from-green-100/80 to-transparent dark:from-green-900/30 dark:to-transparent',
  teal: 'bg-gradient-to-r from-teal-100/80 to-transparent dark:from-teal-900/30 dark:to-transparent',
  indigo: 'bg-gradient-to-r from-indigo-100/80 to-transparent dark:from-indigo-900/30 dark:to-transparent',
  rose: 'bg-gradient-to-r from-rose-100/80 to-transparent dark:from-rose-900/30 dark:to-transparent',
  yellow: 'bg-gradient-to-r from-yellow-100/80 to-transparent dark:from-yellow-900/30 dark:to-transparent',
  purple: 'bg-gradient-to-r from-purple-100/80 to-transparent dark:from-purple-900/30 dark:to-transparent',
};

export default function MenuCard({
  href,
  onClick,
  icon,
  title,
  description,
  badgeText,
  themeColor,
  buttonText,
  watermarkIcon,
}: MenuCardProps) {
  const theme = THEME_STYLES[themeColor] || THEME_STYLES.blue;

  const content = (
    <PremiumCard
      borderColor={themeColor}
      hoverEffect
      watermarkIcon={watermarkIcon}
      className="!p-4 sm:!p-5 relative overflow-hidden group"
    >
      <div className="relative z-10 space-y-2 flex flex-col min-w-0">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <div className={`flex items-center gap-2 min-w-0 flex-1 pr-2 rounded-none ${bgGradients[themeColor]}`}>
            <span className={`${theme.textIcon} shrink-0 flex items-center justify-center`}>{icon}</span>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{title}</h3>
          </div>
          {badgeText && (
            <span className={`${theme.badgeBg} shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-none border`}>
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed truncate sm:whitespace-normal font-medium">
          {description}
        </p>
        {buttonText && (
          <div
            className={`mt-3 w-full text-xs sm:text-[12.5px] font-bold text-gray-900 dark:text-white flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50/90 dark:bg-white/5 border border-gray-100 dark:border-zinc-800/80 ${theme.buttonHoverBg} ${theme.buttonHoverText}`}
          >
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
    <button onClick={onClick} className="block group w-full text-left cursor-pointer">
      {content}
    </button>
  );
}
