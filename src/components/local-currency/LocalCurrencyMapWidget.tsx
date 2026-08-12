'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin, X, Navigation } from 'lucide-react';

interface MerchantItem {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
}

interface LocalCurrencyMapWidgetProps {
  isWidget?: boolean;
}

// 의정부 주요 동네 좌표
const neighborhoods = [
  { name: '의정부역', lat: 37.7380, lng: 127.0450 },
  { name: '민락동', lat: 37.7454, lng: 127.0984 },
  { name: '신곡동', lat: 37.7336, lng: 127.0650 },
  { name: '호원동', lat: 37.7176, lng: 127.0454 },
  { name: '금오동', lat: 37.7550, lng: 127.0632 },
  { name: '가능동', lat: 37.7479, lng: 127.0336 },
];

export default function LocalCurrencyMapWidget({ isWidget = false }: LocalCurrencyMapWidgetProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(null);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  
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
    <div className={`flex flex-col w-full bg-gray-50 dark:bg-[#121212] overflow-hidden mt-2 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 ${isWidget ? 'h-[500px]' : 'h-[700px] max-h-[80vh]'}`}>
      {/* 2. 헤더 바 */}
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 p-4 pb-2 flex flex-col gap-3 relative border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isWidget && (
              <button onClick={() => window.history.back()} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 mt-1">
              💳 의정부 사랑카드 가맹점
            </h1>
          </div>
        </div>
        
        {/* 동네 선택 스크롤 메뉴 */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-3 mt-1">
          {neighborhoods.map((nb) => (
            <button
              key={nb.name}
              onClick={() => setMapCenter(nb)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 shrink-0 ${
                mapCenter.name === nb.name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-800 dark:text-gray-200 font-bold tracking-wide">지도 데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <p className="text-red-500 font-bold text-lg mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-600 dark:text-gray-300 font-medium">브라우저를 새로고침 해보세요.</p>
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
          <div className="absolute bottom-6 left-4 right-4 z-20 animate-slide-up max-w-md mx-auto">
            <div className="p-5 bg-white/95 dark:bg-[#1a1c20]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="mb-2">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {selectedMerchant.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">{selectedMerchant.name}</h2>
                </div>
                <button onClick={() => setSelectedMerchant(null)} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full p-2 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-start gap-2 mb-5 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-[14px] font-medium text-gray-600 dark:text-gray-300 break-keep leading-relaxed">{selectedMerchant.address}</p>
              </div>
              
              <a 
                href={`https://map.kakao.com/link/to/${selectedMerchant.name},${selectedMerchant.lat},${selectedMerchant.lng}`} 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm hover:-translate-y-0.5"
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="w-4 h-4" />
                길찾기 바로가기
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
