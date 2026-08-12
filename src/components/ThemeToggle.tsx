"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

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
      className="p-2 sm:p-2 text-black dark:text-white hover:-translate-y-0.5 transition-transform duration-200 flex items-center justify-center group cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      title={`테마 변경 (현재: ${
        theme === "light" ? "라이트 모드" : theme === "dark" ? "다크 모드" : "시스템 기본값"
      })`}
      aria-label="Toggle theme"
    >
      {/* 라이트 모드 (해 아이콘) */}
      {theme === "light" && (
        <Sun className="w-5 h-5 sm:w-[20px] sm:h-[20px] text-amber-500 dark:text-amber-400" strokeWidth={3} />
      )}

      {/* 다크 모드 (달 아이콘) */}
      {theme === "dark" && (
        <Moon className="w-5 h-5 sm:w-[20px] sm:h-[20px] text-indigo-500 dark:text-indigo-400" strokeWidth={3} />
      )}

      {/* 시스템 기본값 (모니터 아이콘) */}
      {theme === "system" && (
        <div className="relative flex items-center justify-center">
          <Monitor className="w-5 h-5 sm:w-[20px] sm:h-[20px] text-gray-500 dark:text-gray-400" strokeWidth={3} />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
          </span>
        </div>
      )}
    </button>
  );
}
