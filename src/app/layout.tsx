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
      <body className="min-h-full flex flex-col bg-[#f5f7fa] dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          
          {/* Header - 높이 60px, sticky, 글래스모피즘, text-slate-800 */}
          <header className="sticky top-0 z-50 w-full h-[60px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
            {/* 유동적 반응형 가로폭 적용 */}
            <div className="w-[92vw] xl:w-[85vw] max-w-7xl mx-auto h-full flex items-center justify-between">
              
              <div className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-xl">🏥</span>
                <Link href="/">의정부 건강·생활 정보 포털</Link>
              </div>
              
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex gap-6 items-center text-sm font-semibold">
                  <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">홈</Link>
                  <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">건강 정보 블로그</Link>
                  <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">소개</Link>
                  <Link href="/admin" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs">관리자</Link>
                </nav>

                <ThemeToggle />

                <div className="md:hidden text-slate-600 dark:text-slate-300 text-xl cursor-pointer">
                  <span className="sr-only">메뉴</span>
                  ☰
                </div>
              </div>

            </div>
          </header>

          {/* Main Container - 유동적 가로폭 및 300px 우측 사이드바 구조 */}
          <div className="flex-1 w-[92vw] xl:w-[85vw] max-w-7xl mx-auto mt-6 mb-10 flex flex-col md:flex-row gap-6">
            
            <main className="flex-1 min-w-0 bg-transparent flex flex-col">
              {children}
            </main>

            <aside className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-blue-600 dark:bg-blue-800 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
                  <span className="text-xs">📂</span> 주요 카테고리
                </div>
                <ul className="px-5 py-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li><Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between"><span>전체 글 보기</span><span className="text-xs text-slate-400 font-mono">ALL</span></Link></li>
                  <li className="pt-2 border-t border-slate-100 dark:border-slate-800"><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">우리동네 축제·행사</Link></li>
                  <li className="pt-2 border-t border-slate-100 dark:border-slate-800"><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">유용한 지원금·혜택</Link></li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-blue-600 dark:bg-blue-800 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
                  <span className="text-xs">🔥</span> 실시간 추천 정보
                </div>
                <ul className="px-5 py-4 space-y-3 text-[13px] text-slate-600 dark:text-slate-300">
                  <li className="line-clamp-1"><Link href="/blog/2026-05-29-EarlyChildhoodEducationSupport" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">2026 유아학비 누리과정 지원</Link></li>
                  <li className="line-clamp-1"><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">의정부 성모병원 응급의료 안내</Link></li>
                  <li className="line-clamp-1"><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">청년 자격증 응시료 지원 혜택</Link></li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-300">
                <div className="bg-slate-700 dark:bg-slate-800 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
                  <span className="text-xs">📊</span> 사이트 카운터
                </div>
                <div className="p-5 flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between items-center"><span>오늘 방문자</span><span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">148 명</span></div>
                  <div className="flex justify-between items-center"><span>어제 방문자</span><span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">412 명</span></div>
                  <div className="flex justify-between items-center"><span>전체 누적수</span><span className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-mono font-semibold">13,220 명</span></div>
                </div>
              </div>

            </aside>
          </div>

          {/* Footer - 묵직한 bg-slate-900, border-t border-slate-950 */}
          <footer className="w-full bg-slate-900 text-slate-400 py-10 border-t border-slate-950 text-center text-xs transition-colors duration-300">
            <div className="w-[92vw] xl:w-[85vw] max-w-7xl mx-auto">
              <p className="mb-2.5">Copyright &copy; <Link href="/" className="text-white hover:underline font-semibold">의정부 건강·생활 정보 포털</Link>. All Right Reserved.</p>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                본 포털은 경기도 의정부시의 주요 공공서비스, 행사, 그리고 혜택 및 의료(병원) 정보를 투명하고 정확하게 가공하여 주민 편의를 돕기 위해 제공하는 비영리 생활 정보 안내 사이트입니다.
              </p>
            </div>
          </footer>
        
        </ThemeProvider>
      </body>
    </html>
  );
}
