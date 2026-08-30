'use client';

import React, { ReactNode } from 'react';

interface Props {
  mainContent: ReactNode;
  sidebarContent?: ReactNode | null;
}

export default function SmartStickyLayout({ mainContent, sidebarContent }: Props) {
  return (
    <div className="mx-auto w-full sm:w-[92vw] xl:w-[85vw] max-w-7xl px-2 sm:px-5 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* 본문 영역 (72% 비율) */}
      <main className="w-full lg:w-[72%] flex-1 min-w-0 transition-all duration-300">
        {mainContent}
      </main>

      {/* 사이드바 영역 (28% 비율, self-start 기반 정밀 스마트 스티키) */}
      {sidebarContent && (
        <aside className="hidden lg:block w-full lg:w-[28%] sticky top-[80px] self-start transition-all duration-300 lg:px-0">
          <div className="w-full">
            {sidebarContent}
          </div>
        </aside>
      )}
    </div>
  );
}
