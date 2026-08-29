import React from 'react';
import { BLOG_TONE_TOKENS, BlogTone } from '@/lib/blog-tokens';

interface CommonBoxProps {
  tone?: BlogTone;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  topElement?: React.ReactNode;
}

export default function CommonBox({ tone = 'blue', title, children, icon, headerRight, topElement }: CommonBoxProps) {
  const token = BLOG_TONE_TOKENS[tone] || BLOG_TONE_TOKENS.blue;

  return (
    <div
      className={`my-6 bg-white dark:bg-[#181a1d] ${token.tailwind.border} ${token.tailwind.hoverBorder} shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.75)] transition-all duration-300 overflow-hidden rounded-none relative group`}
    >
      {topElement}
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${token.tailwind.headerGradient}`}>
        <div className={`flex items-center gap-2 font-bold text-sm sm:text-base ${token.tailwind.titleColor}`}>
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
