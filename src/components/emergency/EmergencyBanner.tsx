'use client';

import React from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

interface EmergencyBannerProps {
  className?: string;
}

export default function EmergencyBanner({ className = '' }: EmergencyBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <Link href="/services/emergency" className="group block w-full select-none">
        <div className="relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-300">
          {/* ── 1. 박스 외곽 테두리 끝(0px)까지 100% 꽉 채우는 풀 블리드 의정부 정밀 실측 지도 배경 ── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-transform duration-700 group-hover:scale-105">
            {/* 라이트 모드 실측 지도 (성모병원 레드 핀, 을지대병원 에메랄드 핀 포함) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/emergency-map-bg.png"
              alt="의정부시 24시간 응급의료 지도"
              className="absolute inset-0 w-full h-full object-cover object-center dark:hidden opacity-95"
              loading="lazy"
            />
            {/* 다크 모드 수묵 야간 실측 지도 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/emergency-map-bg-dark.png"
              alt="의정부시 24시간 응급의료 지도 (다크모드)"
              className="absolute inset-0 w-full h-full object-cover object-center hidden dark:block opacity-95"
              loading="lazy"
            />

            {/* 텍스트 가독성을 위한 수묵 앰비언트 글래스모피즘 오버레이 (좌측 텍스트는 선명하게, 우측 지도는 100% 투명 개방) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/70 via-50% to-white/10 dark:from-[#181a1d]/92 dark:via-[#181a1d]/70 dark:via-50% dark:to-[#181a1d]/15 backdrop-blur-[0.5px]" />
          </div>

          {/* ── 2. 전면 카드 콘텐츠 (내부 패딩 p-4 sm:p-5 적용) ── */}
          <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-none bg-emerald-600 dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-500/80">
                <AppIcon name="hospital" size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[11px] font-bold rounded-none shadow-2xs">
                    야간·응급의료
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                    의정부시 24시간 응급실 안내
                  </h3>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate mt-1">
                  의정부성모병원·을지대병원 응급실 위치, 비상전화번호, 진료과목을 지도에서 확인하세요.
                </p>
              </div>
            </div>

            {/* 우측 정렬 지도보기 버튼 */}
            <div className="flex justify-end sm:justify-center shrink-0">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 group-hover:bg-emerald-800 text-white text-xs font-bold shrink-0 shadow-xs transition-colors rounded-none">
                <span>지도 보기</span>
                <AppIcon name="chevron-right" size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
