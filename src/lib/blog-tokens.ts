/**
 * blog-tokens.ts
 * 의정부 건강·생활 정보 포털 전용 모던 수묵(墨) & 굵은 라인 SVG 모노톤 디자인 토큰
 * - 알록달록한 원색을 배제하고 굵은 선(Bold Stroke)과 흑백 명도(Value/Shade)의 농담(濃淡)을 활용
 */

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
  // 1. 짙은 흑묵 (실무 인사이트 / 최고 권위)
  purple: {
    name: 'purple',
    label: '실무 인사이트',
    hex: {
      border: '#27272a',
      borderAccent: '#000000',
      headerBg: '#f4f4f5',
      headerText: '#000000',
      headerBorderBottom: '#27272a',
      bodyBg: '#ffffff',
      bodyText: '#18181b',
      badgeBg: '#18181b',
      badgeText: '#ffffff',
      highlightBg: '#e4e4e7',
      highlightText: '#000000',
    },
    tailwind: {
      border: 'border-2 border-black dark:border-white',
      hoverBorder: 'hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
      headerGradient: 'from-black/10 to-transparent dark:from-white/15 dark:to-transparent border-b-2 border-black dark:border-white',
      titleColor: 'text-black dark:text-white',
      highlightClass: 'text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 font-bold',
    },
  },
  // 2. 맑은 먹빛 (솔루션 / 해결 / 지원금)
  green: {
    name: 'green',
    label: '솔루션·해결',
    hex: {
      border: '#3f3f46',
      borderAccent: '#18181b',
      headerBg: '#f4f4f5',
      headerText: '#18181b',
      headerBorderBottom: '#3f3f46',
      bodyBg: '#ffffff',
      bodyText: '#27272a',
      badgeBg: '#27272a',
      badgeText: '#ffffff',
      highlightBg: '#e4e4e7',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border-2 border-zinc-800 dark:border-zinc-200',
      hoverBorder: 'hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
      headerGradient: 'from-zinc-900/8 to-transparent dark:from-zinc-100/10 dark:to-transparent border-b-2 border-zinc-800 dark:border-zinc-200',
      titleColor: 'text-zinc-900 dark:text-zinc-100',
      highlightClass: 'text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-800 font-bold',
    },
  },
  // 3. 중간 먹빛 (핵심 / 용어사전)
  yellow: {
    name: 'yellow',
    label: '핵심·용어사전',
    hex: {
      border: '#52525b',
      borderAccent: '#27272a',
      headerBg: '#fafafa',
      headerText: '#27272a',
      headerBorderBottom: '#52525b',
      bodyBg: '#ffffff',
      bodyText: '#3f3f46',
      badgeBg: '#3f3f46',
      badgeText: '#ffffff',
      highlightBg: '#f4f4f5',
      highlightText: '#27272a',
    },
    tailwind: {
      border: 'border-2 border-zinc-600 dark:border-zinc-400',
      hoverBorder: 'hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
      headerGradient: 'from-zinc-600/8 to-transparent dark:from-zinc-300/10 dark:to-transparent border-b-2 border-zinc-600 dark:border-zinc-400',
      titleColor: 'text-zinc-800 dark:text-zinc-200',
      highlightClass: 'text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-850 font-bold',
    },
  },
  // 4. 짙은 경계 먹빛 (주의 / 위험 / 면책)
  red: {
    name: 'red',
    label: '주의·면책위험',
    hex: {
      border: '#000000',
      borderAccent: '#000000',
      headerBg: '#f4f4f5',
      headerText: '#000000',
      headerBorderBottom: '#000000',
      bodyBg: '#ffffff',
      bodyText: '#000000',
      badgeBg: '#000000',
      badgeText: '#ffffff',
      highlightBg: '#e4e4e7',
      highlightText: '#000000',
    },
    tailwind: {
      border: 'border-2 border-black dark:border-white',
      hoverBorder: 'hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
      headerGradient: 'from-black/15 to-transparent dark:from-white/20 dark:to-transparent border-b-2 border-black dark:border-white',
      titleColor: 'text-black dark:text-white',
      highlightClass: 'text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 font-black',
    },
  },
  // 5. 은은한 수묵 안개 (기본 가이드)
  blue: {
    name: 'blue',
    label: '기본 가이드',
    hex: {
      border: '#d4d4d8',
      borderAccent: '#71717a',
      headerBg: '#fafafa',
      headerText: '#3f3f46',
      headerBorderBottom: '#d4d4d8',
      bodyBg: '#ffffff',
      bodyText: '#3f3f46',
      badgeBg: '#e4e4e7',
      badgeText: '#18181b',
      highlightBg: '#f4f4f5',
      highlightText: '#18181b',
    },
    tailwind: {
      border: 'border-2 border-zinc-300 dark:border-zinc-700',
      hoverBorder: 'hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]',
      headerGradient: 'from-zinc-200/40 to-transparent dark:from-zinc-800/30 dark:to-transparent border-b-2 border-zinc-300 dark:border-zinc-700',
      titleColor: 'text-zinc-800 dark:text-zinc-200',
      highlightClass: 'text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 font-medium',
    },
  },
};

/**
 * 텍스트 내용 기반 톤(Tone) 자동 판별기
 */
export function getToneColor(text: string): BlogTone {
  const clean = (text || '').trim();

  if (/보상스쿨|실무\s*인사이트|실무인사이트|피드백|인사이트/.test(clean)) {
    return 'purple';
  }
  if (/(핵심\s*요약|핵심요약|3줄\s*요약|주요\s*포인트)/.test(clean)) {
    return 'red';
  }
  if (/(?:^|\n)\s*(?:\*\*[^*]+\*\*|[^\n:]+)\s*[:：]/.test(clean) || /(?:용어\s*사전|단어\s*설명|용어\s*정의)/.test(clean)) {
    return 'yellow';
  }
  if (/(주의|경고|위험|금지|부지급|면책|거절|삭감|과실|위반|분쟁|소송|패소|실패)/.test(clean)) {
    return 'red';
  }
  if (/(해결|승소|지급|보상|합의|성공|전액|확보|부책|방어|수령|구제|유리)/.test(clean)) {
    return 'green';
  }
  if (/(핵심|팁|포인트|체크|요약|기준|원칙)/.test(clean)) {
    return 'yellow';
  }

  return 'blue';
}

/**
 * 키워드 강조(**텍스트**)의 의미 기반 톤 판별기
 */
export function getKeywordTone(text: string): BlogTone {
  const t = (text || '').trim();

  if (/(거절|면책|부지급|삭감|주의|경고|위험|금지|불리|과실|기왕증|불가|제한|악용|분쟁|소송|실패|거부|위반|처벌|구상|압박|피해)/.test(t)) {
    return 'red';
  }
  if (/(지급|보상|합의|성공|가능|해결|유리|승소|안전|권리|인정|전액|확보|부책|방어|수령|구제|무죄)/.test(t)) {
    return 'green';
  }
  if (/(핵심|중요|필수|확인|점검|기준|원칙|주의사항|팁|노하우|명심|포인트|체크|절차|방법|동선)/.test(t)) {
    return 'yellow';
  }
  if (/(전문가|손해사정사|손해사정|의학|법률|판례|자문|소견|감정|진단|포렌식|맥브라이드|자배법)/.test(t)) {
    return 'purple';
  }

  return 'blue';
}
