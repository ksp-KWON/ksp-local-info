'use client';

import React, { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

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
    <PremiumCard
      hoverEffect={true}
      className="my-8 p-4 sm:p-5 !flex-col sm:!flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
        <AppIcon name="link" size={16} strokeWidth={2.5} className="text-zinc-600 dark:text-zinc-400" />
        <span>유용한 혜택 정보 지인에게 공유하기</span>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <PremiumButton
          variant="kakao"
          size="sm"
          icon="chat"
          onClick={handleKakaoShare}
          className="flex-1 sm:flex-none"
        >
          카카오톡 공유
        </PremiumButton>

        <PremiumButton
          variant="primary"
          size="sm"
          icon={copied ? 'check' : 'copy'}
          onClick={handleCopy}
          className="flex-1 sm:flex-none"
        >
          {copied ? '복사 완료!' : 'URL 링크 복사'}
        </PremiumButton>
      </div>
    </PremiumCard>
  );
}
