import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

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
    <html lang="ko" className="h-full antialiased scroll-smooth">
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
      {/* 티스토리 스타일 기본 배경 (연한 회색 바탕) */}
      <body className="min-h-full flex flex-col bg-[#f5f6f7] text-[#404040]">
        
        {/* Header - 친효스킨 스타일 */}
        <header className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-[#555] md:rounded-b-none rounded-b-xl shadow-xs">
          <div className="max-w-[1050px] mx-auto px-4 h-16 flex items-center justify-between">
            {/* Title */}
            <div className="font-bold text-xl text-slate-800">
              <Link href="/">의정부시 생활 정보통</Link>
            </div>
            
            {/* Nav Menu (PC) */}
            <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-[#ff5544] transition-colors">홈</Link>
              <Link href="/blog" className="text-slate-600 hover:text-[#ff5544] transition-colors">전체글</Link>
              <Link href="/about" className="text-slate-600 hover:text-[#ff5544] transition-colors">소개</Link>
            </nav>

            {/* Nav Menu (Mobile) */}
            <div className="md:hidden text-slate-600 text-xl cursor-pointer">
              <span className="sr-only">메뉴</span>
              ☰
            </div>
          </div>
        </header>

        {/* Main Container - 콘텐츠 + 사이드바 */}
        <div className="flex-1 w-full max-w-[1050px] mx-auto mt-6 mb-10 px-4 md:px-2 flex flex-col md:flex-row gap-6">
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 bg-transparent flex flex-col">
            {children}
          </main>

          {/* Sidebar Area */}
          <aside className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-5">
            
            {/* 위젯: 카테고리 */}
            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-xs">
              <div className="bg-[#555] text-white px-4 py-2 font-bold text-[15px]">
                카테고리
              </div>
              <ul className="px-4 py-3 space-y-2 text-sm text-slate-600">
                <li><Link href="/blog" className="hover:text-[#ff5544]">전체 목록 (14)</Link></li>
                <li className="pl-3 border-t border-slate-100 pt-2"><Link href="/" className="hover:text-[#ff5544]">우리동네 축제·행사 (8)</Link></li>
                <li className="pl-3 border-t border-slate-100 pt-2"><Link href="/" className="hover:text-[#ff5544]">유용한 지원금·혜택 (6)</Link></li>
              </ul>
            </div>

            {/* 위젯: 인기글 */}
            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-xs">
              <div className="bg-[#555] text-white px-4 py-2 font-bold text-[15px]">
                인기글
              </div>
              <ul className="px-4 py-3 space-y-3 text-[14px] text-slate-600">
                <li className="line-clamp-1"><Link href="/blog/2026-05-29-EarlyChildhoodEducationSupport" className="hover:text-[#ff5544]">2026 유아학비 누리과정 지원</Link></li>
                <li className="line-clamp-1"><Link href="/" className="hover:text-[#ff5544]">의정부 사랑제일 걷기대회 안내</Link></li>
                <li className="line-clamp-1"><Link href="/" className="hover:text-[#ff5544]">청년 월세 지원금 신청 방법</Link></li>
              </ul>
            </div>

            {/* 위젯: 방문자 카운터 */}
            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-xs">
              <div className="bg-[#555] text-white px-4 py-2 font-bold text-[15px]">
                방문자 카운터
              </div>
              <div className="p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center"><span className="text-slate-500">오늘</span><span className="bg-[#555] text-white px-2 py-[2px] rounded text-xs">128</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">어제</span><span className="bg-[#555] text-white px-2 py-[2px] rounded text-xs">342</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">누적</span><span className="bg-[#555] text-white px-2 py-[2px] rounded text-xs">12,450</span></div>
              </div>
            </div>

          </aside>
        </div>

        {/* Footer */}
        <footer className="w-full bg-[#555] text-slate-300 py-8 md:rounded-t-xl max-w-[1050px] mx-auto text-center text-[13px] mt-auto">
          <p className="mb-2">Copyright &copy; <Link href="/" className="text-white hover:underline">의정부시 생활 정보통</Link>. All Right Reserved.</p>
          <p className="text-[#bbb]">이 웹사이트는 공공데이터를 기반으로 주민 편의를 위해 가공/제공됩니다.</p>
        </footer>
        
      </body>
    </html>
  );
}
