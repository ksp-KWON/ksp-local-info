'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import AppIcon from '@/components/ui/AppIcon';
import { X, Navigation } from 'lucide-react';

// 의정부 주요 동네 좌표
const neighborhoods = [
  { name: '의정부역', lat: 37.7380, lng: 127.0450 },
  { name: '민락동', lat: 37.7454, lng: 127.0984 },
  { name: '신곡동', lat: 37.7336, lng: 127.0650 },
  { name: '호원동', lat: 37.7176, lng: 127.0454 },
  { name: '금오동', lat: 37.7550, lng: 127.0632 },
  { name: '가능동', lat: 37.7479, lng: 127.0336 },
];

interface HealthCheckHospital {
  BIZPLC_NM: string;
  REFINE_WGS84_LAT: number;
  REFINE_WGS84_LOGT: number;
  REFINE_ROADNM_ADDR?: string;
  REFINE_LOTNO_ADDR?: string;
  TREAT_SBJECT_CONT?: string;
  BSN_STATE_NM?: string;
}

export default function HealthCheckPage() {
  const [mapCenter, setMapCenter] = useState(neighborhoods[0]);
  const [hospitals, setHospitals] = useState<HealthCheckHospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HealthCheckHospital | null>(null);

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const apiKey = '0aa84d125fc74f14a66a1a1f0a0d4c9f';
        const res = await fetch(`https://openapi.gg.go.kr/MedcareInstClst?KEY=${apiKey}&Type=json&pIndex=1&pSize=1000&SIGUN_NM=의정부시`);
        const data = await res.json();

        if (data.MedcareInstClst && data.MedcareInstClst[1] && data.MedcareInstClst[1].row) {
          const rows = data.MedcareInstClst[1].row;
          const formatted = rows
            .filter((row: any) => row.REFINE_WGS84_LAT && row.REFINE_WGS84_LOGT)
            .map((row: any) => ({
              BIZPLC_NM: row.BIZPLC_NM,
              REFINE_WGS84_LAT: Number(row.REFINE_WGS84_LAT),
              REFINE_WGS84_LOGT: Number(row.REFINE_WGS84_LOGT),
              REFINE_ROADNM_ADDR: row.REFINE_ROADNM_ADDR || row.REFINE_LOTNO_ADDR,
              TREAT_SBJECT_CONT: row.TREAT_SBJECT_CONT || '일반검진 및 진료',
              BSN_STATE_NM: row.BSN_STATE_NM || '영업중',
            }));
          setHospitals(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch hospitals', e);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="pb-16 space-y-6">
      {/* 1. 상단 인트로 배너 */}
      <div className="mt-4 relative overflow-hidden rounded-none border-2 border-black dark:border-white bg-white dark:bg-[#181a1d] shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] p-6 sm:p-8 group">
        <div className="absolute -right-6 -bottom-6 text-black/[0.04] dark:text-white/[0.06] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <AppIcon name="stethoscope" size={160} strokeWidth={2} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider mb-3 border-2 border-black dark:border-white rounded-none">
            <AppIcon name="stethoscope" size={14} strokeWidth={2.5} />
            <span>국민건강보험공단 지정</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
            국가 건강검진 지정 의료기관 지도
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            의정부시 관내 국민건강보험 국가검진(일반/암/구강검진) 지정 병·의원 목록을 지도에서 확인하세요.
          </p>
        </div>
      </div>

      {/* 2. 지도 위젯 박스 */}
      <div className="flex flex-col w-full bg-white dark:bg-[#181a1d] overflow-hidden rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] border-2 border-black dark:border-white h-[650px] max-h-[75vh]">
        <header className="bg-white dark:bg-[#181a1d] z-20 p-4 pb-3 flex flex-col gap-3 relative border-b-2 border-black dark:border-white shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black dark:text-white flex items-center gap-2">
              <AppIcon name="hospital" size={18} strokeWidth={2.5} />
              <span>동네별 지정병원 바로가기</span>
            </h3>
            <span className="text-xs font-black text-white bg-black dark:text-black dark:bg-white px-2.5 py-0.5 border border-black dark:border-white">
              {hospitals.length > 0 ? `${hospitals.length}개 기관` : '데이터 연동'}
            </span>
          </div>

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
              {hospitals.map((h, idx) => (
                <MapMarker
                  key={`${h.BIZPLC_NM}-${idx}`}
                  position={{ lat: h.REFINE_WGS84_LAT, lng: h.REFINE_WGS84_LOGT }}
                  onClick={() => setSelectedHospital(h)}
                />
              ))}
            </Map>
          )}

          {/* 선택된 병원 팝업 */}
          {selectedHospital && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-white dark:bg-[#181a1d] p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] max-w-lg mx-auto">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-black text-white bg-black dark:text-black dark:bg-white px-2 py-0.5 border border-black dark:border-white mr-2">
                    {selectedHospital.BSN_STATE_NM}
                  </span>
                  <h3 className="text-base font-black text-black dark:text-white mt-1">
                    {selectedHospital.BIZPLC_NM}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
                </button>
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                {selectedHospital.REFINE_ROADNM_ADDR}
              </p>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-3">
                진료과목: {selectedHospital.TREAT_SBJECT_CONT}
              </p>
              <div className="flex gap-2">
                <a
                  href={`https://map.kakao.com/link/to/${encodeURIComponent(selectedHospital.BIZPLC_NM)},${selectedHospital.REFINE_WGS84_LAT},${selectedHospital.REFINE_WGS84_LOGT}`}
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
    </div>
  );
}
