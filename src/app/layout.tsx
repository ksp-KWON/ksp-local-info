import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

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
    <html lang="ko" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
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
      {/* 반응형 유동적 폭 적용(기본은 max-w-7xl 등으로 제한하고 싶다면 아래 컨테이너에 적용) */}
      <body className="min-h-full flex flex-col bg-[#f5f6f7] dark:bg-[#1a1b1e] text-[#404040] dark:text-[#d1d5db] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          
          {/* Header */}
          <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#222] border-b-[3px] border-[#555] dark:border-[#444] md:rounded-b-none rounded-b-xl shadow-xs transition-colors duration-300">
            {/* 유동적 반응형 컨테이너: 최대 1200px (기존 1050px에서 더 넓게 확장) */}
            <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
              
              <div className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="text-2xl">📢</span>
                <Link href="/">의정부시 생활 정보통</Link>
              </div>
              
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
                  <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-[#ff5544] dark:hover:text-[#ff7766] transition-colors">홈</Link>
                  <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-[#ff5544] dark:hover:text-[#ff7766] transition-colors">전체글</Link>
                  <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-[#ff5544] dark:hover:text-[#ff7766] transition-colors">소개</Link>
                </nav>

                <ThemeToggle />

                <div className="md:hidden text-slate-600 dark:text-slate-300 text-xl cursor-pointer">
                  <span className="sr-only">메뉴</span>
                  ☰
                </div>
              </div>

            </div>
          </header>

          {/* Main Container - 유동적 폭 적용 */}
          <div className="flex-1 w-full max-w-[1200px] mx-auto mt-6 mb-10 px-4 lg:px-8 flex flex-col md:flex-row gap-8">
            
            <main className="flex-1 min-w-0 bg-transparent flex flex-col">
              {children}
            </main>

            <aside className="w-full md:w-[300px] lg:w-[320px] flex-shrink-0 flex flex-col gap-5">
              
              <div className="bg-white dark:bg-[#25262b] rounded-xl border border-slate-300 dark:border-[#444] overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-[#555] dark:bg-[#333] text-white px-4 py-2 font-bold text-[15px] flex items-center gap-2">
                  <span className="text-sm">🏷️</span> 카테고리
                </div>
                <ul className="px-4 py-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li><Link href="/blog" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">전체 목록 (14)</Link></li>
                  <li className="pl-3 border-t border-slate-100 dark:border-[#333] pt-2"><Link href="/" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">우리동네 축제·행사 (8)</Link></li>
                  <li className="pl-3 border-t border-slate-100 dark:border-[#333] pt-2"><Link href="/" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">유용한 지원금·혜택 (6)</Link></li>
                </ul>
              </div>

              <div className="bg-white dark:bg-[#25262b] rounded-xl border border-slate-300 dark:border-[#444] overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-[#555] dark:bg-[#333] text-white px-4 py-2 font-bold text-[15px] flex items-center gap-2">
                  <span className="text-sm">🔥</span> 인기글
                </div>
                <ul className="px-4 py-3 space-y-3 text-[14px] text-slate-600 dark:text-slate-300">
                  <li className="line-clamp-1"><Link href="/blog/2026-05-29-EarlyChildhoodEducationSupport" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">2026 유아학비 누리과정 지원</Link></li>
                  <li className="line-clamp-1"><Link href="/" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">의정부 사랑제일 걷기대회 안내</Link></li>
                  <li className="line-clamp-1"><Link href="/" className="hover:text-[#ff5544] dark:hover:text-[#ff7766]">청년 월세 지원금 신청 방법</Link></li>
                </ul>
              </div>

              <div className="bg-white dark:bg-[#25262b] rounded-xl border border-slate-300 dark:border-[#444] overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-[#555] dark:bg-[#333] text-white px-4 py-2 font-bold text-[15px] flex items-center gap-2">
                  <span className="text-sm">📊</span> 방문자 카운터
                </div>
                <div className="p-4 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between items-center"><span>오늘</span><span className="bg-[#555] dark:bg-[#444] text-white px-2 py-[2px] rounded text-xs">128</span></div>
                  <div className="flex justify-between items-center"><span>어제</span><span className="bg-[#555] dark:bg-[#444] text-white px-2 py-[2px] rounded text-xs">342</span></div>
                  <div className="flex justify-between items-center"><span>누적</span><span className="bg-[#555] dark:bg-[#444] text-white px-2 py-[2px] rounded text-xs">12,450</span></div>
                </div>
              </div>

            </aside>
          </div>

          <footer className="w-full bg-[#555] dark:bg-[#111] text-slate-300 py-8 md:rounded-t-xl max-w-[1200px] mx-auto text-center text-[13px] mt-auto transition-colors duration-300">
            <p className="mb-2">Copyright &copy; <Link href="/" className="text-white hover:underline">의정부시 생활 정보통</Link>. All Right Reserved.</p>
            <p className="text-[#bbb] dark:text-[#888]">이 웹사이트는 공공데이터를 기반으로 주민 편의를 위해 가공/제공됩니다.</p>
          </footer>
        
        </ThemeProvider>
      </body>
    </html>
  );
}
