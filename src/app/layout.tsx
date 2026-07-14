import type { Metadata } from "next";
import { Noto_Sans_KR, Inter, Jua, Do_Hyeon } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jua = Jua({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

const doHyeon = Do_Hyeon({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dohyeon",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ksp-local-info-edg.pages.dev"),
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
      className={`${notoSans.variable} ${inter.variable} ${jua.variable} ${doHyeon.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
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
      <body className="min-h-full flex flex-col font-jua bg-[#f5f7fa] text-[#202124] dark:bg-[#121417] dark:text-[#e8eaed] transition-colors duration-300 pb-[calc(env(safe-area-inset-bottom,20px)+64px)] lg:pb-0 overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
