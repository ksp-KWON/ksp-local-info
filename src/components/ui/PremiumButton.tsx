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
  let baseClass = 'inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-black transition-all duration-200 rounded-none relative border-2 cursor-pointer';

  if (variant === 'primary' || variant === 'danger' || variant === 'youtube') {
    baseClass += ' bg-black text-white dark:bg-white dark:text-black border-black dark:border-white hover:opacity-85';
  } else if (variant === 'secondary') {
    baseClass += ' bg-white dark:bg-[#181a1d] text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white';
  } else if (variant === 'ghost') {
    baseClass = 'inline-flex items-center text-xs sm:text-sm font-black text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer';
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
