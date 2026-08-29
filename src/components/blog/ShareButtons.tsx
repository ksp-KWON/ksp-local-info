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
    } catch {
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`;
    window.open(kakaoUrl, '_blank', 'width=500,height=600');
  };

  return (
    <div className="my-8 p-4 sm:p-5 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)] transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
        <AppIcon name="link" size={16} strokeWidth={2.5} className="text-zinc-600 dark:text-zinc-400" />
        <span>유용한 혜택 정보 지인에게 공유하기</span>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <button
          onClick={handleKakaoShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] text-xs font-bold border border-[#E6CF00] transition-all cursor-pointer rounded-none active:scale-[0.98] shadow-xs"
        >
          <AppIcon name="chat" size={14} strokeWidth={2.5} />
          <span>카카오톡 공유</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-bold border border-zinc-900 dark:border-zinc-200 transition-all cursor-pointer rounded-none active:scale-[0.98] shadow-xs relative"
        >
          <AppIcon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2.5} />
          <span>{copied ? '복사 완료!' : 'URL 링크 복사'}</span>
        </button>
      </div>
    </div>
  );
}
