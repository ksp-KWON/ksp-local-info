import React from 'react';

interface PremiumHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: React.ReactNode;
  showLeftBorder?: boolean;
}

export default function PremiumHeading({
  children,
  className = '',
  level = 2,
  icon,
  showLeftBorder = true,
  ...props
}: PremiumHeadingProps) {
  const Tag = `h${level}` as React.ElementType;

  let headingClass = '';

  switch (level) {
    case 1:
      headingClass =
        'text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white mb-6 border-l-4 border-black dark:border-white pl-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800';
      break;
    case 2:
      headingClass =
        'text-lg sm:text-xl font-black tracking-tight text-black dark:text-white mt-12 mb-5 border-l-[3.5px] border-black dark:border-white pl-3.5 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800';
      break;
    case 3:
      headingClass =
        'text-base sm:text-lg font-black tracking-tight text-black dark:text-white mt-8 mb-3.5 border-l-[2.5px] border-zinc-700 dark:border-zinc-300 pl-3 py-1';
      break;
    case 4:
      headingClass =
        'text-sm sm:text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 mb-2.5 pl-2.5 border-l-2 border-zinc-400 dark:border-zinc-600';
      break;
    case 5:
    case 6:
      headingClass =
        'text-xs sm:text-sm font-black tracking-tight text-zinc-800 dark:text-zinc-200 mt-5 mb-2 pl-2 border-l border-zinc-400 dark:border-zinc-600';
      break;
    default:
      headingClass = 'text-base font-black text-black dark:text-white mb-3';
  }

  return (
    <Tag className={`break-keep ${headingClass} ${className}`} {...props}>
      <span className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <span className="min-w-0 flex-1">{children}</span>
      </span>
    </Tag>
  );
}
