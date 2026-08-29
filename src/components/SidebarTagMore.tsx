'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

interface Props {
  tags: string[];
}

export default function SidebarTagMore({ tags }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      {isOpen && (
        <div className="flex flex-wrap gap-1.5 text-xs font-bold mb-3 mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-none bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-xs font-bold"
            >
              <span className="text-blue-600 dark:text-blue-400 opacity-70">#</span>
              {tag}
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700 cursor-pointer ${
          !isOpen ? 'mt-3' : ''
        }`}
      >
        <div className="flex items-center gap-1.5">
          <AppIcon name="list" size={14} className="text-blue-600 dark:text-blue-400" />
          <span>{isOpen ? '태그 접기' : `인기 태그 더보기 (+${tags.length})`}</span>
        </div>
        <AppIcon
          name="chevron-down"
          size={14}
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}
