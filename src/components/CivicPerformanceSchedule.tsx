'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import PremiumCard from '@/components/ui/PremiumCard';
import { UIJEONGBU_PERFORMANCES_2026, CivicPerformance } from '@/data/uijeongbu-performances';

export default function CivicPerformanceSchedule() {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const filteredList = selectedMonth === 'all'
    ? UIJEONGBU_PERFORMANCES_2026
    : UIJEONGBU_PERFORMANCES_2026.filter((p) => p.month === selectedMonth);

  const months: { label: string; value: number | 'all' }[] = [
    { label: '2026 하반기 전체', value: 'all' },
    { label: '9월 공연', value: 9 },
    { label: '10월 공연', value: 10 },
    { label: '11월 공연', value: 11 },
    { label: '12월 공연', value: 12 },
  ];

  return (
    <section className="space-y-4">
      {/* 헤더 타이틀 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-none shadow-2xs" />
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight">
            2026 의정부예술의전당 월별 공연·축제 라인업
          </h2>
          <span className="px-2 py-0.5 text-[11px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-none">
            공식 실시간 연동
          </span>
        </div>
        <Link
          href="/blog/2026-09-22-uijeongbu-arts-center-ticket-parking-guide"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <span>예매 수수료 0원 & 주차 팁</span>
          <AppIcon name="chevron-right" size={13} strokeWidth={2.5} />
        </Link>
      </div>

      {/* 월별 선택 탭 바 */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
        {months.map((m) => {
          const isActive = selectedMonth === m.value;
          return (
            <button
              key={String(m.value)}
              onClick={() => setSelectedMonth(m.value)}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-none border transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-700 dark:text-zinc-300 border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              {m.label}
              {m.value !== 'all' && (
                <span className={`ml-1.5 text-[10.5px] ${isActive ? 'opacity-90' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  ({UIJEONGBU_PERFORMANCES_2026.filter((p) => p.month === m.value).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 공연 카드 리스트 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredList.map((perf: CivicPerformance) => (
          <div
            key={perf.id}
            className="group relative flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.45)] hover:shadow-[0_0_35px_rgba(0,0,0,0.15),0_0_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_rgba(0,0,0,0.65),0_0_12px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all duration-200"
          >
            <div>
              {/* 상단 메타 바 (장르, 장소, 상태) */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 text-[10.5px] font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-none">
                    {perf.month}월 공연
                  </span>
                  <span className="px-1.5 py-0.5 text-[10.5px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 rounded-none">
                    {perf.venue}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-500 dark:text-zinc-400">
                    {perf.genre}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10.5px] font-bold rounded-none border ${
                    perf.status === '예매중'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : perf.status === '예정'
                      ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {perf.status}
                </span>
              </div>

              {/* 공연 타이틀 */}
              <h3 className="text-base sm:text-[17px] font-extrabold text-zinc-950 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors tracking-tight leading-snug">
                {perf.title}
              </h3>

              {/* 일정 및 관람 안내 */}
              <div className="mt-2.5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <AppIcon name="clock" size={13} strokeWidth={2} className="shrink-0 text-zinc-400" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{perf.date}</span>
                  {perf.time && <span className="text-zinc-500 dark:text-zinc-400">({perf.time})</span>}
                </div>
                <div className="flex items-center gap-2 text-[11.5px]">
                  <span>관람등급 : {perf.target}</span>
                  <span>·</span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{perf.price}</span>
                </div>
              </div>

              {/* 관람 포인트 한 줄 요약 */}
              <p className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed bg-zinc-50/80 dark:bg-zinc-800/40 p-2.5 border-l-2 border-zinc-800 dark:border-zinc-200">
                {perf.highlight}
              </p>
            </div>

            {/* 하단 액션 버튼 영역 */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
              {perf.guideSlug ? (
                <Link
                  href={`/blog/${perf.guideSlug}`}
                  className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  <span>포털 심층 가이드</span>
                  <AppIcon name="chevron-right" size={12} strokeWidth={2.5} />
                </Link>
              ) : (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  재단 공식 누리집 직통
                </span>
              )}
              <a
                href={perf.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-bold rounded-none shadow-2xs transition-colors"
              >
                <span>공식 예매·안내</span>
                <AppIcon name="external-link" size={13} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
