'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import NeoHeading from '@/components/ui/NeoHeading';
import NeoButton from '@/components/ui/NeoButton';
import NeoBox from '@/components/ui/NeoBox';
import NeoBadge from '@/components/ui/NeoBadge';

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
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 p-4 pb-2 flex flex-col gap-3 relative border-b-[3px] border-black dark:border-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="p-2 -ml-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors border-2 border-transparent hover:border-black dark:hover:border-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <NeoHeading level={2} highlighterColor="yellow" className="!mb-0 flex items-center gap-2 text-xl sm:text-2xl mt-1">
              💳 의정부 사랑카드 가맹점
            </NeoHeading>
          </div>
        </div>
        
        {/* 동네 선택 스크롤 메뉴 */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-3 mt-1">
          {neighborhoods.map((nb) => (
            <NeoButton
              key={nb.name}
              onClick={() => setMapCenter(nb)}
              variant={mapCenter.name === nb.name ? 'primary' : 'secondary'}
              className="!px-4 !py-1.5 !text-[13px] sm:!text-sm whitespace-nowrap shrink-0"
            >
              {nb.name}
            </NeoButton>
          ))}
        </div>
      </header>

      {/* 3. 지도 영역 */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black dark:border-white mb-4"></div>
            <p className="text-black dark:text-white font-dohyeon text-lg tracking-wide">지도 데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm z-10">
            <p className="text-red-500 font-dohyeon text-xl mb-2">지도를 불러오지 못했습니다.</p>
            <p className="text-gray-600 dark:text-gray-300 font-jua">브라우저를 새로고침 해보세요.</p>
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
          <div className="absolute bottom-6 left-4 right-4 z-20 animate-in slide-in-from-bottom-5 max-w-md mx-auto">
            <NeoBox shadowColor="blue" className="!p-5 bg-white dark:bg-[#202124]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="mb-2">
                    <NeoBadge color="blue">{selectedMerchant.category}</NeoBadge>
                  </div>
                  <h2 className="text-xl font-dohyeon text-gray-900 dark:text-white tracking-wide truncate">{selectedMerchant.name}</h2>
                </div>
                <button onClick={() => setSelectedMerchant(null)} className="shrink-0 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1.5 border-2 border-black dark:border-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-[14px] font-jua text-gray-700 dark:text-gray-300 mb-5 break-keep leading-relaxed">{selectedMerchant.address}</p>
              
              <NeoButton href={`https://map.kakao.com/link/to/${selectedMerchant.name},${selectedMerchant.lat},${selectedMerchant.lng}`} className="w-full flex justify-center !py-3 !text-base">
                길찾기 바로가기
              </NeoButton>
            </NeoBox>
          </div>
        )}
      </main>
    </div>
  );
}
