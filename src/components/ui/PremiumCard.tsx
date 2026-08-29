import React from 'react';
import AppIcon, { type AppIconName } from './AppIcon';

export type BorderColor = 'red' | 'rose' | 'blue' | 'cyan' | 'green' | 'teal' | 'orange' | 'purple' | 'indigo' | 'yellow' | 'charcoal' | 'ink' | 'default';

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
  // 수묵화 모던 엣지: 1px 샤프 먹선 테두리
  const baseBorders: Record<BorderColor, string> = {
    blue: 'border-gray-200/90 dark:border-zinc-800',
    cyan: 'border-gray-200/90 dark:border-zinc-800',
    red: 'border-gray-200/90 dark:border-zinc-800',
    rose: 'border-gray-200/90 dark:border-zinc-800',
    green: 'border-gray-200/90 dark:border-zinc-800',
    teal: 'border-gray-200/90 dark:border-zinc-800',
    orange: 'border-gray-200/90 dark:border-zinc-800',
    yellow: 'border-gray-200/90 dark:border-zinc-800',
    purple: 'border-gray-200/90 dark:border-zinc-800',
    indigo: 'border-gray-200/90 dark:border-zinc-800',
    charcoal: 'border-gray-200/90 dark:border-zinc-800',
    ink: 'border-gray-200/90 dark:border-zinc-800',
    default: 'border-gray-200/90 dark:border-zinc-800',
  };

  // 44px 흑요석 앰비언트 글로우 & 정밀 수묵 테두리
  const hoverBorders = 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)] dark:hover:shadow-[0_14px_44px_rgba(255,255,255,0.08)]';

  const baseClass = `bg-white dark:bg-[#181a1d] p-4 sm:p-5 border ${baseBorders[borderColor] || baseBorders.default} shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-200 relative overflow-hidden rounded-none flex flex-col min-h-0 group ${
    hoverEffect ? hoverBorders : ''
  }`;

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {/* 호버 시 좌측 1.5px 수묵 포인트 획 & 은은한 먹물 번짐 워시 */}
      {hoverEffect && (
        <>
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 dark:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/60 via-zinc-50/20 to-transparent dark:from-zinc-800/40 dark:via-zinc-800/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
        </>
      )}

      {/* 워터마크 라인 SVG */}
      {watermarkIcon && (
        <div className="absolute right-3.5 bottom-2.5 opacity-[0.035] dark:opacity-[0.055] text-zinc-900 dark:text-zinc-100 select-none pointer-events-none group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-300 z-0">
          <AppIcon name={watermarkIcon} size={68} strokeWidth={1.5} />
        </div>
      )}

      <div className="w-full h-full flex flex-col min-h-0 flex-1 relative z-10">
        {children}
      </div>
    </div>
  );
}
