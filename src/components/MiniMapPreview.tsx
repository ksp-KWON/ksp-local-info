'use client';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

interface MiniMapPreviewProps {
  type: 'emergency' | 'currency';
}

export default function MiniMapPreview({ type }: MiniMapPreviewProps) {
  // 카카오맵 SDK 로드 (비동기 처리)
  const [loading, error] = useKakaoLoader({
    appkey: "c60e479ca3c78009474b748414de3a1b",
    libraries: ["services", "clusterer"],
  });

  // 의정부 중심 좌표 (의정부시청 근처)
  const centerLat = 37.7380;
  const centerLng = 127.0450;

  // 가상의 샘플 마커 (디자인 요소)
  const markers = [
    { lat: 37.7380, lng: 127.0450 }, // 중앙
    { lat: 37.7420, lng: 127.0500 }, // 약간 우측 위
    { lat: 37.7350, lng: 127.0400 }, // 약간 좌측 아래
    { lat: 37.7320, lng: 127.0520 }, // 우측 아래
  ];

  if (loading || error) {
    // 로딩 중이거나 에러 시 배경색만 표시
    return (
      <div className={`absolute inset-0 z-0 ${type === 'emergency' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-blue-50/50 dark:bg-blue-900/10'}`} />
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-transform duration-700 group-hover:scale-105">
      <Map
        center={{ lat: centerLat, lng: centerLng }}
        style={{ width: '100%', height: '100%' }}
        level={6} // 살짝 넓게 보이는 줌 레벨
        draggable={false} // 드래그 금지 (메인 스크롤 보호)
        zoomable={false} // 줌 금지
        disableDoubleClickZoom={true}
        keyboardShortcuts={false}
      >
        {markers.map((pos, idx) => (
          <MapMarker
            key={idx}
            position={pos}
            image={{
              src: type === 'emergency' 
                ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png' 
                : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              size: { width: 24, height: 35 },
            }}
          />
        ))}
      </Map>

      {/* 가독성을 위한 오버레이 필터 */}
      <div 
        className={`absolute inset-0 z-10 transition-colors duration-500 ${
          type === 'emergency' 
            ? 'bg-gradient-to-br from-red-50/95 via-red-50/80 to-transparent dark:from-[#2a1313]/95 dark:via-[#2a1313]/80' 
            : 'bg-gradient-to-br from-blue-50/95 via-blue-50/80 to-transparent dark:from-[#131d2a]/95 dark:via-[#131d2a]/80'
        }`}
      />
      {/* 벤토 박스 테두리와 잘 어울리도록 살짝 어두운 틴트 추가 */}
      <div className="absolute inset-0 z-10 bg-black/5 dark:bg-black/30" />
    </div>
  );
}
