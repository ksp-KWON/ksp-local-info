import React from 'react';

type BadgeColor = 'red' | 'rose' | 'blue' | 'green' | 'teal' | 'purple' | 'indigo' | 'yellow' | 'gray';

interface PremiumBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

export default function PremiumBadge({
  children,
  className = '',
  color = 'gray',
  ...props
}: PremiumBadgeProps) {
  const colorClass =
    color === 'gray'
      ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'
      : 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-bold rounded-none border ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
