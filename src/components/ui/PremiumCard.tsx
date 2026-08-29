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

  // 2중 다중 분산 울트라 딥 섀도우 & 1px 물리적 리프트 인터랙션
  const hoverBorders = 'hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] hover:-translate-y-1';

  const baseClass = `bg-white dark:bg-[#181a1d] p-4 sm:p-5 border ${baseBorders[borderColor] || baseBorders.default} shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] transition-all duration-300 relative overflow-hidden rounded-none flex flex-col min-h-0 group ${
    hoverEffect ? `${hoverBorders} cursor-pointer` : ''
  } ${className}`;

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {/* 호버 시 은은한 워시 배경 (좌측 검은선 배제) */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/60 via-zinc-50/20 to-transparent dark:from-zinc-800/40 dark:via-zinc-800/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
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
