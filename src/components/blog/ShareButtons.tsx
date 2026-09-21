'use client';

import React, { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return url || (typeof window !== 'undefined' ? window.location.href : '');
  };

  const handleCopy = async () => {
    const shareUrl = getShareUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
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
    const shareUrl = getShareUrl();
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`;
    window.open(kakaoUrl, '_blank', 'width=500,height=600');
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="my-8 relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50/40 to-zinc-100/30 dark:from-[#181a1d] dark:via-[#1c1f24] dark:to-[#16181b] p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.40)] hover:shadow-[0_0_35px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_35px_rgba(0,0,0,0.60)] transition-all duration-300 group">
      {/* 우측 배경 수묵 워터마크 아이콘 */}
      <div className="absolute -right-4 -bottom-4 opacity-5 text-zinc-900 dark:text-white pointer-events-none group-hover:scale-105 transition-transform duration-500">
        <AppIcon name="share" size={110} strokeWidth={1.2} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* 좌측 텍스트 안내 영역 */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10.5px] font-extrabold tracking-wider border border-zinc-200 dark:border-zinc-700">
            <AppIcon name="link" size={11} strokeWidth={2.5} />
            <span>이웃과 함께 나누는 의정부 혜택</span>
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white tracking-tight leading-snug break-keep">
            놓치기 아까운 의정부 생활 정보, 가족·지인에게 알려주세요
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            헛걸음 방지 팁과 핵심 신청 요강을 카카오톡으로 간편하게 공유할 수 있습니다.
          </p>
        </div>

        {/* 우측 세련된 버튼 그룹 */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* 카카오톡 공유 버튼 (세련된 시그니처 옐로우 & 다크 텍스트) */}
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer rounded-none border border-[#F0D500]"
          >
            <AppIcon name="chat" size={15} strokeWidth={2.5} />
            <span>카카오톡 공유</span>
          </button>

          {/* URL 복사 버튼 (모던 수묵 다크/화이트 인버전) */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer rounded-none border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 dark:border-zinc-100'
            }`}
          >
            <AppIcon name={copied ? 'check' : 'copy'} size={15} strokeWidth={copied ? 3 : 2.5} />
            <span>{copied ? '링크 복사 완료!' : 'URL 링크 복사'}</span>
          </button>

          {/* 모바일 OS 기본 공유 버튼 */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="OS 공유창 열기"
              className="p-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors cursor-pointer rounded-none md:hidden"
            >
              <AppIcon name="share" size={15} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
