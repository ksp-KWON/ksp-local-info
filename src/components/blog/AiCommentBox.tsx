'use client';

import { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';

interface AiCommentBoxProps {
  sourceText: string;
  type: 'policy' | 'benefit' | 'event';
  className?: string;
}

export default function AiCommentBox({ sourceText, type, className = '' }: AiCommentBoxProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const fetchComment = async () => {
    setHasStarted(true);
    setLoading(true);
    setError(false);
    
    try {
      const res = await fetch('/api/generate-ai-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText, type })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `서버 통신 오류 (${res.status})`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setComment(data.comment || '코멘트를 생성하지 못했습니다.');
    } catch (err: any) {
      setError(true);
      setComment(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-[#181a1d] border border-purple-200/90 dark:border-purple-900/50 rounded-none p-5 sm:p-6 shadow-[0_2px_8px_rgba(126,34,206,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_44px_rgba(126,34,206,0.1)] transition-all duration-300 space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
        <h3 className="font-bold text-base sm:text-lg text-purple-950 dark:text-purple-200 flex items-center gap-2 m-0">
          <AppIcon name="sparkles" size={18} strokeWidth={2.5} className="text-purple-600 dark:text-purple-400" />
          <span>AI 핵심 요약 & 시정 인사이트</span>
        </h3>
        <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          Gemini AI
        </span>
      </div>
      
      <div className="text-[13.5px] sm:text-[14.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal min-h-[2.5rem]">
        {!hasStarted ? (
          <button
            onClick={fetchComment}
            className="group flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white dark:bg-purple-600 dark:hover:bg-purple-500 px-5 py-2.5 rounded-none font-bold text-xs sm:text-sm border border-purple-600 transition-all duration-200 cursor-pointer mt-1 active:scale-[0.98] shadow-xs"
          >
            <AppIcon name="zap" size={15} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span>이 정책의 AI 핵심 요약 및 꿀팁 보기</span>
          </button>
        ) : loading ? (
          <div className="flex items-center gap-2.5 text-purple-700 dark:text-purple-300 py-2">
            <AppIcon name="refresh" size={18} strokeWidth={2.5} className="animate-spin" />
            <span className="font-bold text-xs sm:text-sm">지원 조건 및 핵심 혜택을 정밀 분석 중입니다... (약 2~4초 소요)</span>
          </div>
        ) : (
          <div className="space-y-3 mt-1">
            <p className={`whitespace-pre-wrap ${error ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-900 dark:text-zinc-100 font-medium'}`}>
              {comment}
            </p>
            {!error && (
              <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 mt-3 block border-t border-zinc-100 dark:border-zinc-800 pt-3 font-normal">
                ※ 본 요약은 공공데이터 원문을 바탕으로 AI가 실시간 분석한 내용입니다. 실제 신청 시 반드시 공식 모집공고를 확인하시기 바랍니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
