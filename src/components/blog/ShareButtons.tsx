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
    <div className="my-8 p-4 sm:p-5 bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-black text-black dark:text-white">
        <AppIcon name="link" size={16} strokeWidth={2.5} />
        <span>유용한 혜택 정보 지인에게 공유하기</span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleKakaoShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-black border-2 border-black transition-all cursor-pointer"
        >
          <AppIcon name="chat" size={14} strokeWidth={2.5} />
          <span>카카오톡 공유</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-black border-2 border-black dark:border-white transition-all cursor-pointer relative"
        >
          <AppIcon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2.5} />
          <span>{copied ? '복사 완료!' : 'URL 링크 복사'}</span>
        </button>
      </div>
    </div>
  );
}
