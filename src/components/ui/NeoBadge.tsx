import React from 'react';

interface NeoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'gray' | 'blue' | 'pink' | 'yellow' | 'green' | 'red' | 'purple' | 'orange' | 'cyan';
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
  } else if (color === 'yellow') {
    bgColorClass = 'bg-yellow-50 dark:bg-yellow-900/20';
    textColorClass = 'text-yellow-600 dark:text-yellow-400';
  } else if (color === 'green') {
    bgColorClass = 'bg-green-50 dark:bg-green-900/20';
    textColorClass = 'text-green-600 dark:text-green-400';
  } else if (color === 'red') {
    bgColorClass = 'bg-red-50 dark:bg-red-900/20';
    textColorClass = 'text-red-600 dark:text-red-400';
  } else if (color === 'purple') {
    bgColorClass = 'bg-purple-50 dark:bg-purple-900/20';
    textColorClass = 'text-purple-600 dark:text-purple-400';
  } else if (color === 'orange') {
    bgColorClass = 'bg-orange-50 dark:bg-orange-900/20';
    textColorClass = 'text-orange-600 dark:text-orange-400';
  } else if (color === 'cyan') {
    bgColorClass = 'bg-cyan-50 dark:bg-cyan-900/20';
    textColorClass = 'text-cyan-600 dark:text-cyan-400';
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
