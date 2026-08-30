import React from 'react';

interface CommonBoxProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  topElement?: React.ReactNode;
  tone?: string;
  className?: string;
}

export default function CommonBox({
  title,
  children,
  icon,
  headerRight,
  topElement,
  className = '',
}: CommonBoxProps) {
  return (
    <div
      className={`my-6 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden rounded-none relative group ${className}`}
    >
      {topElement}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/60 dark:via-zinc-800/20 dark:to-transparent border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-zinc-950 dark:text-white">
          {icon && <span className="shrink-0 text-zinc-800 dark:text-zinc-200">{icon}</span>}
          <span>{title}</span>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className="p-4 sm:p-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-normal">
        {children}
      </div>
    </div>
  );
}
