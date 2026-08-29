import GithubSlugger from 'github-slugger';

const KEY_POINT_PATTERNS = /^(?:#+\s*)?(?:[💡⭐📌\s]*)(?:시정\s*핵심\s*요약|핵심\s*요약|핵심\s*포인트|요약|3줄\s*요약|시정\s*브리핑|공연\s*핵심\s*요약|Key\s*Points)(?:[\s:]*)/i;
const CHECKLIST_PATTERNS = /^(?:#+\s*)?(?:[📋✅☑️\s]*)(?:신청\s*자격\s*1분\s*자가진단|1분\s*자가진단|자가진단|체크리스트|Checklist|필수\s*서류\s*체크|자격\s*체크|관람\s*1분\s*체크리스트|대처\s*1분\s*체크리스트|사용처\s*1분\s*체크리스트|신청\s*1분\s*체크리스트|검진\s*당일\s*1분\s*체크리스트|교육\s*신청\s*1분\s*자가진단|긴급복지지원\s*신청\s*자격\s*1분\s*자가진단|출산\s*지원금\s*신청\s*1분\s*자가진단|상병수당\s*신청\s*1분\s*자가진단|유아학비\s*신청\s*1분\s*자가진단|월세자금보증\s*1분\s*체크리스트|축제\s*관람\s*1분\s*체크리스트|버스킹\s*관람\s*1분\s*체크리스트)/i;
const INSIGHT_PATTERNS = /^(?:#+\s*)?(?:[🧭💡📌\s]*)(?:의정부\s*생활\s*꿀팁\s*&\s*시정\s*인사이트|의정부\s*생활\s*꿀팁|시정\s*인사이트|알짜\s*혜택\s*팁|생활\s*꿀팁)(?:[\s:]*)/i;
const FAQ_PATTERNS = /^(?:#+\s*)?(?:[❓💬💡\s]*)(?:시민\s*자주\s*묻는\s*질문|자주\s*묻는\s*질문|FAQ|Q&A|질의응답)(?:[\s:]*)/i;
const ACTION_PATTERNS = /^(?:#+\s*)?(?:[🏛️🔗📱💡\s]*)(?:공식\s*신청처\s*안내|온라인\s*신청\s*바로가기|관련\s*공공기관\s*안내|신청\s*안내)(?:[\s:]*)/i;

export interface ParsedBlogPost {
  opening: string;
  keyPoints: string[];
  keyPointsTitle?: string;
  checklistItems: string[];
  checklistTitle?: string;
  faqItems: { q: string; a: string }[];
  toc: { id: string; text: string }[];
  sections: string[];
}

export function cleanHeadingText(text: string, removePrefix = false): string {
  let cleaned = text.replace(/^#+\s*/, '').replace(/^[🛡️💡✅☑️⭐❓📋📌🧭🏛️]\s*/, '').trim();
  if (removePrefix) {
    cleaned = cleaned.replace(/^\d+[\.\)]\s*/, '').trim();
  }
  return cleaned;
}

export function parseBlogPost(markdown: string): ParsedBlogPost {
  const slugger = new GithubSlugger();
  const rawSections = markdown.split(/\n(?=##\s+)/);

  let opening = '';
  const keyPoints: string[] = [];
  let keyPointsTitle = '';
  const checklistItems: string[] = [];
  let checklistTitle = '';
  const faqItems: { q: string; a: string }[] = [];
  const toc: { id: string; text: string }[] = [];
  const sections: string[] = [];

  rawSections.forEach((section, index) => {
    const lines = section.trim().split('\n');
    const firstLine = lines[0] || '';

    // 1. 오프닝 및 핵심 요약 파싱
    if (index === 0) {
      if (KEY_POINT_PATTERNS.test(firstLine)) {
        keyPointsTitle = cleanHeadingText(firstLine);
        const bullets = lines.slice(1).filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'));
        bullets.forEach((b) => keyPoints.push(b.replace(/^[-*]\s*/, '').trim()));
      } else {
        opening = section.trim();
      }
      return;
    }

    // 2. 핵심 요약 (독립 섹션)
    if (KEY_POINT_PATTERNS.test(firstLine)) {
      keyPointsTitle = cleanHeadingText(firstLine);
      const bullets = lines.slice(1).filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'));
      bullets.forEach((b) => keyPoints.push(b.replace(/^[-*]\s*/, '').trim()));
      return;
    }

    // 3. 자가진단 체크리스트
    if (CHECKLIST_PATTERNS.test(firstLine)) {
      checklistTitle = cleanHeadingText(firstLine);
      const items = lines.slice(1).filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+\./.test(l.trim()));
      items.forEach((item) => checklistItems.push(item.replace(/^[-*]\s*|^\d+\.\s*/, '').trim()));
      return;
    }

    // 4. 자주 묻는 질문 (FAQ)
    if (FAQ_PATTERNS.test(firstLine)) {
      const contentWithoutHeader = lines.slice(1).join('\n');
      const qnaRegex = /(?:###\s*(?:[💡❓\s]*)?Q[.:]|\*\*Q[.:]\*\*|Q\s*[:：])\s*([\s\S]*?)\n+(?:A\s*[:：]|\*\*A[.:]\*\*|\s*[-*])\s*([\s\S]*?)(?=\n+(?:###\s*Q|Q\s*[:：]|\*\*Q)|$)/gi;
      let match;
      while ((match = qnaRegex.exec(contentWithoutHeader)) !== null) {
        faqItems.push({
          q: match[1].trim().replace(/\*\*/g, ''),
          a: match[2].trim().replace(/\*\*/g, ''),
        });
      }
      return;
    }

    // 5. 일반 H2/H3 섹션 및 TOC 생성
    if (firstLine.startsWith('## ')) {
      const title = cleanHeadingText(firstLine);
      const id = slugger.slug(title);
      toc.push({ id, text: title });
      sections.push(section);
    } else {
      sections.push(section);
    }
  });

  return {
    opening,
    keyPoints,
    keyPointsTitle,
    checklistItems,
    checklistTitle,
    faqItems,
    toc,
    sections,
  };
}
