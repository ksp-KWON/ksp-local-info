'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { useEmergencyData } from '@/hooks/useEmergencyData';
import EmergencyMap from '@/components/emergency/EmergencyMap';
import EmergencyBottomSheet from '@/components/emergency/EmergencyBottomSheet';
import { ArrowLeft, Stethoscope, Pill } from 'lucide-react';

interface EmergencyMapWidgetProps {
  isWidget?: boolean;
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

export default function EmergencyMapWidget({ isWidget = false }: EmergencyMapWidgetProps) {
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);
  const { activeTab, setActiveTab, selectedItem, setSelectedItem, isDataLoading, currentData } = useEmergencyData();

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  return (
    <div className={`flex flex-col w-full bg-gray-50 dark:bg-[#121212] overflow-hidden mt-2 rounded-none-none shadow-2xl border border-gray-100 dark:border-gray-800 ${isWidget ? 'h-[500px]' : 'h-[700px] max-h-[80vh]'}`}>
      {/* 1. 헤더 영역 */}
      <header className="bg-white dark:bg-[#202124] shadow-2xl z-20 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2">
            {!isWidget && (
              <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-none-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 mt-1">
              🚨 긴급! 약국 & 응급실
            </h1>
          </div>
          
          {/* 동네 선택 스크롤 메뉴 */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-4 pb-2">
            {neighborhoods.map((nb) => (
              <button
                key={nb.name}
                onClick={() => setMapCenter(nb)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-none-full text-sm font-semibold transition-all duration-200 shrink-0 ${
                  mapCenter.name === nb.name
                    ? 'bg-red-500 text-white shadow-2xl'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[15px] font-bold text-center transition-colors border-r border-gray-100 dark:border-gray-800 ${
              activeTab === 'er' 
                ? 'bg-red-50 text-red-600 border-b-2 border-b-red-600 dark:bg-red-900/10 dark:text-red-400 dark:border-b-red-500' 
                : 'bg-white dark:bg-[#202124] text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            실시간 응급실
          </button>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[15px] font-bold text-center transition-colors ${
              activeTab === 'pharmacy' 
                ? 'bg-emerald-50 text-emerald-600 border-b-2 border-b-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-b-emerald-500' 
                : 'bg-white dark:bg-[#202124] text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Pill className="w-4 h-4" />
            심야/휴일 약국
          </button>
        </div>
      </header>

      {/* 2. 지도 및 오버레이 영역 */}
      <main className="flex-1 relative">
        {(loading || isDataLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <div className={`animate-spin rounded-none-full h-10 w-10 border-t-2 border-b-2 mb-4 ${activeTab === 'er' ? 'border-red-500' : 'border-emerald-500'}`}></div>
            <p className="text-gray-800 dark:text-gray-200 font-bold tracking-wide">
              {activeTab === 'er' ? '실시간 병상 정보를 불러오는 중...' : '영업 중인 약국을 찾는 중...'}
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <p className="text-red-500 font-bold text-lg mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-600 dark:text-gray-300 font-medium">인터넷 연결을 확인하고 다시 시도해주세요.</p>
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
