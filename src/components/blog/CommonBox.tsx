import React from 'react';

type BoxTone = 'blue' | 'red' | 'green' | 'yellow' | 'purple';

interface CommonBoxProps {
  tone: BoxTone;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  topElement?: React.ReactNode;
}

export default function CommonBox({ tone, title, children, icon, headerRight, topElement }: CommonBoxProps) {
  return (
    <div
      className="my-6 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-800 dark:hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)] dark:hover:shadow-[0_14px_44px_rgba(255,255,255,0.08)] transition-all duration-200 overflow-hidden rounded-none relative group"
    >
      {topElement}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 dark:via-zinc-800/10 dark:to-transparent border-b border-gray-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
          {icon && <span className="shrink-0">{icon}</span>}
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
