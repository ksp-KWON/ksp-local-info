import React from 'react';
import AppIcon, { type AppIconName } from './AppIcon';

export type BorderColor = 'red' | 'rose' | 'blue' | 'cyan' | 'green' | 'teal' | 'orange' | 'purple' | 'indigo' | 'yellow' | 'default';

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  borderColor?: BorderColor;
  hoverEffect?: boolean;
  watermarkEmoji?: string;
  watermarkIcon?: AppIconName;
}

export default function PremiumCard({
  children,
  className = '',
  borderColor = 'default',
  hoverEffect = true,
  watermarkEmoji,
  watermarkIcon,
  ...props
}: PremiumCardProps) {
  // 모던 수묵화(墨) 컨셉: 굵고 선명한 모노톤 먹선과 음영
  const baseBorders: Record<BorderColor, string> = {
    blue: 'border-zinc-300 dark:border-zinc-700',
    cyan: 'border-zinc-300 dark:border-zinc-700',
    red: 'border-zinc-300 dark:border-zinc-700',
    rose: 'border-zinc-300 dark:border-zinc-700',
    green: 'border-zinc-300 dark:border-zinc-700',
    teal: 'border-zinc-300 dark:border-zinc-700',
    orange: 'border-zinc-300 dark:border-zinc-700',
    yellow: 'border-zinc-300 dark:border-zinc-700',
    purple: 'border-zinc-300 dark:border-zinc-700',
    indigo: 'border-zinc-300 dark:border-zinc-700',
    default: 'border-zinc-300 dark:border-zinc-700',
  };

  const hoverBorders = 'hover:border-black dark:hover:border-white hover:shadow-[4px_4px_0px_rgba(0,0,0,0.85)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] hover:-translate-x-0.5 hover:-translate-y-0.5';

  const baseClass = `bg-white dark:bg-[#181a1d] p-4 sm:p-5 border-2 ${baseBorders[borderColor]} shadow-[2px_2px_0px_rgba(0,0,0,0.06)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.06)] transition-all duration-200 relative overflow-hidden rounded-none flex flex-col min-h-0 group ${
    hoverEffect ? hoverBorders : ''
  }`;

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {/* 은은한 굵은 라인 SVG 수묵 워터마크 */}
      {watermarkIcon && (
        <div className="absolute right-3 bottom-2 opacity-[0.045] dark:opacity-[0.07] text-black dark:text-white select-none pointer-events-none group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-300 z-0">
          <AppIcon name={watermarkIcon} size={72} strokeWidth={2} />
        </div>
      )}
      {!watermarkIcon && watermarkEmoji && (
        <div className="absolute right-[-8px] bottom-[-14px] opacity-[0.03] dark:opacity-[0.05] text-[90px] select-none pointer-events-none group-hover:scale-110 transition-transform duration-300 z-0">
          {watermarkEmoji}
        </div>
      )}
      <div className="w-full h-full flex flex-col min-h-0 flex-1 relative z-10">{children}</div>
    </div>
  );
}
