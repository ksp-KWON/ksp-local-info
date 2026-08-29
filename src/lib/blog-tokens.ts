export type BlogTone = 'purple' | 'blue' | 'green' | 'red' | 'yellow';

export interface ToneColorToken {
  name: BlogTone;
  label: string;
  hex: {
    border: string;
    borderAccent: string;
    headerBg: string;
    headerText: string;
    headerBorderBottom: string;
    bodyBg: string;
    bodyText: string;
    badgeBg: string;
    badgeText: string;
    highlightBg: string;
    highlightText: string;
  };
  tailwind: {
    border: string;
    hoverBorder: string;
    headerGradient: string;
    titleColor: string;
    highlightClass: string;
  };
}

export const BLOG_TONE_TOKENS: Record<BlogTone, ToneColorToken> = {
  purple: {
    name: 'purple',
    label: '행정 인사이트',
    hex: {
      border: '#e9d5ff',
      borderAccent: '#7e22ce',
      headerBg: '#faf5ff',
      headerText: '#6b21a8',
      headerBorderBottom: '#f3e8ff',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#7e22ce',
      badgeText: '#ffffff',
      highlightBg: '#f3e8ff',
      highlightText: '#581c87',
    },
    tailwind: {
      border: 'border border-purple-200/90 dark:border-purple-900/50',
      hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-[0_0_50px_rgba(126,34,206,0.32),0_0_20px_rgba(126,34,206,0.18)]',
      headerGradient: 'from-purple-50/90 via-purple-50/30 to-transparent dark:from-purple-950/40 dark:via-purple-950/10 dark:to-transparent border-b border-purple-100 dark:border-purple-900/40',
      titleColor: 'text-purple-900 dark:text-purple-200',
      highlightClass: 'text-purple-950 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/80 font-bold',
    },
  },
  green: {
    name: 'green',
    label: '지원금·혜택',
    hex: {
      border: '#a7f3d0',
      borderAccent: '#047857',
      headerBg: '#ecfdf5',
      headerText: '#065f46',
      headerBorderBottom: '#d1fae5',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#047857',
      badgeText: '#ffffff',
      highlightBg: '#d1fae5',
      highlightText: '#064e3b',
    },
    tailwind: {
      border: 'border border-emerald-200/90 dark:border-emerald-900/50',
      hoverBorder: 'hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-[0_0_50px_rgba(4,120,87,0.32),0_0_20px_rgba(4,120,87,0.18)]',
      headerGradient: 'from-emerald-50/90 via-emerald-50/30 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/10 dark:to-transparent border-b border-emerald-100 dark:border-emerald-900/40',
      titleColor: 'text-emerald-900 dark:text-emerald-200',
      highlightClass: 'text-emerald-950 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 font-bold',
    },
  },
  blue: {
    name: 'blue',
    label: '기본 가이드',
    hex: {
      border: '#bae6fd',
      borderAccent: '#0369a1',
      headerBg: '#f0f9ff',
      headerText: '#075985',
      headerBorderBottom: '#e0f2fe',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#0369a1',
      badgeText: '#ffffff',
      highlightBg: '#e0f2fe',
      highlightText: '#0c4a6e',
    },
    tailwind: {
      border: 'border border-sky-200/90 dark:border-sky-900/50',
      hoverBorder: 'hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-[0_0_50px_rgba(3,105,161,0.32),0_0_20px_rgba(3,105,161,0.18)]',
      headerGradient: 'from-sky-50/90 via-sky-50/30 to-transparent dark:from-sky-950/40 dark:via-sky-950/10 dark:to-transparent border-b border-sky-100 dark:border-sky-900/40',
      titleColor: 'text-sky-900 dark:text-sky-200',
      highlightClass: 'text-sky-950 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 font-bold',
    },
  },
  red: {
    name: 'red',
    label: '주의사항',
    hex: {
      border: '#fecdd3',
      borderAccent: '#be123c',
      headerBg: '#fff1f2',
      headerText: '#9f1239',
      headerBorderBottom: '#ffe4e6',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#be123c',
      badgeText: '#ffffff',
      highlightBg: '#ffe4e6',
      highlightText: '#881337',
    },
    tailwind: {
      border: 'border border-rose-200/90 dark:border-rose-900/50',
      hoverBorder: 'hover:border-rose-500 dark:hover:border-rose-500 hover:shadow-[0_0_50px_rgba(190,18,60,0.32),0_0_20px_rgba(190,18,60,0.18)]',
      headerGradient: 'from-rose-50/90 via-rose-50/30 to-transparent dark:from-rose-950/40 dark:via-rose-950/10 dark:to-transparent border-b border-rose-100 dark:border-rose-900/40',
      titleColor: 'text-rose-900 dark:text-rose-200',
      highlightClass: 'text-rose-950 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-800/80 font-bold',
    },
  },
  yellow: {
    name: 'yellow',
    label: '핵심 요약',
    hex: {
      border: '#fde68a',
      borderAccent: '#b45309',
      headerBg: '#fffbeb',
      headerText: '#92400e',
      headerBorderBottom: '#fef3c7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#b45309',
      badgeText: '#ffffff',
      highlightBg: '#fef3c7',
      highlightText: '#78350f',
    },
    tailwind: {
      border: 'border border-amber-200/90 dark:border-amber-900/50',
      hoverBorder: 'hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-[0_0_50px_rgba(180,83,9,0.32),0_0_20px_rgba(180,83,9,0.18)]',
      headerGradient: 'from-amber-50/90 via-amber-50/30 to-transparent dark:from-amber-950/40 dark:via-amber-950/10 dark:to-transparent border-b border-amber-100 dark:border-amber-900/40',
      titleColor: 'text-amber-900 dark:text-amber-200',
      highlightClass: 'text-amber-950 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 font-bold',
    },
  },
};

export function getToneColor(text: string): BlogTone {
  if (text.includes('주의') || text.includes('경고') || text.includes('불가') || text.includes('제외')) return 'red';
  if (text.includes('지원금') || text.includes('혜택') || text.includes('인정') || text.includes('지급')) return 'green';
  if (text.includes('인사이트') || text.includes('팁') || text.includes('노하우') || text.includes('꿀팁')) return 'purple';
  if (text.includes('요약') || text.includes('핵심') || text.includes('체크')) return 'yellow';
  return 'blue';
}

export function getKeywordTone(keyword: string): BlogTone {
  return getToneColor(keyword);
}
