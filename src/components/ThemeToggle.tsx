"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

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
      <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] bg-white dark:bg-[#121417] border-2 border-black dark:border-white animate-pulse" />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 sm:p-2 text-black dark:text-white transition-colors duration-200 flex items-center justify-center group cursor-pointer border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-none"
      title={`테마 변경 (현재: ${
        theme === "light" ? "라이트 모드" : theme === "dark" ? "다크 모드" : "시스템 기본값"
      })`}
      aria-label="Toggle theme"
    >
      {/* 라이트 모드 (해 아이콘) */}
      {theme === "light" && (
        <AppIcon name="sun" size={18} strokeWidth={2.5} className="text-black dark:text-white" />
      )}

      {/* 다크 모드 (달 아이콘) */}
      {theme === "dark" && (
        <AppIcon name="moon" size={18} strokeWidth={2.5} className="text-black dark:text-white" />
      )}

      {/* 시스템 기본값 (모니터 아이콘) */}
      {theme === "system" && (
        <div className="relative flex items-center justify-center">
          <AppIcon name="monitor" size={18} strokeWidth={2.5} className="text-black dark:text-white" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
          </span>
        </div>
      )}
    </button>
  );
}
