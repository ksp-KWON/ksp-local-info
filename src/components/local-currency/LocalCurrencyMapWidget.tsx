'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
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
  { name: '망월사', lat: 37.7176, lng: 127.0454 },
  { name: '금오동', lat: 37.7550, lng: 127.0632 },
  { name: '가능동', lat: 37.7479, lng: 127.0336 },
];

export default function LocalCurrencyMapWidget({ isWidget = false }: LocalCurrencyMapWidgetProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(null);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);

  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const apiKey = '0aa84d125fc74f14a66a1a1f0a0d4c9f';
        const res = await fetch(`https://openapi.gg.go.kr/RegionMnyFacltStus?KEY=${apiKey}&Type=json&pIndex=1&pSize=1000&SIGUN_NM=${encodeURIComponent('의정부시')}`);
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
        console.error('Failed to load local currency merchants', err);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <div className={`flex flex-col w-full bg-white dark:bg-[#181a1d] overflow-hidden mt-2 rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-gray-200/90 dark:border-zinc-800 ${isWidget ? 'h-[500px]' : 'h-[700px] max-h-[80vh]'}`}>
      <header className="bg-white dark:bg-[#181a1d] z-20 shrink-0 border-b border-gray-200/80 dark:border-zinc-800 p-4 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <AppIcon name="bank" size={22} strokeWidth={2} />
          <span>의정부 사랑카드 가맹점 지도</span>
        </h1>
        <div className="flex overflow-x-auto scrollbar-none gap-2 mt-3 pb-1">
          {neighborhoods.map((nb) => (
            <button
              key={nb.name}
              onClick={() => setMapCenter(nb)}
              className={`px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-none transition-all border ${
                mapCenter.name === nb.name
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                  : 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700'
              }`}
            >
              {nb.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-500 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-400 border-t-zinc-900 dark:border-t-white animate-spin" />
            <p className="text-xs font-bold">지도를 불러오는 중입니다...</p>
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

        {selectedMerchant && (
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-none z-30 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedMerchant.category}</span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">{selectedMerchant.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{selectedMerchant.address}</p>
            </div>
            <button onClick={() => setSelectedMerchant(null)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-sm font-bold">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
