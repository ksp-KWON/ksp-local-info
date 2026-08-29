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
      border: '#e4e4e7',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#e4e4e7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border border-gray-200/90 dark:border-zinc-800',
      hoverBorder: 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)]',
      headerGradient: 'from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 border-b border-gray-200/80 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold',
    },
  },
  green: {
    name: 'green',
    label: '지원금·혜택',
    hex: {
      border: '#e4e4e7',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#e4e4e7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border border-gray-200/90 dark:border-zinc-800',
      hoverBorder: 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)]',
      headerGradient: 'from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 border-b border-gray-200/80 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold',
    },
  },
  blue: {
    name: 'blue',
    label: '기본 가이드',
    hex: {
      border: '#e4e4e7',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#e4e4e7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border border-gray-200/90 dark:border-zinc-800',
      hoverBorder: 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)]',
      headerGradient: 'from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 border-b border-gray-200/80 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold',
    },
  },
  red: {
    name: 'red',
    label: '주의사항',
    hex: {
      border: '#e4e4e7',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#e4e4e7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border border-gray-200/90 dark:border-zinc-800',
      hoverBorder: 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)]',
      headerGradient: 'from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 border-b border-gray-200/80 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold',
    },
  },
  yellow: {
    name: 'yellow',
    label: '핵심 요약',
    hex: {
      border: '#e4e4e7',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#e4e4e7',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border border-gray-200/90 dark:border-zinc-800',
      hoverBorder: 'hover:border-zinc-800 dark:hover:border-zinc-300 hover:shadow-[0_14px_44px_rgba(24,24,27,0.12)]',
      headerGradient: 'from-zinc-100/90 via-zinc-50/40 to-transparent dark:from-zinc-800/40 border-b border-gray-200/80 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-bold',
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
