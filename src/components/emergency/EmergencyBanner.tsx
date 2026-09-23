'use client';

import React from 'react';
import Link from 'next/link';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon from '@/components/ui/AppIcon';

interface EmergencyBannerProps {
  className?: string;
}

export default function EmergencyBanner({ className = '' }: EmergencyBannerProps) {
  // 카카오맵 SDK 로드 (비동기 처리)
  const [loading, error] = useKakaoLoader({
    appkey: 'c60e479ca3c78009474b748414de3a1b',
    libraries: ['services', 'clusterer'],
  });

  // 의정부 중심 좌표 (금오동 행정타운 & 성모/을지대병원 중심 권역)
  const centerLat = 37.7550;
  const centerLng = 127.0690;

  // 주요 권역 응급의료센터 핀
  const hospitalMarkers = [
    { name: '의정부성모병원 응급의료센터', lat: 37.7584, lng: 127.0754 },
    { name: '의정부을지대학교병원 응급의료센터', lat: 37.7516, lng: 127.0631 },
  ];

  return (
    <div className={`w-full ${className}`}>
      <Link href="/services/emergency" className="group block w-full select-none">
        <PremiumCard
          hoverEffect={true}
          className="p-4 sm:p-5 min-h-0 relative overflow-hidden rounded-none border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 transition-all duration-300"
        >
          {/* ── 1. 박스 전체를 가득 채우는 풀 블리드 지도 배경 (Full Map Background) ── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-transform duration-700 group-hover:scale-105">
            {/* 1-1. 즉각 렌더링 고해상도 의정부 간선 도로망 & 수계 벡터 지도 (로딩 지연/네트워크 무관 100% 보장) */}
            <div className="absolute inset-0 w-full h-full bg-[#f3f5f8] dark:bg-[#1a1c20]">
              <svg className="w-full h-full object-cover opacity-85 dark:opacity-60" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <defs>
                  <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.7" className="text-gray-300/60 dark:text-zinc-700/40" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#city-grid)" />
                
                {/* 중랑천 및 부용천 수계 곡선 */}
                <path d="M 150 0 Q 300 200 480 220 T 850 400" fill="none" stroke="#93c5fd" strokeWidth="16" className="dark:stroke-blue-900/60 opacity-70" />
                <path d="M 480 220 Q 620 180 1000 200" fill="none" stroke="#bae6fd" strokeWidth="10" className="dark:stroke-sky-950/60 opacity-60" />
                
                {/* 주요 간선 도로망 (동일로, 호국로, 평화로) */}
                <path d="M 0 120 L 1000 280" stroke="#cbd5e1" strokeWidth="8" className="dark:stroke-zinc-700/70" />
                <path d="M 0 120 L 1000 280" stroke="#ffffff" strokeWidth="4" className="dark:stroke-zinc-600/50" />
                <path d="M 420 0 L 520 400" stroke="#cbd5e1" strokeWidth="10" className="dark:stroke-zinc-700/70" />
                <path d="M 420 0 L 520 400" stroke="#ffffff" strokeWidth="5" className="dark:stroke-zinc-600/50" />
                <path d="M 750 0 L 680 400" stroke="#cbd5e1" strokeWidth="7" className="dark:stroke-zinc-700/60" />
                
                {/* 병원 거점 위치 마커 펄스 원 */}
                <circle cx="490" cy="140" r="14" fill="#10b981" className="opacity-20 animate-ping" />
                <circle cx="490" cy="140" r="7" fill="#059669" />
                <circle cx="720" cy="160" r="14" fill="#ef4444" className="opacity-20 animate-ping" />
                <circle cx="720" cy="160" r="7" fill="#dc2626" />
              </svg>
            </div>

            {/* 1-2. 카카오맵 실제 지도 레이어 (로드 완료 시 부드럽게 결합) */}
            {!loading && !error && (
              <div className="absolute inset-0 z-1 w-full h-full opacity-70 dark:opacity-50 transition-opacity duration-500">
                <Map
                  center={{ lat: centerLat, lng: centerLng }}
                  style={{ width: '100%', height: '100%' }}
                  level={6}
                  draggable={false}
                  zoomable={false}
                  disableDoubleClickZoom={true}
                  keyboardShortcuts={false}
                >
                  {hospitalMarkers.map((pos, idx) => (
                    <MapMarker
                      key={idx}
                      position={{ lat: pos.lat, lng: pos.lng }}
                      image={{
                        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                        size: { width: 22, height: 32 },
                      }}
                    />
                  ))}
                </Map>
              </div>
            )}

            {/* 1-3. 텍스트 가독성을 위한 수묵 앰비언트 글래스모피즘 오버레이 */}
            <div className="absolute inset-0 z-2 bg-gradient-to-r from-white/92 via-white/80 to-white/45 dark:from-[#181a1d]/94 dark:via-[#181a1d]/85 dark:to-[#181a1d]/50 backdrop-blur-[1px] transition-colors" />
            
            {/* 미세 테두리 음영 */}
            <div className="absolute inset-0 z-2 bg-black/[0.02] dark:bg-black/20" />
          </div>

          {/* ── 2. 전면 카드 콘텐츠 (좌측 텍스트 & 우측 지도보기 버튼) ── */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 w-full">
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
        </PremiumCard>
      </Link>
    </div>
  );
}
