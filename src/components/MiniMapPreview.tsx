'use client';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

interface MiniMapPreviewProps {
  type: 'emergency' | 'currency' | 'health-check';
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
    // 로딩 중이거나 에러 시 무채색 배경색만 표시
    return (
      <div className="absolute inset-0 z-0 bg-gray-100 dark:bg-[#2a2a2a]" />
    );
  }

  const getMarkerSrc = () => {
    switch (type) {
      case 'emergency':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
      case 'currency':
        return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      case 'health-check':
      default:
        return 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png';
    }
  };

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
              src: getMarkerSrc(),
              size: { width: 24, height: 35 },
            }}
          />
        ))}
      </Map>

      {/* 가독성을 위한 오버레이 필터 및 흐림 효과(backdrop-blur) */}
      <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-gradient-to-br from-white/95 via-white/80 to-transparent dark:from-[#121212]/95 dark:via-[#121212]/80" />
      
      {/* 벤토 박스 테두리와 잘 어울리도록 살짝 어두운 틴트 추가 */}
      <div className="absolute inset-0 z-10 bg-black/5 dark:bg-black/30" />
    </div>
  );
}
