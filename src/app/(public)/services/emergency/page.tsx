'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { useEmergencyData } from '@/hooks/useEmergencyData';
import EmergencyMap from '@/components/emergency/EmergencyMap';
import EmergencyBottomSheet from '@/components/emergency/EmergencyBottomSheet';
import NeoHeading from '@/components/ui/NeoHeading';
import NeoButton from '@/components/ui/NeoButton';

// 의정부 주요 동네 좌표
const neighborhoods = [
  { name: '의정부역(중심)', lat: 37.7380, lng: 127.0450 },
  { name: '민락지구', lat: 37.7454, lng: 127.0984 },
  { name: '신곡/장암', lat: 37.7336, lng: 127.0650 },
  { name: '호원동', lat: 37.7176, lng: 127.0454 },
  { name: '금오동', lat: 37.7550, lng: 127.0632 },
  { name: '가능/녹양', lat: 37.7540, lng: 127.0300 },
];

export default function EmergencyPage() {
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);
  const { activeTab, setActiveTab, selectedItem, setSelectedItem, isDataLoading, currentData } = useEmergencyData();

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-[#121212]">
      {/* 1. 헤더 영역 */}
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 shrink-0 border-b-[3px] border-black dark:border-white">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 -ml-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors border-2 border-transparent hover:border-black dark:hover:border-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <NeoHeading level={2} highlighterColor="red" className="!mb-0 flex items-center gap-2 text-xl sm:text-2xl mt-1">
              🚨 긴급! 약국 & 응급실
            </NeoHeading>
          </div>
          
          {/* 동네 선택 스크롤 메뉴 */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-4 pb-2">
            {neighborhoods.map((nb) => (
              <NeoButton
                key={nb.name}
                onClick={() => setMapCenter(nb)}
                variant={mapCenter.name === nb.name ? 'danger' : 'secondary'}
                className="!px-4 !py-1.5 !text-[13px] sm:!text-sm whitespace-nowrap shrink-0"
              >
                {nb.name}
              </NeoButton>
            ))}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-t-2 border-black dark:border-white">
          <button
            onClick={() => setActiveTab('er')}
            className={`flex-1 py-3 text-[15px] font-dohyeon text-center border-r-2 border-black dark:border-white transition-colors ${
              activeTab === 'er' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 dark:bg-[#2d2e30] text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200'
            }`}
          >
            🏥 실시간 응급실
          </button>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex-1 py-3 text-[15px] font-dohyeon text-center transition-colors ${
              activeTab === 'pharmacy' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 dark:bg-[#2d2e30] text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200'
            }`}
          >
            💊 심야/휴일 약국
          </button>
        </div>
      </header>

      {/* 2. 지도 및 오버레이 영역 */}
      <main className="flex-1 relative">
        {(loading || isDataLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 mb-4 ${activeTab === 'er' ? 'border-red-500' : 'border-green-500'}`}></div>
            <p className="text-black dark:text-white font-dohyeon text-lg tracking-wide">
              {activeTab === 'er' ? '실시간 병상 정보를 불러오는 중...' : '영업 중인 약국을 찾는 중...'}
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <p className="text-red-500 font-dohyeon text-xl mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-600 dark:text-gray-300 font-jua">인터넷 연결을 확인하고 다시 시도해주세요.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <EmergencyMap 
              mapCenter={mapCenter}
              activeTab={activeTab}
              currentData={currentData}
              setSelectedItem={setSelectedItem}
            />
            <EmergencyBottomSheet 
              item={selectedItem}
              activeTab={activeTab}
              onClose={() => setSelectedItem(null)}
            />
          </>
        )}
      </main>
    </div>
  );
}
