'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

interface MerchantItem {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
}

export default function LocalCurrencyMapPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(null);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  
  // 의정부 주요 동네 좌표
  const neighborhoods = [
    { name: '의정부역', lat: 37.7380, lng: 127.0450 },
    { name: '민락동', lat: 37.7454, lng: 127.0984 },
    { name: '신곡동', lat: 37.7336, lng: 127.0650 },
    { name: '호원동', lat: 37.7176, lng: 127.0454 },
    { name: '금오동', lat: 37.7550, lng: 127.0632 },
    { name: '가능동', lat: 37.7479, lng: 127.0336 },
  ];
  
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);

  // 카카오맵 SDK 로더 (next/script 대신 공식 훅 사용)
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  // 실시간 API 데이터 호출 (클라이언트 직접 호출)
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GG_DATA_API_KEY || 'e11209acd2854031af9d8bec7864eef4';
        const res = await fetch(`https://openapi.gg.go.kr/RegionMnyFacltStus?KEY=${apiKey}&Type=json&pIndex=1&pSize=1000&SIGUN_NM=의정부시`);
        const data = await res.json();
        
        if (data.RegionMnyFacltStus && data.RegionMnyFacltStus[1] && data.RegionMnyFacltStus[1].row) {
          const rows = data.RegionMnyFacltStus[1].row;
          const formattedMerchants = rows
            .filter((row: { REFINE_WGS84_LAT: string; REFINE_WGS84_LOGT: string }) => row.REFINE_WGS84_LAT && row.REFINE_WGS84_LOGT)
            .map((row: { CMPNM_NM: string; INDUTYPE_NM: string; REFINE_WGS84_LAT: string; REFINE_WGS84_LOGT: string; REFINE_ROADNM_ADDR: string; REFINE_LOTNO_ADDR: string }, index: number) => ({
              id: `1-${index}`,
              name: row.CMPNM_NM,
              category: row.INDUTYPE_NM,
              lat: Number(row.REFINE_WGS84_LAT),
              lng: Number(row.REFINE_WGS84_LOGT),
              address: row.REFINE_ROADNM_ADDR || row.REFINE_LOTNO_ADDR,
            }));
          setMerchants(formattedMerchants);
        }
      } catch (err) {
        console.error('Failed to load merchants', err);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-[#121212]">
      {/* 2. 헤더 바 */}
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 p-4 pb-2 flex flex-col gap-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">💳</span> 의정부 사랑카드 가맹점
            </h1>
          </div>
        </div>
        
        {/* 동네 선택 스크롤 메뉴 */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {neighborhoods.map((nb) => (
            <button
              key={nb.name}
              onClick={() => setMapCenter(nb)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                mapCenter.name === nb.name
                  ? 'bg-[#0090D6] border-[#0090D6] text-white shadow-md'
                  : 'bg-white dark:bg-[#2d2e30] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#0090D6]'
              }`}
            >
              {nb.name}
            </button>
          ))}
        </div>
      </header>

      {/* 3. 지도 영역 */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#2d2e30]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0090D6] mb-4"></div>
            <p className="text-gray-500 font-bold">지도 데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#2d2e30]">
            <p className="text-red-500 font-bold mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-500 text-sm">브라우저를 새로고침 해보세요.</p>
          </div>
        )}

        {!loading && !error && (
          <Map
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ width: '100%', height: '100%' }}
            level={4}
            onClick={() => setSelectedMerchant(null)}
          >
            {merchants.map((merchant) => (
              <MapMarker
                key={merchant.id}
                position={{ lat: merchant.lat, lng: merchant.lng }}
                onClick={() => setSelectedMerchant(merchant)}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                  size: { width: 24, height: 35 },
                }}
              />
            ))}
          </Map>
        )}

        {/* 4. 선택된 가맹점 팝업 정보창 */}
        {selectedMerchant && (
          <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-[#202124] rounded-2xl shadow-xl p-5 border border-gray-100 dark:border-white/5 z-20 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="inline-block px-2 py-1 bg-[#0090D6]/10 text-[#0090D6] dark:text-[#8ab4f8] text-xs font-bold rounded-lg mb-2">
                  {selectedMerchant.category}
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedMerchant.name}</h2>
              </div>
              <button onClick={() => setSelectedMerchant(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedMerchant.address}</p>
            
            <button className="w-full bg-[#0090D6] hover:bg-[#007ab8] text-white font-bold py-3 rounded-xl transition-colors shadow-md">
              길찾기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
