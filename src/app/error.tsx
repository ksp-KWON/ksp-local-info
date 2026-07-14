'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 리포팅 서비스나 콘솔에 에러 기록
    console.error('Next.js 런타임 글로벌 에러 감지:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-8 md:p-12 border border-red-100 dark:border-red-900/30 shadow-lg rounded-2xl max-w-lg w-full">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight">
          화면을 불러오는 중 문제가 발생했습니다
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          일시적인 서버 오류이거나 네트워크 문제일 수 있습니다. <br className="hidden sm:block" />
          아래 버튼을 눌러 다시 시도하시거나 홈으로 이동해 주세요.
          <br /><br />
          <span className="inline-block px-3 py-1 bg-white dark:bg-black rounded-md text-xs font-mono text-red-500 shadow-sm border border-red-100 dark:border-red-900/50">
            {error.message || '알 수 없는 렌더링 오류'}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 hover:shadow-md transition-all active:scale-95"
          >
            화면 다시 불러오기
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
