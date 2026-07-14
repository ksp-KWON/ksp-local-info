"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Props {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

export default function SmartStickyLayout({ mainContent, sidebarContent }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지 진입 시 body에 hide-footer 클래스 추가
    if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
      document.body.classList.add('hide-footer');
    } else {
      document.body.classList.remove('hide-footer');
    }

    return () => {
      document.body.classList.remove('hide-footer');
    };
  }, [pathname]);

  // 관리자 페이지(/admin)일 경우, 사이드바 레이아웃을 씌우지 않고 본문만 전체 너비로 렌더링합니다.
  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return <>{mainContent}</>;
  }

  // 의정부 사이트는 블로그 중심이 아니라 포털 중심입니다.
  // 따라서 홈 화면(/)과 서비스 화면(/services/*)은 사이드바 없이 전체 화면(100%)을 사용하도록 변경합니다.
  const isBlogRoute = pathname === '/blog' || pathname?.startsWith('/blog/');

  if (!isBlogRoute) {
    return (
      <div className="mx-auto w-full sm:w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-8 flex flex-col items-stretch">
        <main className="w-full flex-1 min-w-0 transition-all duration-300">
          {mainContent}
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full sm:w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
      
      {/* 본문 영역 */}
      <main className="w-full lg:w-[73%] flex-1 min-w-0 transition-all duration-300">
        {mainContent}
      </main>

      {/* 사이드바 영역 (모바일에서는 서랍으로 대체되므로 숨김) */}
      <aside className="hidden lg:block w-full lg:w-[27%] relative transition-all duration-300 lg:px-0">
        <div className="lg:sticky lg:top-[80px] w-full">
          {sidebarContent}
        </div>
      </aside>

    </div>
  );
}
