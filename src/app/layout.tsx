import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ksp-local-info-edg.pages.dev"),
  title: "의정부 건강·생활 정보 포털 | 달빛병원·사랑카드·시정혜택 안내",
  description: "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 놓치기 쉬운 시정 지원금과 복지 혜택을 큐레이션합니다.",
  openGraph: {
    title: "의정부 건강·생활 정보 포털 | 달빛병원·사랑카드·시정혜택 안내",
    description: "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 놓치기 쉬운 시정 지원금과 복지 혜택을 큐레이션합니다.",
    url: "https://ksp-local-info-edg.pages.dev",
    siteName: "의정부 건강·생활 정보 포털",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "의정부 건강·생활 정보 포털",
    "url": "https://ksp-local-info-edg.pages.dev",
    "description": "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 시정 지원금 혜택",
  };

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdsenseEnabled = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  return (
    <html lang="ko" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {isAdsenseEnabled && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-[#121417] dark:text-[#e8eaed] transition-colors duration-300 overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
