'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin, X, Navigation } from 'lucide-react';
import AppIcon from '@/components/ui/AppIcon';

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

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const apiKey = '0aa84d125fc74f14a66a1a1f0a0d4c9f';
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
    <div className={`flex flex-col w-full bg-white dark:bg-[#181a1d] overflow-hidden mt-2 rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] border-2 border-black dark:border-white ${isWidget ? 'h-[500px]' : 'h-[700px] max-h-[80vh]'}`}>
      {/* 1. 헤더 바 */}
      <header className="bg-white dark:bg-[#181a1d] z-20 p-4 pb-3 flex flex-col gap-3 relative border-b-2 border-black dark:border-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isWidget && (
              <button onClick={() => window.history.back()} className="p-1 text-black dark:text-white hover:opacity-70 transition-opacity cursor-pointer">
                <AppIcon name="chevron-left" size={20} strokeWidth={2.5} />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white flex items-center gap-2">
              <AppIcon name="bank" size={22} strokeWidth={2.5} />
              <span>의정부사랑카드 가맹점 지도</span>
            </h1>
          </div>
          <span className="text-xs font-black text-white bg-black dark:text-black dark:bg-white px-2.5 py-0.5 border border-black dark:border-white">
            {merchants.length > 0 ? `${merchants.length}개 가맹점` : '데이터 연동'}
          </span>
        </div>

        {/* 동네 선택 스크롤 메뉴 */}
        <div className="flex overflow-x-auto scrollbar-none gap-2 pb-1">
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
      </header>

      {/* 2. 지도 영역 */}
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
          <Map
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ width: '100%', height: '100%' }}
            level={4}
          >
            {merchants.map((m) => (
              <MapMarker
                key={m.id}
                position={{ lat: m.lat, lng: m.lng }}
                onClick={() => setSelectedMerchant(m)}
              />
            ))}
          </Map>
        )}

        {/* 3. 선택된 가맹점 상세 정보 카드 (수묵 흑백 팝업) */}
        {selectedMerchant && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-white dark:bg-[#181a1d] p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] max-w-lg mx-auto">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-black text-white bg-black dark:text-black dark:bg-white px-2 py-0.5 border border-black dark:border-white mr-2">
                  {selectedMerchant.category || '가맹점'}
                </span>
                <h3 className="text-base font-black text-black dark:text-white mt-1">
                  {selectedMerchant.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
              </button>
            </div>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
              {selectedMerchant.address}
            </p>
            <div className="flex gap-2">
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(selectedMerchant.name)},${selectedMerchant.lat},${selectedMerchant.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white dark:bg-white dark:text-black font-black text-xs border-2 border-black dark:border-white"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>카카오맵 길찾기</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
