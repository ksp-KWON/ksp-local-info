import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'youtube';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  icon?: React.ReactNode;
}

export default function PremiumButton({
  children,
  className = '',
  variant = 'primary',
  href,
  icon,
  ...props
}: PremiumButtonProps) {
  let baseClass = 'inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-none relative border shadow-xs cursor-pointer active:scale-[0.99]';

  if (variant === 'primary' || variant === 'youtube') {
    baseClass += ' bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:shadow-md';
  } else if (variant === 'danger') {
    baseClass += ' bg-rose-600 text-white dark:bg-rose-700 dark:text-white border-rose-600 dark:border-rose-700 hover:bg-rose-700 hover:shadow-md';
  } else if (variant === 'secondary') {
    baseClass += ' bg-white dark:bg-[#181a1d] text-zinc-900 dark:text-zinc-100 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-800 dark:hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60';
  } else if (variant === 'ghost') {
    baseClass = 'inline-flex items-center text-xs sm:text-sm font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer border-0 shadow-none';
  }

  const content = (
    <>
      {icon && <span className={variant !== 'ghost' ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform' : 'mr-1.5'}>{icon}</span>}
      <span className={variant !== 'ghost' ? 'relative z-10' : ''}>{children}</span>
    </>
  );

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseClass} ${className}`}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={`${baseClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {content}
    </button>
  );
}
