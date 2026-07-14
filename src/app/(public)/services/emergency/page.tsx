'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { useEmergencyData } from '@/hooks/useEmergencyData';
import EmergencyMap from '@/components/emergency/EmergencyMap';
import EmergencyBottomSheet from '@/components/emergency/EmergencyBottomSheet';

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
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 shrink-0">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">🚨</span> 긴급! 약국 & 응급실 찾기
            </h1>
          </div>
          
          {/* 동네 선택 스크롤 메뉴 */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-3 pb-2">
            {neighborhoods.map((nb) => (
              <button
                key={nb.name}
                onClick={() => setMapCenter(nb)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                  mapCenter.name === nb.name
                    ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-md'
                    : 'bg-white dark:bg-[#2d2e30] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#1a73e8]'
                }`}
              >
                {nb.name}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('er')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'er' 
                ? 'border-[#ff4757] text-[#ff4757] bg-red-50/50 dark:bg-[#ff4757]/5' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🏥 실시간 응급실
          </button>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'pharmacy' 
                ? 'border-[#2ed573] text-[#2ed573] bg-emerald-50/50 dark:bg-[#2ed573]/5' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            💊 심야/휴일 약국
          </button>
        </div>
      </header>

      {/* 2. 지도 및 오버레이 영역 */}
      <main className="flex-1 relative">
        {(loading || isDataLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] z-10">
            <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mb-4 ${activeTab === 'er' ? 'border-[#ff4757]' : 'border-[#2ed573]'}`}></div>
            <p className="text-gray-500 font-bold">
              {activeTab === 'er' ? '실시간 병상 정보를 불러오는 중...' : '영업 중인 약국을 찾는 중...'}
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#2d2e30] z-10">
            <p className="text-red-500 font-bold mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-500 text-sm">인터넷 연결을 확인하고 다시 시도해주세요.</p>
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
