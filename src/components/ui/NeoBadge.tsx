import React from 'react';

interface NeoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'gray' | 'blue' | 'pink' | 'yellow' | 'green';
}

export default function NeoBadge({
  children,
  className = '',
  color = 'gray',
  ...props
}: NeoBadgeProps) {
  let bgColorClass = 'bg-gray-100 dark:bg-[#303134]';
  let textColorClass = 'text-gray-800 dark:text-[#e8eaed]';

  if (color === 'blue') {
    bgColorClass = 'bg-blue-50 dark:bg-blue-900/20';
    textColorClass = 'text-blue-600 dark:text-blue-400';
  } else if (color === 'pink') {
    bgColorClass = 'bg-pink-50 dark:bg-pink-900/20';
    textColorClass = 'text-pink-600 dark:text-pink-400';
  }

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-jua font-normal border-2 border-black dark:border-white uppercase tracking-wider ${bgColorClass} ${textColorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
