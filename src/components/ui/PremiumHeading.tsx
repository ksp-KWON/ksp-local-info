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

  let baseClass = 'tracking-tight flex items-center flex-nowrap gap-2.5 mb-3.5 break-keep';

  // 4단계 수묵 농담(濃淡) 타이포그래피 위계
  if (level === 1) {
    baseClass += ' text-xl sm:text-2xl font-extrabold pb-2.5 border-b border-gray-200/80 dark:border-zinc-800';
  } else if (level === 2) {
    baseClass += ' text-lg sm:text-xl font-extrabold mt-12 mb-5 py-2.5 pr-4 bg-gradient-to-r from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 dark:via-zinc-800/10 dark:to-transparent';
  } else if (level === 3) {
    baseClass += ' text-base sm:text-lg font-bold mt-8 mb-4 py-1.5 pr-3 bg-gradient-to-r from-zinc-100/60 via-zinc-50/20 to-transparent dark:from-zinc-800/30 dark:via-zinc-800/5 dark:to-transparent';
  } else if (level === 4) {
    baseClass += ' text-sm sm:text-base font-bold mt-6 mb-3';
  } else if (level === 5) {
    baseClass += ' text-xs sm:text-sm font-semibold mt-5 mb-2';
  } else if (level === 6) {
    baseClass += ' text-[13px] sm:text-xs font-semibold mt-4 mb-2';
  }

  // 좌측 수묵 획(Stroke) 차등
  if (showLeftBorder) {
    const borderMap: Record<number, string> = {
      1: 'border-l-4 border-zinc-900 dark:border-zinc-100 pl-3',
      2: 'border-l-4 border-zinc-900 dark:border-zinc-100 pl-3',
      3: 'border-l-[2.5px] border-zinc-600 dark:border-zinc-400 pl-2.5',
      4: 'border-l-2 border-zinc-400 dark:border-zinc-500 pl-2',
      5: 'border-l border-zinc-300 dark:border-zinc-600 pl-1.5',
      6: 'border-l border-zinc-300 dark:border-zinc-600 pl-1.5',
    };
    baseClass += ` ${borderMap[level] || borderMap[2]}`;
  }

  // 흑요석 먹빛 텍스트 그라데이션
  const textClass = 'bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent';

  return (
    <Tag className={`${baseClass} ${className}`} {...props}>
      {icon && <span className="shrink-0 flex items-center text-zinc-900 dark:text-zinc-100">{icon}</span>}
      <span className={`min-w-0 ${textClass}`}>{children}</span>
    </Tag>
  );
}
