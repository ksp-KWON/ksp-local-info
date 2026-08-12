import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import { Hospital } from 'lucide-react';

import MobileBottomNav from "@/components/MobileBottomNav";
import { getSortedPostsData } from "@/lib/posts";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Image from "next/image";

export default function PublicLayout({
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

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ScrollProgressBar />
      
      {/* 1. 프리미엄 패밀리룩 App Bar (Neo-brutalism) */}
      <header className="sticky top-0 z-50 w-full h-[64px] bg-white dark:bg-[#121417] border-b-2 border-black dark:border-white transition-colors">
        <div className="mx-auto flex h-full w-[92vw] xl:w-[85vw] max-w-7xl items-center justify-between px-2 sm:px-5">

          {/* 로고/제목 영역 */}
          <div className="flex items-center min-w-0 flex-1 mr-1 sm:mr-2">
            <div className="font-sans font-black text-lg sm:text-xl min-w-0 tracking-tight">
              <Link href="/" className="group flex items-center gap-2 sm:gap-2.5 whitespace-nowrap overflow-hidden">
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-white border-2 border-black dark:border-white group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-all duration-200 z-10 overflow-hidden rounded-none">
                  <Image src="/images/uijeongbu-logo.png" alt="의정부 행복특별시 로고" fill className="object-contain p-1" sizes="44px" />
                </div>
                <span className="hidden sm:inline font-jua font-normal text-2xl text-black dark:text-white truncate tracking-tight">
                  의정부 건강·생활 정보 포털
                </span>
                <span className="sm:hidden font-jua font-normal text-xl text-black dark:text-white truncate tracking-tight">
                  의정부 생활정보
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 ml-1 bg-white dark:bg-[#121417] text-[9px] font-black text-black dark:text-white tracking-widest uppercase border-2 border-black dark:border-white">
                  Uijeongbu City
                </span>
              </Link>
            </div>
          </div>

          {/* 우측 메뉴 영역 */}
          <div className="flex items-center gap-2 shrink-0">
            <SearchBar />
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/" className="p-2 bg-white dark:bg-[#121417] border-2 border-black dark:border-white text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 flex items-center justify-center group" aria-label="홈" title="홈">
                <svg className="w-5 h-5 sm:w-[20px] sm:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </Link>
              <Link href="/blog" className="p-2 bg-white dark:bg-[#121417] border-2 border-black dark:border-white text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 flex items-center justify-center group" aria-label="소식 및 행사" title="소식 및 행사">
                <svg className="w-5 h-5 sm:w-[20px] sm:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M3 15h6"></path>
                  <path d="M3 19h6"></path>
                  <path d="M10 15h8"></path>
                  <path d="M10 19h8"></path>
                </svg>
              </Link>
            </nav>
            <div className="flex items-center gap-1 ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>



      {/* 3. 본문 단일 컨테이너 구조 (사이드바 제거) */}
      <main className="mx-auto w-full sm:w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-8 flex-1 flex flex-col min-h-[50vh]">
        {children}
      </main>

      {/* 4. 네오 브루탈리즘 푸터 */}
      <footer className="mt-auto w-full bg-white dark:bg-[#121417] text-black dark:text-white border-t-2 sm:border-t-4 border-black dark:border-white">
        <div className="mx-auto flex flex-col md:flex-row h-auto md:h-[70px] w-[92vw] xl:w-[85vw] max-w-7xl items-center justify-between px-2 sm:px-5 py-5 md:py-0 text-xs font-bold gap-3">
          <p className="copyright text-center md:text-left flex items-center gap-1.5">
            © {new Date().getFullYear()} 의정부 건강·생활 정보 포털. All rights reserved.
          </p>
          <p className="iagree text-center md:text-right flex items-center justify-center flex-wrap gap-3">
            <Link href="/about" className="hover:underline cursor-pointer transition-all">플랫폼 소개</Link>
            <span className="w-1.5 h-1.5 bg-black dark:bg-white"></span>
            <Link href="/terms" className="hover:underline cursor-pointer transition-all">이용약관</Link>
            <span className="w-1.5 h-1.5 bg-black dark:bg-white"></span>
            <Link href="/privacy" className="hover:underline cursor-pointer transition-all">개인정보처리방침</Link>
          </p>
        </div>
      </footer>
      <MobileBottomNav />
    </ThemeProvider>
  );
}
