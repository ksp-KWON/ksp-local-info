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
      className="my-6 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 overflow-hidden rounded-none"
    >
      {topElement}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-black/[0.04] to-transparent dark:from-white/[0.06] dark:to-transparent border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-black text-sm sm:text-base text-black dark:text-white">
          {icon && <span className="shrink-0 stroke-[2.5]">{icon}</span>}
          <span>{title}</span>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className="p-4 sm:p-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
        {children}
      </div>
    </div>
  );
}
