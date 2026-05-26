'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: string;
  responsive?: string;
}

export default function AdBanner({ slot, format = 'auto', responsive = 'true' }: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdsenseEnabled = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  useEffect(() => {
    if (isAdsenseEnabled) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Adsense initialization failed', err);
      }
    }
  }, [isAdsenseEnabled]);

  if (!isAdsenseEnabled) {
    return null;
  }

  return (
    <div className="w-full my-8 flex justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
