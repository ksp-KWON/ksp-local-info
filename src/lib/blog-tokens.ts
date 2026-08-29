/**
 * blog-tokens.ts
 * 의정부 건강·생활 정보 포털 전용 모던 수묵(墨) & 시민 맞춤형 7대 무기 디자인 토큰
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
  // 1. 짙은 흑묵 (의정부 시정 인사이트 / 핵심 주의사항)
  purple: {
    name: 'purple',
    label: '시정 인사이트',
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
  // 2. 맑은 먹빛 (지원금 선정 / 혜택 수령 / 자격 확인)
  green: {
    name: 'green',
    label: '지원금·혜택',
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
  // 3. 중간 먹빛 (신청 필수 기준 / 인라인 용어사전)
  yellow: {
    name: 'yellow',
    label: '신청기준·용어',
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
  // 4. 짙은 경계 먹빛 (신청 불가 / 마감 / 소득초과 / 주의)
  red: {
    name: 'red',
    label: '주의·신청불가',
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
  // 5. 은은한 수묵 안개 (기본 시정 가이드)
  blue: {
    name: 'blue',
    label: '시정 가이드',
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
 * 텍스트 내용 기반 시민 무기 톤(Tone) 자동 판별기
 */
export function getToneColor(text: string): BlogTone {
  const clean = (text || '').trim();

  // 1. [의정부 무기 3] 생활 꿀팁 & 시정 인사이트
  if (/의정부\s*생활\s*꿀팁|시정\s*인사이트|실무\s*인사이트|피드백|알짜\s*팁|생활\s*팁/.test(clean)) {
    return 'purple';
  }

  // 2. [의정부 무기 1] 시정 핵심 요약 (3줄 브리핑)
  if (/(시정\s*핵심\s*요약|핵심\s*요약|핵심요약|3줄\s*요약|주요\s*포인트|시정\s*브리핑)/.test(clean)) {
    return 'red';
  }

  // 3. 인라인 용어 사전 (> **용어명** : 설명)
  if (/(?:^|\n)\s*(?:\*\*[^*]+\*\*|[^\n:]+)\s*[:：]/.test(clean) || /(?:용어\s*사전|단어\s*설명|용어\s*정의)/.test(clean)) {
    return 'yellow';
  }

  // 4. 주의/마감/제외/소득초과 키워드
  if (/(주의|경고|위험|금지|불가|제외|탈락|마감|소득초과|중복불가|미지급)/.test(clean)) {
    return 'red';
  }

  // 5. 지원금/선정/수령/승인/환급 키워드
  if (/(선정|지급|지원금|혜택|수령|승인|환급|캐시백|할인|인센티브|합격)/.test(clean)) {
    return 'green';
  }

  // 6. 신청 자격/구비 서류/기준 키워드
  if (/(자격|기준|필수|서류|신청|방법|접수|동선|일정)/.test(clean)) {
    return 'yellow';
  }

  return 'blue';
}

/**
 * 키워드 강조(**텍스트**)의 시민 포털 의미 기반 톤 판별기
 */
export function getKeywordTone(text: string): BlogTone {
  const t = (text || '').trim();

  if (/(불가|제외|탈락|주의|경고|위험|금지|마감|초과|부적격|처벌|과태료|중복제한)/.test(t)) {
    return 'red';
  }
  if (/(지원금|혜택|선정|지급|환급|인센티브|할인|무료|지원|승인|수령|바우처|캐시백)/.test(t)) {
    return 'green';
  }
  if (/(신청|자격|기준|필수|서류|확인|점검|일정|기한|접수처|동주민센터|정부24)/.test(t)) {
    return 'yellow';
  }
  if (/(의정부시|시정|공고|조례|보건소|일자리센터|사랑카드|달빛병원|심야약국)/.test(t)) {
    return 'purple';
  }

  return 'blue';
}
