'use client';

import { useState, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import NeoBox from '@/components/ui/NeoBox';

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
  const [selectedHospital, setSelectedHospital] = useState<HealthCheckHospital | null>(null);
  const [hospitals, setHospitals] = useState<HealthCheckHospital[]>([]);
  
  // 진단기 상태
  const [birthYear, setBirthYear] = useState<string>('');
  const [checkupResult, setCheckupResult] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 카카오맵 SDK 로더
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  // 실시간 API 데이터 호출 (병원 데이터)
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GG_DATA_API_KEY || 'e11209acd2854031af9d8bec7864eef4';
        const res = await fetch(`https://openapi.gg.go.kr/Hospital?KEY=${apiKey}&Type=json&pIndex=1&pSize=1000&SIGUN_NM=의정부시`);
        const data = await res.json();
        
        if (data.Hospital && data.Hospital[1] && data.Hospital[1].row) {
          // 내과가 포함되고 영업중인 곳만 필터링 (건강검진 주력)
          const validHospitals = data.Hospital[1].row.filter((h: HealthCheckHospital) => 
            h.BSN_STATE_NM && h.BSN_STATE_NM.includes('영업') && 
            h.TREAT_SBJECT_CONT && h.TREAT_SBJECT_CONT.includes('내과') &&
            h.REFINE_WGS84_LAT && h.REFINE_WGS84_LOGT
          );
          setHospitals(validHospitals);
        }
      } catch (err) {
        console.error('Failed to fetch hospitals', err);
      }
    };
    fetchHospitals();
  }, []);

  // 2026년 기준 검진 계산기
  const calculateCheckup = () => {
    if (!birthYear || birthYear.length !== 4) return;
    
    const year = parseInt(birthYear);
    const currentYear = 2026;
    const age = currentYear - year;
    const isEvenYear = year % 2 === 0;
    
    // 2026년은 짝수년도이므로 짝수년생이 대상
    const results = [];
    
    if (isEvenYear) {
      results.push("✅ 올해 국가 일반건강검진 무료 대상자입니다! (짝수년도 출생)");
      
      if (age >= 40) {
        results.push("🔬 위암 검진 대상 (만 40세 이상)");
        results.push("🎗️ 유방암 검진 대상 (만 40세 이상 여성)");
      }
    } else {
      results.push("❌ 올해 일반건강검진 대상이 아닙니다. (홀수년도 출생)");
    }
    
    if (age >= 50) {
      results.push("🔬 대장암 검진 대상 (만 50세 이상, 매년 실시)");
    }
    
    setCheckupResult(results.length > 0 ? results : ["올해 특별한 국가 암검진 대상이 아닙니다."]);
    setShowResult(true);
  };

  return (
    <NeoBox shadowColor="green" hoverEffect={false} className="!p-0 flex flex-col h-[700px] max-h-[80vh] w-full bg-gray-50 dark:bg-[#121212] overflow-hidden mt-2">
      {/* 1. 헤더 바 & 동네 선택 */}
      <header className="bg-white dark:bg-[#202124] shadow-sm z-20 p-4 pb-2 flex flex-col gap-3 relative shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-xl">🩺</span> 건강검진 스마트 매니저
          </h1>
        </div>
        
        {/* 동네 선택 스크롤 메뉴 */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {neighborhoods.map((nb) => (
            <button
              key={nb.name}
              onClick={() => setMapCenter(nb)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                mapCenter.name === nb.name
                  ? 'bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-md'
                  : 'bg-white dark:bg-[#2d2e30] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B6B]'
              }`}
            >
              {nb.name}
            </button>
          ))}
        </div>
      </header>

      {/* 2. 1분 진단기 (고정 영역) */}
      <div className="bg-white dark:bg-[#1e1e1e] p-4 border-b border-gray-200 dark:border-gray-800 shrink-0 z-10 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">올해 나는 건강검진 대상일까? (2026년 기준)</h2>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="출생연도 4자리 (예: 1980)" 
            className="flex-1 bg-gray-100 dark:bg-[#2d2e30] border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF6B6B] outline-none text-gray-900 dark:text-white"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
          <button 
            onClick={calculateCheckup}
            className="bg-[#FF6B6B] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#ff5252] transition-colors"
          >
            결과 확인
          </button>
        </div>
        
        {showResult && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg animate-fade-in">
            <ul className="space-y-1">
              {checkupResult.map((res, idx) => (
                <li key={idx} className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
                  {res}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. 지도 영역 */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#2d2e30]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6B6B] mb-4"></div>
            <p className="text-gray-500 font-bold">병원 데이터를 불러오는 중입니다...</p>
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
            onClick={() => setSelectedHospital(null)}
          >
            {hospitals.map((hospital, idx) => (
              <MapMarker
                key={`${hospital.BIZPLC_NM}-${idx}`}
                position={{ lat: hospital.REFINE_WGS84_LAT, lng: hospital.REFINE_WGS84_LOGT }}
                onClick={() => setSelectedHospital(hospital)}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 },
                }}
              />
            ))}

            {selectedHospital && (
              <div 
                className="absolute z-10 bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm"
              >
                <div className="bg-white dark:bg-[#202124] rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up">
                  <div className="bg-[#FF6B6B] px-4 py-3 flex justify-between items-center">
                    <h3 className="font-bold text-white text-base truncate pr-4">
                      {selectedHospital.BIZPLC_NM}
                    </h3>
                    <button 
                      onClick={() => setSelectedHospital(null)}
                      className="text-white/80 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">📍</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                        {selectedHospital.REFINE_ROADNM_ADDR || selectedHospital.REFINE_LOTNO_ADDR}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">🩺</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                        {selectedHospital.TREAT_SBJECT_CONT}
                      </p>
                    </div>
                    
                    <a 
                      href={`https://map.kakao.com/link/to/${selectedHospital.BIZPLC_NM},${selectedHospital.REFINE_WGS84_LAT},${selectedHospital.REFINE_WGS84_LOGT}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 w-full block text-center bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      길찾기
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Map>
        )}
      </main>
    </NeoBox>
  );
}
