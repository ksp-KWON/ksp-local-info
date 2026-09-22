/**
 * src/lib/markdown-standard.ts
 * 의정부 건강·생활 정보 포털 전사 단일 표준 마크다운 정규화 엔진 (Single Source of Truth)
 * 
 * [헌법 원칙 준수]
 * - 표준 · 범용 · 콤팩트 · 통합 · 공유 · 공통
 * - 사후 땜질이 아닌 저장 직전(Pre-save) 원천 차단 및 사전 예방
 * - W3C 시맨틱 체계, GFM 순수 텍스트 미니멀리즘 준수
 */

import matter from 'gray-matter';

export interface FrontmatterData {
  title?: string;
  date?: string;
  category?: string | string[];
  tags?: string[];
  summary?: string;
  sourceId?: string;
  sourceLink?: string;
  [key: string]: any;
}

export interface NormalizedPostResult {
  data: FrontmatterData;
  content: string;
  fullContent: string;
  isChanged: boolean;
}

/**
 * 1. 프론트매터 메타데이터 단일 표준 정규화
 */
export function normalizeFrontmatter(data: FrontmatterData = {}): FrontmatterData {
  const cleanData: FrontmatterData = { ...data };

  // 1-1. summary 정규화 (단일 문자열, 줄바꿈 제거, 따옴표 정리)
  if (cleanData.summary) {
    cleanData.summary = String(cleanData.summary)
      .replace(/[\r\n]+/g, ' ')
      .replace(/"/g, "'")
      .replace(/^'+|'+$/g, '')
      .trim();
  }

  // 1-2. 5대 직관형 공식 카테고리 정규화
  if (cleanData.category) {
    const cats = Array.isArray(cleanData.category) ? cleanData.category : [cleanData.category];
    const catStr = cats.join(' ');
    if (catStr.includes('병원') || catStr.includes('건강') || catStr.includes('의료') || catStr.includes('약국')) {
      cleanData.category = ['병원·약국'];
    } else if (catStr.includes('축제') || catStr.includes('나들이') || catStr.includes('문화') || catStr.includes('행사') || catStr.includes('공연')) {
      cleanData.category = ['축제·나들이'];
    } else if (catStr.includes('일자리') || catStr.includes('소상공인') || catStr.includes('기업') || catStr.includes('입찰') || catStr.includes('채용')) {
      cleanData.category = ['일자리·소상공인'];
    } else if (catStr.includes('민원') || catStr.includes('생활') || catStr.includes('교통') || catStr.includes('주차') || catStr.includes('폐기물')) {
      cleanData.category = ['생활·민원'];
    } else {
      cleanData.category = ['복지·지원금'];
    }
  } else {
    cleanData.category = ['복지·지원금'];
  }

  // 1-3. tags 정규화 (string[] 표준)
  if (typeof cleanData.tags === 'string') {
    cleanData.tags = (cleanData.tags as string).split(',').map((t) => t.trim()).filter(Boolean);
  } else if (!Array.isArray(cleanData.tags)) {
    cleanData.tags = [];
  }

  return cleanData;
}

/**
 * 2. 라인 단위 마크다운 볼드(**) 및 리스트 유착 정밀 복원 엔진
 * (개행을 절대 넘지 않고 1개 라인 내에서만 100% 안전하게 격리 처리)
 */
export function repairLineBold(line: string): string {
  if (line.startsWith('```') || line.startsWith('---')) return line;

  let text = line;

  // 2-1. 불릿 뒤 볼드 유착 분리 (핵심 근본 원인 사전 차단: -**단어 -> - **단어)
  text = text.replace(/^(\s*[-*+])\*\*/, '$1 **');
  text = text.replace(/^(\s*[-*+])([^\s*]+)/, '$1 $2');
  text = text.replace(/^>\s*-\s*\*\*/, '> - **');

  // 2-2. 콜론 앞뒤 공백 및 볼드 분리
  text = text.replace(/\*\*\s*:\s*\*\*/g, '**: **');
  text = text.replace(/([가-힣0-9a-zA-Z])\*\*:\s*\*\*/g, '$1**: **');

  // 2-3. 따옴표 내부 볼드 정상화 ('**단어'** -> '**단어**')
  text = text.replace(/(?<=\s|^)\*\*'([^'\n*.]{1,50})'\*\*(?=\s|[.,?!:]|[가-힣]|$)/g, (_m, p1) => `'**${p1.trim()}**'`);
  text = text.replace(/'\*\*([^'\n*.]{1,50})'\*\*(?=\s|[.,?!:]|[가-힣]|$)/g, (_m, p1) => `'**${p1.trim()}**'`);
  text = text.replace(/(?<=\s|^)\*\*"([^"\n*.]{1,50})"\*\*(?=\s|[.,?!:]|[가-힣]|$)/g, (_m, p1) => `"**${p1.trim()}**"`);
  text = text.replace(/"\*\*([^"\n*.]{1,50})"\*\*(?=\s|[.,?!:]|[가-힣]|$)/g, (_m, p1) => `"**${p1.trim()}**"`);

  // 2-4. 3개 이상 과도한 별표 불일치 교정 (한 줄 내 격리)
  text = text.replace(/\*{3,}([^\r\n*]+?)\*{2,}/g, '**$1**');
  text = text.replace(/\*{2,}([^\r\n*]+?)\*{3,}/g, '**$1**');

  // 2-5. 괄호 뒤 조사 유착 교정
  text = text.replace(/\*\*([^*\r\n()]+)\(([^)\r\n]+)\)\*\*([가-힣])/g, '**$1**($2)$3');

  // 2-6. 구두점 뒤 볼드 유착 분리
  text = text.replace(/([.%?!:,;\)\]])\*\*([가-힣0-9a-zA-Z])/g, '$1** $2');

  // 2-7. 범위 물결표 취소선 방지 (20~30 -> 20 ~ 30)
  text = text.replace(/([0-9가-힣])~([0-9가-힣])/g, '$1 ~ $2');

  // 2-8. 볼드 내부/외부 불필요한 공백 정밀 정돈 (토큰 단위)
  const parts = text.split('**');
  if (parts.length > 2 && parts.length % 2 === 1) {
    for (let i = 1; i < parts.length; i += 2) {
      parts[i] = parts[i].trim();
    }
    for (let i = 0; i < parts.length; i += 2) {
      if (i + 1 < parts.length) {
        if (parts[i].length > 0 && /[가-힣0-9a-zA-Z\),]$/.test(parts[i])) {
          parts[i] += ' ';
        }
      }
    }
    text = parts.join('**');
  }

  // 2-9. 홀수 개수의 짝 없는 별표 제거
  const bMatches = text.match(/\*\*/g);
  if (bMatches && bMatches.length % 2 !== 0) {
    const lastIdx = text.lastIndexOf('**');
    if (lastIdx !== -1) {
      text = text.slice(0, lastIdx) + text.slice(lastIdx + 2);
    }
  }

  return text;
}

/**
 * 3. 마크다운 본문 전사 단일 표준 정규화 엔진
 */
export function normalizeMarkdownBody(rawBody: string): string {
  if (!rawBody) return '';
  let body = String(rawBody);

  // 3-1. 핵심 요약 헤더 및 불릿 3줄 완전 표준화
  body = body.replace(/##\s*(?:\[[^\]]+\]\s*)?(?:핵심\s*요약|행정\s*핵심\s*요약|시정\s*핵심\s*요약|3줄\s*요약|요약)[^\n]*/gi, '## 시정 핵심 요약');

  body = body.replace(
    /(##\s*시정\s*핵심\s*요약\s*\r?\n+)((?:[ \t]*(?:>|[-*+]).*(?:\r?\n|$)|[ \t]*\r?\n(?=[ \t]*(?:>|[-*+])))*)/gi,
    (_m, head, bulletsBlock) => {
      const lines = bulletsBlock.split(/\r?\n/);
      const cleanBullets = lines
        .map((l: string) => l.trim())
        .filter((l: string) => /^>|[-*+]/.test(l))
        .map((l: string) => {
          let text = l.replace(/^(?:>\s*)?[-*+]\s*/, '').replace(/^>\s*/, '').trim();
          if (!text) return '';
          text = text.replace(/^[💡🎯📌⭐🛡️✅☑️✔]+\s*/, '');
          text = text.replace(/^\*\*\[\s*([^\]]+?)\s*\]\*\*/, '**$1**');
          text = text.replace(/^\[\s*([^\]]+?)\s*\]\s*:\s*/, '**$1** : ');
          return `- ${text.trim()}`;
        })
        .filter(Boolean)
        .slice(0, 3)
        .join('\n');
      return `${head.trim()}\n\n${cleanBullets}\n\n`;
    }
  );

  // 3-2. 자주 묻는 질문 표준화
  body = body.replace(/##\s*(?:[1-9]\.\s*)?(?:자주\s*묻는\s*질문|FAQ|시민\s*FAQ)[^\n]*/gi, '## 자주 묻는 질문');

  // 3-3. 자가진단 체크리스트 표준화
  body = body.replace(/##\s*(?:\[[^\]]+\]\s*)?(?:신청\s*자격\s*1분\s*자가진단|1분\s*자가진단|자가진단\s*체크리스트|1분\s*체크리스트|신청\s*자격\s*체크리스트)[^\n]*/gi, '## 신청 자격 1분 자가진단');

  // 3-4. 수묵화 시그니처 박스 표준화
  body = body.replace(
    />\s*###\s*(?:의정부\s*생활\s*꿀팁|의정부\s*생활포털|행정\s*인사이트|실무\s*팁|실무TIP)[^\n]*/gi,
    '> ### 의정부 생활 꿀팁 & 행정 인사이트'
  );

  // 3-5. 이모지 제거 (헤딩)
  body = body.replace(/##\s*[💡📋🏆🛡️⭐💎🎯📌🧑‍⚖️⚖️]+\s*/g, '## ');
  body = body.replace(/###\s*[💡📋🏆🛡️⭐💎🎯📌🧑‍⚖️⚖️]+\s*/g, '### ');

  // 3-6. 마크다운 표(Table) 문법 정밀 표준화 및 오염 완벽 교정
  body = body.replace(/(\|[-: ]+)\|>\s*$/gm, '$1|');
  body = body.replace(/(\|[-: ]+)>\s*$/gm, '$1|');
  body = body.replace(/\|\s*\n\s*\|/g, '|\n|');

  // 3-7. 헤딩 뒤 본문 유착 방지
  body = body.replace(/^(##+[^\n\r*]+)(\*\*[^*]+\*\*)/gm, '$1\n\n$2');

  // 3-8. 라인 단위 정밀 복원 엔진 가동 (불릿 유착 및 볼드 정규화 100% 보장)
  body = body
    .split(/\r?\n/)
    .map((line) => repairLineBold(line))
    .join('\n');

  // 3-9. 인용구 내부 볼드 콜론 간격 표준화
  body = body.replace(/^>\s*\*\*([^*:\n]+)\*\s*:/gm, '> **$1** :');

  // 3-10. 다중 빈 줄 정리
  body = body.replace(/(?:\r?\n){3,}/g, '\n\n').trim();

  return body;
}

/**
 * 4. 포스트 전체(Frontmatter + Body) 통합 표준 정규화 (SSOT 진입점)
 */
export function normalizePost(rawFileContent: string): NormalizedPostResult {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(rawFileContent);
  } catch (_e) {
    const rawFixed = rawFileContent.replace(/summary:\s*([\s\S]*?)(?=\r?\n[a-zA-Z0-9_-]+:|$)/m, (_m, val) => {
      const clean = val.replace(/[\r\n]+/g, ' ').replace(/"/g, "'").replace(/^'+|'+$/g, '').trim();
      return `summary: "${clean}"`;
    });
    parsed = matter(rawFixed);
  }

  const cleanData = normalizeFrontmatter(parsed.data as FrontmatterData);
  const cleanBody = normalizeMarkdownBody(parsed.content);

  const cleanContent = matter.stringify(cleanBody, cleanData);
  return {
    data: cleanData,
    content: cleanBody,
    fullContent: cleanContent,
    isChanged: cleanContent !== rawFileContent,
  };
}

// CommonJS 호환 레이어 (Node CLI 스크립트 require 호환)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    normalizeFrontmatter,
    repairLineBold,
    normalizeMarkdownBody,
    normalizePost,
  };
}
