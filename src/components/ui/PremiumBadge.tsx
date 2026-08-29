import React from 'react';

export type BadgeColor = 'charcoal' | 'ink' | 'green' | 'teal' | 'blue' | 'indigo' | 'purple' | 'amber' | 'rose' | 'gray';

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
    colorClass = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (color === 'blue' || color === 'indigo') {
    colorClass = 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800';
  } else if (color === 'amber') {
    colorClass = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (color === 'purple') {
    colorClass = 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  } else if (color === 'rose') {
    colorClass = 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-bold rounded-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] border ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
