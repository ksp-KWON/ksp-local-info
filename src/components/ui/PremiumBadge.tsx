import React from 'react';

export type BadgeColor = 'charcoal' | 'ink' | 'green' | 'teal' | 'blue' | 'gray';

export interface PremiumBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

export default function PremiumBadge({
  children,
  className = '',
  color = 'charcoal',
  ...props
}: PremiumBadgeProps) {
  let colorClass = 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200/80 dark:border-zinc-700';

  if (color === 'green' || color === 'teal') {
    colorClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800';
  } else if (color === 'blue') {
    colorClass = 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/80 dark:border-sky-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-bold rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.03)] border ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
