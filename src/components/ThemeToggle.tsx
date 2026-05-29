"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[110px] h-[30px]"></div>; // 깜빡임 방지용 스켈레톤
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="text-[13px] bg-slate-100 dark:bg-[#333] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-[#555] rounded-md px-2 py-1 outline-none cursor-pointer"
    >
      <option value="light">☀️ 라이트</option>
      <option value="dark">🌙 다크</option>
      <option value="system">🖥️ 시스템</option>
    </select>
  );
}
