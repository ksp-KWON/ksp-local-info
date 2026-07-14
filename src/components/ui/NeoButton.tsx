import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  icon?: React.ReactNode;
}

export default function NeoButton({
  children,
  className = '',
  variant = 'primary',
  href,
  icon,
  ...props
}: NeoButtonProps) {
  let baseClass = 'group/btn relative inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 font-jua font-normal text-xs sm:text-sm border-2 border-black dark:border-white transition-all';
  
  // Neo-brutalism hover animation
  baseClass += ' hover:-translate-y-0.5 hover:-translate-x-0.5';

  if (variant === 'primary') {
    baseClass += ' bg-[var(--google-blue)] dark:bg-blue-600 text-white shadow-marker-yellow hover:shadow-marker-yellow';
  } else if (variant === 'danger') {
    baseClass += ' bg-red-600 text-white shadow-marker-yellow hover:shadow-marker-yellow';
  } else if (variant === 'secondary') {
    baseClass += ' bg-white dark:bg-[#303134] text-black dark:text-white shadow-marker-blue hover:shadow-marker-blue';
  } else if (variant === 'ghost') {
    // Basic text link style for "back to list" type buttons
    baseClass = 'inline-flex items-center text-sm font-jua font-normal text-[#5f6368] hover:text-[var(--google-blue)] transition-colors';
  }

  const content = (
    <>
      {icon && <span className={variant !== 'ghost' ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform' : 'mr-1.5'}>{icon}</span>}
      <span className={variant !== 'ghost' ? 'tracking-wide' : ''}>{children}</span>
    </>
  );

  if (href) {
    // If it's an external link
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseClass} ${className}`}>
          {content}
        </a>
      );
    }
    // If it's an internal link
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
