'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { useEmergencyData } from '@/hooks/useEmergencyData';
import EmergencyMap from '@/components/emergency/EmergencyMap';
import EmergencyBottomSheet from '@/components/emergency/EmergencyBottomSheet';
import AppIcon from '@/components/ui/AppIcon';

interface EmergencyMapWidgetProps {
  isWidget?: boolean;
  defaultTab?: 'er' | 'pharmacy';
  hideTabs?: boolean;
}

// 의정부 주요 동네 좌표
const neighborhoods = [
  { name: '의정부역(중심)', lat: 37.7380, lng: 127.0450 },
  { name: '민락지구', lat: 37.7454, lng: 127.0984 },
  { name: '신곡/장암', lat: 37.7336, lng: 127.0650 },
  { name: '호원동', lat: 37.7176, lng: 127.0454 },
  { name: '금오동', lat: 37.7550, lng: 127.0632 },
  { name: '가능/녹양', lat: 37.7540, lng: 127.0300 },
];

export default function EmergencyMapWidget({ isWidget = false, defaultTab = 'er', hideTabs = false }: EmergencyMapWidgetProps) {
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);
  const { activeTab, setActiveTab, selectedItem, setSelectedItem, currentData } = useEmergencyData(defaultTab);

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  return (
    <div className={`flex flex-col w-full bg-white dark:bg-[#181a1d] overflow-hidden mt-2 rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] border-2 border-black dark:border-white ${isWidget ? 'h-[500px]' : 'h-[700px] max-h-[80vh]'}`}>
      {/* 1. 헤더 영역 */}
      <header className="bg-white dark:bg-[#181a1d] z-20 shrink-0 border-b-2 border-black dark:border-white">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2">
            {!isWidget && (
              <Link href="/" className="p-1 text-black dark:text-white hover:opacity-70 transition-opacity">
                <AppIcon name="chevron-left" size={20} strokeWidth={2.5} />
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white flex items-center gap-2">
              <AppIcon name="hospital" size={22} strokeWidth={2.5} />
              <span>
                {hideTabs 
                  ? (defaultTab === 'er' ? '실시간 응급실 현황' : '심야/휴일 약국')
                  : '달빛병원 & 심야약국'}
              </span>
            </h1>
          </div>
          
          {/* 동네 선택 스크롤 메뉴 (수묵 흑백 칩) */}
          <div className="flex overflow-x-auto scrollbar-none gap-2 mt-3 pb-1">
            {neighborhoods.map((nb) => (
              <button
                key={nb.name}
                onClick={() => setMapCenter(nb)}
                className={`whitespace-nowrap px-3 py-1 text-xs font-black transition-all border-2 rounded-none cursor-pointer ${
                  mapCenter.name === nb.name
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,0.9)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.9)]'
                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                }`}
              >
                {nb.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 탭 전환 버튼 */}
        {!hideTabs && (
          <div className="grid grid-cols-2 border-t-2 border-black dark:border-white">
            <button
              onClick={() => setActiveTab('er')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors border-r-2 border-black dark:border-white cursor-pointer ${
                activeTab === 'er'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <AppIcon name="stethoscope" size={16} strokeWidth={2.5} />
              <span>실시간 응급실</span>
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors cursor-pointer ${
                activeTab === 'pharmacy'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-[#181a1d] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <AppIcon name="pill" size={16} strokeWidth={2.5} />
              <span>심야/휴일 약국</span>
            </button>
          </div>
        )}
      </header>

      {/* 3. 지도 및 컨텐츠 영역 */}
      <div className="relative flex-1 w-full min-h-0">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900">
            <AppIcon name="refresh" size={32} strokeWidth={2.5} className="animate-spin text-zinc-500 mb-2" />
            <p className="text-xs font-black text-zinc-500">카카오 지도 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 text-center">
            <AppIcon name="warning" size={32} strokeWidth={2.5} className="text-black dark:text-white mb-2" />
            <p className="text-xs font-black text-black dark:text-white">지도를 불러오지 못했습니다.</p>
          </div>
        ) : (
          <>
            <EmergencyMap
              mapCenter={mapCenter}
              activeTab={activeTab}
              currentData={currentData}
              setSelectedItem={setSelectedItem}
            />

            {/* 하단 바텀시트 */}
            <EmergencyBottomSheet
              item={selectedItem}
              activeTab={activeTab}
              onClose={() => setSelectedItem(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
