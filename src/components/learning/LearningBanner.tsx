'use client';

import React from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import TopGradientLine from '@/components/ui/TopGradientLine';

interface LearningBannerProps {
  className?: string;
  totalCourses?: number;
}

export default function LearningBanner({ className = '', totalCourses = 140 }: LearningBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <Link href="/services/learning" className="group block w-full select-none">
        <div className="relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-[#202124] shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-300">
          {/* ── 0. 상단 심볼 구글 블루 그라데이션 공통 라인 ── */}
          <TopGradientLine color="blue" />

          {/* 배경 장식 수묵/SVG 워터마크 */}
          <div className="absolute -right-4 -bottom-6 text-blue-500/[0.04] dark:text-blue-400/[0.05] pointer-events-none transition-transform duration-500 group-hover:scale-105 z-0">
            <AppIcon name="compass" size={140} strokeWidth={1.5} />
          </div>

          <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* 통일된 40px 라운드 스퀘어 아이콘 */}
              <div className="w-10 h-10 rounded-none bg-blue-50 dark:bg-blue-950/50 text-[var(--google-blue)] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[var(--google-blue)] group-hover:text-white transition-colors duration-300">
                <AppIcon name="book" size={20} strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#e8f0fe] text-[var(--google-blue)] dark:bg-[#174ea6]/30 dark:text-[#8ab4f8] text-[11px] font-bold rounded-none border border-[#d2e3fc]/80 dark:border-[#174ea6]/40">
                    배움·평생교육
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    실시간 접수중 {totalCourses}개
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#202124] dark:text-white group-hover:text-[var(--google-blue)] dark:group-hover:text-[#8ab4f8] transition-colors truncate mt-1">
                  의정부시 실시간 평생학습 강좌 지도
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal truncate mt-1">
                  도서관·주민센터·청소년수련관 무료 강좌 및 야간·주말 배움을 한눈에 찾으세요.
                </p>
              </div>
            </div>

            {/* 우측 바로가기 버튼 */}
            <div className="flex justify-end sm:justify-center shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--google-blue)] text-white text-xs font-bold rounded-none shadow-xs group-hover:bg-[#1557b0] transition-colors">
                <span>강좌 지도 보기</span>
                <AppIcon name="chevron-right" size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
