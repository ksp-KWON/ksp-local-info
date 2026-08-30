import React from 'react';

export type GradientColor = 'charcoal' | 'ink' | 'blue' | 'green' | 'default';

interface PremiumHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: GradientColor;
  icon?: React.ReactNode;
  showLeftBorder?: boolean;
}

export default function PremiumHeading({
  children,
  className = '',
  level = 2,
  gradient = 'charcoal',
  icon,
  showLeftBorder = true,
  ...props
}: PremiumHeadingProps) {
  const Tag = `h${level}` as React.ElementType;

  let baseClass = 'not-prose w-full tracking-tight flex items-center gap-2.5 break-keep transition-all rounded-none';

  // 4단계 수묵 농담(濃淡) 타이포그래피 위계 & 완전 개방형 좌➔우 배경 수묵 그라데이션
  if (level === 1) {
    baseClass += ' text-2xl sm:text-3xl font-extrabold pb-3.5 mb-6 border-b border-gray-200/90 dark:border-zinc-800';
  } else if (level === 2) {
    baseClass += ' text-xl sm:text-2xl font-extrabold mt-12 mb-5 py-3 pl-4 pr-2 bg-gradient-to-r from-zinc-300/80 via-zinc-200/40 to-transparent dark:from-zinc-800 dark:via-zinc-800/40 dark:to-transparent';
  } else if (level === 3) {
    baseClass += ' text-lg sm:text-xl font-bold mt-8 mb-4 py-2.5 pl-3.5 pr-2 bg-gradient-to-r from-zinc-200 via-zinc-100/50 to-transparent dark:from-zinc-800/80 dark:via-zinc-800/25 dark:to-transparent';
  } else if (level === 4) {
    baseClass += ' text-base sm:text-lg font-bold mt-6 mb-3 py-2 pl-3 pr-2 bg-gradient-to-r from-zinc-200/80 via-zinc-100/30 to-transparent dark:from-zinc-800/60 dark:via-zinc-800/15 dark:to-transparent';
  } else if (level === 5) {
    baseClass += ' text-sm sm:text-base font-semibold mt-5 mb-2 py-1.5 pl-2.5 pr-2 bg-gradient-to-r from-zinc-100 via-zinc-50/40 to-transparent dark:from-zinc-800/40 dark:to-transparent';
  } else if (level === 6) {
    baseClass += ' text-xs sm:text-sm font-medium mt-4 mb-2 py-1 pl-2 pr-2 text-zinc-600 dark:text-zinc-400';
  }

  // 좌측 수묵 획(Stroke) 차등
  if (showLeftBorder) {
    const borderMap: Record<number, string> = {
      1: 'border-l-4 border-l-zinc-950 dark:border-l-white pl-3.5',
      2: 'border-l-4 border-l-zinc-950 dark:border-l-white',
      3: 'border-l-[3px] border-l-zinc-700 dark:border-l-zinc-200',
      4: 'border-l-2 border-l-zinc-500 dark:border-l-zinc-400',
      5: 'border-l-[1.5px] border-l-zinc-400 dark:border-l-zinc-500',
      6: 'border-l border-l-zinc-300 dark:border-l-zinc-600',
    };
    baseClass += ` ${borderMap[level] || borderMap[2]}`;
  }

  // 흑요석 먹빛 텍스트
  const textClass = 'text-zinc-950 dark:text-white font-extrabold tracking-tight min-w-0 flex-1';

  return (
    <Tag className={`${baseClass} ${className}`} {...props}>
      {icon && <span className="shrink-0 flex items-center text-zinc-900 dark:text-zinc-100">{icon}</span>}
      <span className={textClass}>{children}</span>
    </Tag>
  );
}
