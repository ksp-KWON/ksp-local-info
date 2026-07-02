import type { Metadata } from "next";
import { Noto_Sans_KR, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SidebarContent from "@/components/SidebarContent";
import SearchBar from "@/components/SearchBar";
import SmartStickyLayout from "@/components/SmartStickyLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { getSortedPostsData } from "@/lib/posts";
import { ThemeProvider } from "@/components/ThemeProvider";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://ksp-local-info-edg.pages.dev"),
  title: "의정부시 생활 정보 | 행사·혜택·지원금 안내",
  description: "의정부시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  alternates: {
    canonical: "/",
  },
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
  const posts = getSortedPostsData();
  const tagCounts: Record<string, number> = {};
  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

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
      className={`${notoSans.variable} ${inter.variable} h-full antialiased overflow-x-hidden`}
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
      <body className="min-h-full flex flex-col bg-gradient-to-br from-[#ffffff] via-[#f8f9fa] to-[#f1f3f4] text-[#202124] dark:from-[#202124] dark:via-[#1c1c1e] dark:to-[#171717] dark:text-[#e8eaed] transition-colors duration-300 pb-[calc(env(safe-area-inset-bottom,20px)+64px)] lg:pb-0 overflow-x-clip">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          
          {/* 1. 프리미엄 패밀리룩 App Bar (White/Dark Glassmorphism + Sharp Edges) */}
          <header className="sticky top-0 z-50 w-full h-[64px] border-b border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-colors">
            <div className="mx-auto flex h-full w-[92vw] xl:w-[85vw] max-w-7xl items-center justify-between px-2 sm:px-5">

              {/* 로고/제목 영역 */}
              <div className="flex items-center min-w-0 flex-1 mr-1 sm:mr-2">
                <div className="font-sans font-extrabold text-lg sm:text-xl min-w-0 tracking-tight">
                  <Link href="/" className="group flex items-center gap-2 sm:gap-2.5 whitespace-nowrap overflow-hidden">
                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-[#0090D6] dark:bg-[#0090D6] rounded-none border border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.12)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-all duration-300 p-1.5 z-10 text-white text-xl">
                      🏥
                    </div>
                    <span className="hidden sm:inline font-extrabold text-[#3c4043] dark:text-[#e8eaed] group-hover:opacity-80 transition-opacity truncate tracking-tight">
                      의정부 건강·생활 정보 포털
                    </span>
                    <span className="sm:hidden font-extrabold text-[15px] text-[#3c4043] dark:text-[#e8eaed] truncate tracking-tight">
                      의정부 생활정보
                    </span>
                    <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 ml-1 rounded-sm bg-gray-100 dark:bg-gray-800 text-[9px] font-black text-[#0090D6] dark:text-[#0090D6] tracking-widest uppercase border border-gray-200 dark:border-gray-700">
                      Uijeongbu City
                    </span>
                  </Link>
                </div>
              </div>

              {/* 우측 메뉴 영역 */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <SearchBar />
                <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5">
                  <Link href="/" className="p-2 sm:p-2.5 rounded-none border border-transparent hover:border-[#0090D6]/30 text-[#3c4043] dark:text-[#e8eaed] hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-cyan-50/50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-[#0090D6] dark:hover:text-[#0090D6] hover:shadow-sm transition-all duration-200 flex items-center justify-center group" aria-label="홈" title="홈">
                    <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </Link>
                  <Link href="/blog" className="p-2 sm:p-2.5 rounded-none border border-transparent hover:border-[#0090D6]/30 text-[#3c4043] dark:text-[#e8eaed] hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-cyan-50/50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-[#0090D6] dark:hover:text-[#0090D6] hover:shadow-sm transition-all duration-200 flex items-center justify-center group" aria-label="건강 정보 블로그" title="건강 정보 블로그">
                    <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M3 15h6"></path>
                      <path d="M3 19h6"></path>
                      <path d="M10 15h8"></path>
                      <path d="M10 19h8"></path>
                    </svg>
                  </Link>
                </nav>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* 3. 티스토리 2단 레이아웃 본문 75% : 사이드바 25% 구조 */}
          <SmartStickyLayout
            mainContent={children}
            sidebarContent={<SidebarContent tags={sortedTags} />}
          />

          {/* 4. 구글 표면 색상 푸터 */}
          <footer className="mt-auto w-full bg-[var(--google-surface-variant)] dark:bg-[#303134] text-[#5f6368] dark:text-[#9aa0a6] border-t border-[var(--google-border)]">
            <div className="mx-auto flex flex-col md:flex-row h-auto md:h-[70px] w-[92vw] xl:w-[85vw] max-w-7xl items-center justify-between px-2 sm:px-5 py-5 md:py-0 text-[11px] font-bold gap-3">
              <p className="copyright text-center md:text-left flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                © {new Date().getFullYear()} 의정부 건강·생활 정보 포털. All rights reserved.
              </p>
              <p className="iagree text-center md:text-right flex items-center justify-center flex-wrap gap-2">
                <Link href="/about" className="hover:text-[#0090D6] cursor-pointer transition-colors">플랫폼 소개</Link>
                <span className="w-1 h-1 rounded-full bg-[#dadce0] dark:bg-[#5f6368]"></span>
                본 포털은 의정부시의 주요 공공서비스 및 혜택 정보를 제공하는 비영리 안내 사이트입니다.
                <span className="w-1 h-1 rounded-full bg-[#dadce0] dark:bg-[#5f6368]"></span>
                <Link href="/admin" className="hover:text-[#0090D6] cursor-pointer transition-colors text-gray-300 dark:text-zinc-700" title="Admin">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </Link>
              </p>
            </div>
          </footer>

          {/* 5. 모바일 전용 하단 고정 탭바 (lg 미만에서 노출) */}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
