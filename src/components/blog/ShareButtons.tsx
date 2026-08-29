'use client';

import React, { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="my-8 p-4 sm:p-5 bg-slate-50 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 text-gray-800 dark:text-gray-200 text-sm font-bold">
        <AppIcon name="bullhorn" size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
        <span>이 유익한 의정부 생활 정보를 주변 이웃과 공유해보세요!</span>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          onClick={handleNativeShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 text-xs font-bold transition-all shadow-sm rounded-none cursor-pointer"
          title="공유하기"
        >
          <AppIcon name="external-link" size={14} />
          <span>공유하기</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm rounded-none cursor-pointer"
          title="URL 링크 복사"
        >
          <AppIcon name="copy" size={14} />
          <span>{copied ? '복사 완료! ✓' : '링크 복사'}</span>
        </button>
      </div>
    </div>
  );
}
