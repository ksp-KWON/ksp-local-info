import React from 'react';
import Link from 'next/link';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald' | 'amber' | 'kakao' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: AppIconName;
  iconPosition?: 'left' | 'right';
  href?: string;
  isExternal?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function PremiumButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  href,
  isExternal = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}: PremiumButtonProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm font-bold gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base font-bold gap-2.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white border-zinc-900 dark:border-zinc-200 shadow-xs',
    secondary: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200/90 dark:border-zinc-700 shadow-xs',
    outline: 'bg-white dark:bg-[#181a1d] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-500 shadow-xs',
    ghost: 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 border-emerald-600 dark:border-emerald-500 shadow-xs',
    amber: 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 border-amber-600 dark:border-amber-500 shadow-xs',
    kakao: 'bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] border-[#E6CF00] shadow-xs',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 border-rose-600 dark:border-rose-500 shadow-xs',
  };

  const baseClasses = `inline-flex items-center justify-center font-bold rounded-none border transition-all duration-200 active:scale-[0.98] cursor-pointer ${fullWidth ? 'w-full' : ''} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const iconElement = icon ? (
    <AppIcon name={icon} size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : 15} strokeWidth={2.5} className="shrink-0" />
  ) : null;

  const content = (
    <>
      {icon && iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {icon && iconPosition === 'right' && iconElement}
    </>
  );

  if (href) {
    if (isExternal || href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {content}
    </button>
  );
}
