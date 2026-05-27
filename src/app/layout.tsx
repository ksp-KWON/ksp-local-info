import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "의정부시 생활 정보 | 행사·혜택·지원금 안내",
  description: "의정부시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "의정부시 생활 정보 | 행사·혜택·지원금 안내",
    description: "의정부시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://ksp-local-info-edg.pages.dev",
    siteName: "의정부시 생활 정보",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // WebSite 및 BreadcrumbList (기본) 스키마 JSON-LD 설정
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "의정부시 생활 정보",
    "url": "https://ksp-local-info-edg.pages.dev",
    "description": "의정부시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보",
  };

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdsenseEnabled = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-6">
            <a href="/" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors flex items-center gap-1">
              <span>🏠</span> 홈
            </a>
            <a href="/blog" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors flex items-center gap-1">
              <span>📝</span> 블로그
            </a>
            <a href="/about" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors flex items-center gap-1">
              <span>ℹ️</span> 소개
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
