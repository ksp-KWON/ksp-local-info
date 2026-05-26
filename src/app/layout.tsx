import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
  description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "성남시 생활 정보 | 행사·혜택·지원금 안내",
    description: "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://ksp-local-info.pages.dev",
    siteName: "성남시 생활 정보",
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
    "name": "성남시 생활 정보",
    "url": "https://ksp-local-info.pages.dev",
    "description": "성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보",
  };

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdsenseEnabled = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-6">
            <a href="/" className="text-gray-600 hover:text-sky-600 font-medium">홈</a>
            <a href="/blog" className="text-gray-600 hover:text-sky-600 font-medium">블로그</a>
            <a href="/about" className="text-gray-600 hover:text-sky-600 font-medium">소개</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
