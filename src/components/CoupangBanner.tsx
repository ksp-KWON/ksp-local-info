'use client';

import { useEffect, useRef } from 'react';

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const isEnabled = partnerId && partnerId !== "나중에_입력" && partnerId.trim() !== "";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEnabled && containerRef.current) {
      // 스크립트가 이미 로드되어 있다면 재실행할 필요가 없음
      const existingScript = document.getElementById('coupang-partner-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'coupang-partner-script';
        script.src = 'https://ads-collabo.coupang.com/g.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  // 쿠팡 파트너스 다이내믹 광고 코드 예시 레이아웃 생성
  return (
    <div ref={containerRef} className="w-full my-8 flex justify-center overflow-hidden border border-gray-100 rounded-none-none p-2 bg-gray-50">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            new PartnersAd({
              "id": ${JSON.stringify(partnerId)},
              "trackingCode": "AF2026-INFO",
              "subId": "local-info-blog",
              "type": "ad_search",
              "width": "100%",
              "height": "120"
            });
          `
        }}
      />
    </div>
  );
}
