"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-none animate-pulse bg-gray-100 dark:bg-[#202124]" />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 sm:p-2.5 rounded-none border border-transparent hover:border-[#1a73e8]/30 dark:hover:border-[#8ab4f8]/30 text-[#3c4043] dark:text-[#e8eaed] hover:bg-gradient-to-br hover:from-red-50/50 hover:to-blue-50/50 dark:hover:from-red-900/20 dark:hover:to-blue-900/20 hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] hover:shadow-sm transition-all duration-200 flex items-center justify-center group cursor-pointer"
      title={`테마 변경 (현재: ${
        theme === "light" ? "라이트 모드" : theme === "dark" ? "다크 모드" : "시스템 기본값"
      })`}
      aria-label="Toggle theme"
    >
      {/* 라이트 모드 (해 아이콘) */}
      {theme === "light" && (
        <svg className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}

      {/* 다크 모드 (달 아이콘) */}
      {theme === "dark" && (
        <svg className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}

      {/* 시스템 기본값 (모니터 아이콘) */}
      {theme === "system" && (
        <div className="relative flex items-center justify-center">
          <svg className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </div>
      )}
    </button>
  );
}
