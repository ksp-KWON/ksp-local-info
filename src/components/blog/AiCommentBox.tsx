'use client';

import { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

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
    <div className={`bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100/50 dark:border-blue-800/50 rounded-none p-5 shadow-2xl space-y-4 ${className}`}>
      <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 flex items-center gap-2 m-0">
        <Sparkles className="w-5 h-5 text-blue-500" />
        AI 핵심 요약 노트
      </h3>
      
      <div className="text-[13px] sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pl-1 min-h-[2.5rem]">
        {!hasStarted ? (
          <button
            onClick={fetchComment}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-none font-bold transition-all duration-200 shadow-2xl hover:shadow-2xl hover:-translate-y-0.5 mt-1"
          >
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            이 정책의 AI 핵심 요약 및 꿀팁 보기
          </button>
        ) : loading ? (
          <div className="flex items-center gap-2 text-[var(--google-blue)] animate-pulse mt-1">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-600 dark:text-blue-400">지원 조건 및 핵심 혜택을 분석 중입니다... (약 2~4초 소요)</span>
          </div>
        ) : (
          <div className="space-y-2 mt-1">
            <p className={`whitespace-pre-wrap ${error ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
              {comment}
            </p>
            {!error && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 block border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                ※ 본 요약은 공공데이터 원문을 바탕으로 AI(Gemini)가 실시간 분석한 내용입니다. 실제 신청 시 반드시 공식 모집공고를 확인하시기 바랍니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
