import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ksp-local-info-edg.pages.dev"),
  title: {
    default: "의정부 건강·생활 정보 포털 | 달빛병원·사랑카드·시정혜택 안내",
    template: "%s | 의정부 건강·생활 포털",
  },
  description: "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 놓치기 쉬운 시정 지원금과 복지 혜택을 큐레이션합니다.",
  keywords: ["의정부", "의정부달빛어린이병원", "의정부심야약국", "의정부사랑카드", "의정부지원금", "의정부건강검진", "의정부복지"],
  authors: [{ name: "의정부 건강·생활 정보 포털", url: "https://ksp-local-info-edg.pages.dev/about" }],
  creator: "의정부 건강·생활 정보 포털",
  publisher: "의정부 건강·생활 정보 포털",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ksp-local-info-edg.pages.dev",
  },
  openGraph: {
    title: "의정부 건강·생활 정보 포털 | 달빛병원·사랑카드·시정혜택 안내",
    description: "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 놓치기 쉬운 시정 지원금과 복지 혜택을 큐레이션합니다.",
    url: "https://ksp-local-info-edg.pages.dev",
    siteName: "의정부 건강·생활 정보 포털",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "의정부 건강·생활 정보 포털",
    description: "의정부시 시민을 위한 달빛어린이병원, 심야약국, 사랑카드 가맹점 지도 및 놓치기 쉬운 시정 혜택 큐레이션",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google 공식 @graph 규격 (Organization + WebSite + SearchAction 통합 구조화 데이터)
  const globalJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ksp-local-info-edg.pages.dev/#organization",
        "name": "의정부 건강·생활 정보 포털",
        "url": "https://ksp-local-info-edg.pages.dev",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ksp-local-info-edg.pages.dev/images/uijeongbu-logo.png",
        },
        "description": "의정부시 시민을 위한 공공 건강·생활 정보 및 혜택 종합 포털",
      },
      {
        "@type": "WebSite",
        "@id": "https://ksp-local-info-edg.pages.dev/#website",
        "url": "https://ksp-local-info-edg.pages.dev",
        "name": "의정부 건강·생활 정보 포털",
        "publisher": {
          "@id": "https://ksp-local-info-edg.pages.dev/#organization",
        },
        "inLanguage": "ko-KR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://ksp-local-info-edg.pages.dev/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="ko" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {/* 다크모드 화면 깜빡임(FOUC) 원천 차단 인라인 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-[#121417] dark:text-[#e8eaed] transition-colors duration-300 overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
