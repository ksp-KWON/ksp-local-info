/**
 * scripts/prompt-builder.js
 * 의정부 건강·생활 포털 마스터 헌법(.agents/AGENTS.md) 준수 AI 프롬프트 생성 엔진
 * - 원천 데이터 절대 준수 및 사실 기반 시정 안내
 * - 수묵화 5대 묵향 농담 명도 시스템 및 순수 텍스트 미니멀리즘 (No Emoji in Markdown)
 * - 번역투 제거 및 궁극의 전문가 휴머나이징(Humanizing) 표준
 */

'use strict';

const STRICT_RULES = `
## 1. 사전 분석 및 분량 계획 (Chain-of-Thought) - 필수 수행
- 본문 마크다운 작성을 시작하기 전에 반드시 JSON의 \`thoughtProcess\` 속성에 의정부 시민의 실생활 혜택 관점과 분석 내용을 먼저 서술하여 기획하십시오.
- 분석을 바탕으로 가장 알찬 고밀도의 공공 생활 정보 칼럼을 자율적으로 구성하십시오.

## 2. Heading 규칙 (H1 사용 금지, H2~H4 자율 계층화)
- **H1 사용 금지** : frontmatter 외부 본문에는 절대 H1('# 제목')을 작성하지 마세요.
- **자율적 계층 구조 구성** : 본문 각 섹션의 대제목은 H2('##')로 시작하되, 내용의 깊이와 논리적 전개에 따라 하위 소제목(H3 '###', H4 '####' 등)을 유기적으로 활용하여 방대한 정보를 입체적으로 구조화하십시오.
- **두괄식 즉답(Answer-First) 원칙** : 모든 H2('##') 및 H3('###') 소제목 바로 아래 첫 번째 문장은 상투적인 서론을 생략하고, 해당 섹션의 핵심 사실(신청 대상, 지원 금액, 접수 기간, 운영 장소 등)을 즉답하는 문장으로 시작하십시오.

## 3. 표준 마크다운 표 및 불릿 줄바꿈 엄수
- **표(Table) 작성 표준** : 비교 데이터는 반드시 순수 마크다운 표(\`| 구분 | 내용 |\`, \`|---|---|\`)로 작성하십시오. 표 구분선 뒤에 인용부호(\`>\`)나 백틱(\`\`\`)을 붙이지 마십시오. 표 앞뒤에는 반드시 빈 줄 1개(\`\\n\\n\`)를 두십시오.
- **핵심 요약 줄바꿈 필수** : \`## 행정 핵심 요약\`의 각 항목(\`> - **항목명** : 내용\`)은 반드시 줄바꿈(\`\\n\`)하여 개별 라인으로 작성하십시오.

## 4. 문체 및 문단 호흡 표준 (GFM Paragraph Breathing)
- **문체 표준** : 친절하고 명확한 존댓말(~합니다, ~안내해 드립니다, ~하시길 권장합니다)로 통일합니다.
- **콜론 앞뒤 공백** : 콜론 앞뒤는 반드시 한 칸 공백(\` : \`)을 둡니다. (예: \`신청 기간 : 2026년 9월 1일 ~ 9월 30일\`)
- **표준 문단 호흡** : 완결된 논리 단위는 하나의 문단으로 묶고, 문단 간 전환 시 표준 빈 줄 1개(\`\\n\\n\`)로 엄격히 구분합니다. 기본 2~4문장(150~250자 내외)의 호흡을 권장합니다.

## 4. 순수 텍스트 미니멀리즘 및 수묵화 5대 묵향 농담 명도 강조
- **이모지 전면 배제** : 구글 E-E-A-T 신뢰도를 위해 마크다운 원문 내 유니코드 이모지나 조잡한 특수문자 데코레이션을 전면 배제합니다. (시스템 렌더러가 2.5px 굵은 선의 W3C 단색 SVG 라인 심볼을 자동 결합합니다)
- **수묵 농담 강조** : 핵심 신청 자격 및 인사이트에 \`**강조**\`를 적용하되 문단당 1~2개로 절제합니다. HTML 태그(\`<div>\`, \`<span>\`, \`<red>\` 등)는 절대 사용하지 마십시오.

## 5. 원천 데이터 기반 본문 구성 규칙
제공된 [원본 공공 데이터]에 명시된 사실만 작성하십시오. 원천에 없는 내용은 일체 창작하거나 유추하지 마십시오:
- **[기둥 1] 시정 핵심 요약 (3줄 브리핑)** : 본문 오프닝 바로 다음 \`## 시정 핵심 요약\` (또는 \`## 행정 핵심 요약\`) 아래 대상·금액·기한 등을 3개의 불릿 포인트(\`> - \`)로 간결하게 요약.
- **[기둥 4] 상세 안내 (표)** : 원천에 포함된 일정, 장소, 대상, 프로그램 등 사실 데이터는 마크다운 표(\`|---|---|\`)로 정리하십시오.
- **섹션 생략 규칙** : 원천에 구체적 팁, 교통편, Q&A가 명시되어 있지 않은 경우, 꿀팁·교통안내·자주 묻는 질문 섹션을 작성하지 말고 완전히 생략하십시오.

## 6. 사족 배제 및 원천 팩트 절대 준수
- 상식적인 단어 풀이(억지 인라인 용어 사전)나 기계적 체크박스 채우기 등 독자의 흐름을 끊는 사족을 전면 금지합니다.
- **원천 외 정보 완전 금지** : 원천에 없는 일시, 장소 세부규격, 수용 인원, 버스 번호, 지하철 출구 번호, 이동 시간, 신청 절차, 구비 서류, FAQ 답변 등을 지어내지 마십시오. 소스에 문의 전화·담당 부서가 명시돼 있으면 본문에 포함하고, 명시돼 있지 않을 때만 하단 박스로 안내한다. 소스에 없는 대상 제한이나 포괄 표현('관내', '누구나', '시민' 한정, '모두')을 쓰지 않는다.
- **날짜 요일 표기 준수** : 공식 원문에 명시된 요일 외에는 괄호 요일을 추측해 덧붙이지 않는다.
- 본문에 공식 접수처·원천 링크의 URL이나 '공식 출처' 줄을 쓰지 마십시오. 공식 접수처 링크는 글 하단 박스가 대신합니다.

## 7. 궁극의 전문가 휴머나이징(Humanizing) 및 번역투 완전 제거
- **조사 남발 금지** : "~에 대해(서)", "~를 통해(서)", "~에 있어(서)" 등은 "~를", "~로", "~해서"로 직접 치환하십시오.
- **피동형/수동태 금지** : "~되어진다", "~지게 된다" 대신 능동태(~가 ~하다)를 사용하십시오.
- **기계적 맺음말 배제** : "결론적으로", "시사하는 바가 크다", "~에 대해 알아보았습니다" 등의 진부한 AI식 맺음말을 금지하고, 자연스럽게 종결하십시오.
- **AI 메모 및 부연 설명 금지** : 마크다운 본문 이외에 "알겠습니다", "글을 작성했습니다", \`[이미지 제안:...]\` 등의 메타 코멘트는 단 한 글자도 출력하지 마십시오.
`;

const ANGLES = [
  {
    id: 'CIVIC_PROCESS',
    name: '시민 실무 안내 가이드',
    instruction: '공공데이터 원천에 명시된 자격요건, 신청방법, 접수처를 정확하게 전달하십시오. 원천에 없는 서류나 동선 팁은 서술하지 마십시오.'
  },
  {
    id: 'BENEFIT_MAX',
    name: '혜택 및 대상자 안내',
    instruction: '공공데이터 원천에 명시된 지원 금액, 감면 기준, 지원 대상자 혜택을 명확히 전달하십시오. 원천에 없는 임의의 연계 혜택을 유추하지 마십시오.'
  },
  {
    id: 'LOCAL_LIFE',
    name: '시민 안내 관점',
    instruction: '원천 공공데이터에 기재된 일시, 장소, 대상, 신청 방법 등 시민 필수 정보를 정확하고 명확하게 전달하는 데 집중하십시오. 원천에 없는 교통 노선이나 임의의 인프라는 언급하지 마십시오.'
  }
];

// ── 카테고리 성격별 4대 맞춤형 에디토리얼 아키텍처 (획일적 템플릿 배제) ──────────────
const CATEGORY_EDITORIAL_GUIDES = {
  BENEFIT: {
    name: '혜택·지원금·일자리·융자 맞춤형 가이드',
    structure: [
      '1. 도입 및 시정 핵심 요약 (3줄 브리핑)',
      '2. 사업 추진 배경 및 지원 대상·자격 요건 상세 해설',
      '3. 세부 지원 내용·한도·조건 비교 마크다운 표',
      '4. 온·오프라인 신청 방법, 필수 구비 서류 및 담당 문의처 안내'
    ]
  },
  CULTURE: {
    name: '문화·공연·교육·체육·나들이 맞춤형 큐레이션',
    structure: [
      '1. 도입 및 행사·프로그램 핵심 요약 (3줄 브리핑)',
      '2. 프로그램·공연·강좌 기획 취지 및 주요 관람·참여 포인트',
      '3. 운영 일시·장소·대상·참가비(관람료) 상세 정리 마크다운 표',
      '4. 사전 예약·접수 절차 및 현장 참여 시 유의사항 안내'
    ]
  },
  INFRA: {
    name: '교통·주차·환경·주택·생활제도 맞춤형 안내',
    structure: [
      '1. 도입 및 제도·인프라 핵심 요약 (3줄 브리핑)',
      '2. 시행 배경 및 기존 대비 달라지는 핵심 사항 해설',
      '3. 세부 운영 기준·구역·일정·요금 정리 마크다운 표',
      '4. 시민 실생활 이용 요령, 준수 사항 및 관련 부서 안내'
    ]
  },
  SAFETY: {
    name: '의료·보건·재난안전·시설이용 맞춤형 가이드',
    structure: [
      '1. 도입 및 보건·안전 핵심 요약 (3줄 브리핑)',
      '2. 검진·진료·안전 대책의 취지 및 대상자 안내',
      '3. 운영 시간·장소·세부 검진/지원 항목 마크다운 표',
      '4. 방문 전 준비사항(신분증·사전예약 등) 및 담당 기관 문의처'
    ]
  }
};

function getEditorialGuideByCategory(category) {
  const cat = String(category || '');
  if (cat.includes('문화') || cat.includes('예술') || cat.includes('체육') || cat.includes('공원')) {
    return CATEGORY_EDITORIAL_GUIDES.CULTURE;
  }
  if (cat.includes('교통') || cat.includes('주차') || cat.includes('청소') || cat.includes('환경') || cat.includes('주택') || cat.includes('재개발')) {
    return CATEGORY_EDITORIAL_GUIDES.INFRA;
  }
  if (cat.includes('재난') || cat.includes('민방위')) {
    return CATEGORY_EDITORIAL_GUIDES.SAFETY;
  }
  return CATEGORY_EDITORIAL_GUIDES.BENEFIT;
}

// ── 의정부시 주요 공공기관·인프라 공식 검증 레퍼런스 DB (환각 없는 배경지식 보강) ──────────
const VERIFIED_LOCAL_CONTEXT_DB = [
  {
    keywords: ['예술의전당', '문화관광재단'],
    fact: '의정부예술의전당(의정부문화관광재단)은 의정부시 의정로 1에 위치한 복합문화예술 공간으로, 공식 누리집(uac.or.kr)을 통해 공연·전시 정보 확인 및 온라인 예매가 가능합니다.'
  },
  {
    keywords: ['문화역 이음', '문화역이음'],
    fact: '의정부문화역 이음은 신세계백화점 의정부점 건물(평화로 525) 내 위치한 도심형 문화예술 거점 공간으로, 전시·공연·문화 커뮤니티 프로그램을 운영합니다.'
  },
  {
    keywords: ['보건소', '동부보건과', '치매안심센터'],
    fact: '의정부시보건소(범골로 131)는 시민 건강증진, 예방접종, 국가건강검진 및 치매안심센터 사업을 수행하는 공공 보건의료 기관입니다.'
  },
  {
    keywords: ['정보도서관', '미술도서관', '음악도서관', '과학도서관', '가재울도서관'],
    fact: '의정부시 도서관(정보·미술·음악·과학·가재울도서관)의 독서·문화 프로그램은 의정부시도서관 공식 누리집(edu.uilib.go.kr) 책문화프로그램 메뉴에서 접수 및 확인이 진행됩니다.'
  },
  {
    keywords: ['평생학습원', '도시교육재단', '모두의 캠퍼스'],
    fact: '의정부도시교육재단 평생학습원 프로그램은 평생학습 통합플랫폼(sugang.ull.or.kr)을 통해 온라인 수강신청 및 강좌 일정 확인이 이루어집니다.'
  },
  {
    keywords: ['의정부사랑카드', '지역화폐'],
    fact: '의정부사랑카드는 경기지역화폐 모바일 앱을 통해 충전·발급 및 인센티브 혜택 확인이 가능한 의정부시 공식 충전식 선불카드형 지역화폐입니다.'
  }
];

function getVerifiedLocalContext(item) {
  const fullText = `${item?.title || ''} ${item?.description || ''} ${item?.sourceBody || ''}`;
  const matched = VERIFIED_LOCAL_CONTEXT_DB.filter(entry =>
    entry.keywords.some(kw => fullText.includes(kw))
  );
  if (matched.length === 0) return '';
  return matched.map(m => `- ${m.fact}`).join('\n');
}

function getRandomAngle() {
  const randomIndex = Math.floor(Math.random() * ANGLES.length);
  return ANGLES[randomIndex];
}

const PLAN_SCHEMA = {
  type: 'OBJECT',
  properties: {
    thoughtProcess: { 
      type: 'STRING', 
      description: '의정부 시민의 실생활 편의와 검색 니즈를 충족시키기 위해 어떤 관점에서 기획했는지 서술한 연쇄 사고 (Chain-of-Thought)' 
    },
    frontmatter: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'SEO 최적화된 명확하고 담백한 공공 안내 제목 (예: "2026 의정부시 청년 기본소득 신청 자격 및 지급 일정 안내" — 주의: 완벽 가이드, 총정리, 100% 같은 과장 어휘 및 느낌표 사용 금지)' },
        summary: { type: 'STRING', description: '구글 검색 스니펫에 노출될 150자 이내의 핵심 요약문' },
        category: { type: 'STRING', description: '일자리·생활|교통·주차|기업경제·농업|문화·예술|체육·공원|청소·환경|주택·재개발|재난·민방위|복지·돌봄 중 택 1' },
        tags: { type: 'ARRAY', items: { type: 'STRING' }, description: '관련 해시태그 3~5개' }
      },
      required: ['title', 'summary', 'category', 'tags']
    }
  },
  required: ['thoughtProcess', 'frontmatter']
};

const CONTENT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    thoughtProcess: {
      type: 'STRING',
      description: '원천 공공데이터의 팩트(일정, 장소, 대상, 지원 내용)를 독자에게 왜곡 없이 명확히 전달할 수 있도록 구성하는 연쇄 사고 (Chain-of-Thought)'
    },
    markdownContent: {
      type: 'STRING',
      description: '원천 팩트 준수 규칙을 100% 만족하는 마크다운 본문 (원천 외 가공 정보 완전 배제, 프론트매터 제외)'
    }
  },
  required: ['thoughtProcess', 'markdownContent']
};

function buildPlanPrompt(item) {
  const { link: _link, ...cleanItem } = item;
  return `당신은 "의정부 건강·생활 정보 포털"의 수석 에디터입니다.
주어진 공공 데이터를 바탕으로 구글 SEO 최적화된 블로그 포스트의 기획안(메타데이터)을 작성하십시오.

[공공 데이터 정보]
${JSON.stringify(cleanItem, null, 2)}

[기획 원칙]
단순히 정보를 나열하지 말고, 의정부 시민이 검색을 통해 이 글을 발견했을 때 "의정부 생활에 꼭 필요한 핵심 혜택"임을 즉시 알 수 있도록 명확하고 신뢰성 높은 제목과 요약을 기획하세요. 원천에 없는 가공의 사실이나 혜택을 유추하여 제목이나 요약에 포함하지 마십시오.

반드시 지정된 JSON 스키마를 따르는 순수 JSON 객체여야 합니다.`;
}

function buildContentPrompt(item, plan, angle) {
  const { link: _link, ...cleanItem } = item;
  const editorialGuide = getEditorialGuideByCategory(plan?.frontmatter?.category || item?.category);
  const localContext = getVerifiedLocalContext(item);
  const localContextBlock = localContext
    ? `\n[검증된 의정부 기관 공식 참고 배경지식]\n${localContext}\n`
    : '';

  return `# Role
당신은 의정부시의 시정 정책, 복지 지원금, 응급의료, 문화 행사를 사실에 입각하여 시민들에게 정확하게 전달하는 전문 공공 에디터입니다.

# Objective
제공된 공공 데이터와 기획안을 바탕으로, 아래의 의정부 포털 글쓰기 헌법 규칙을 완벽히 만족하는 칼럼을 마크다운 형식으로 작성하십시오.

## 작성 원칙
- **전문 에디터 톤**: 정중하고 신뢰할 수 있는 어조(~합니다, ~안내해 드립니다).
- **이모지 전면 배제**: 구글 E-E-A-T 신뢰도를 위해 본문에 유니코드 이모지/특수문자를 절대 사용하지 마세요. (시스템 렌더러가 SVG를 결합합니다)
- **카테고리 맞춤형 전개 (${editorialGuide.name})**: 획일적인 기계적 템플릿(억지 자가진단 체크리스트 등)을 지양하고, 본 주제의 성격에 맞춰 아래 흐름으로 자연스럽고 깊이 있게 서술하십시오:
  ${editorialGuide.structure.join('\n  ')}
- **원천 데이터 범위 내 심층 해설** : 분량을 억지로 늘리기 위해 가공의 사실을 지어내지 마되, 원천에 존재하는 팩트와 기관 공식 참고 배경지식을 바탕으로 시민이 궁금해하는 배경, 세부 요건, 신청·참여 절차를 친절하고 자세하게 풀어서 설명하십시오.
- **미포함 섹션 제외** : 원천에 근거가 없는 '생활 꿀팁', '대중교통 연계', '자주 묻는 질문(FAQ)' 섹션은 작성하지 마십시오.

아래 소스 본문에 명시된 사실만 사용합니다. 소스 본문에 명시된 신청자 실무 정보(문의 전화·담당 부서, 신청·접수 방법, 필수 동의서·보호자 동의, 안전·보험·면책 안내, 결제·환불, 주차, 중복 신청 제한)를 해당할 때 누락 없이 포함하되, 소스 문장을 그대로 복사하지 말고 구조화해 재구성하여 설명합니다. 소스에 없는 대상 제한이나 포괄 표현('관내', '누구나', '시민' 한정, '모두')을 쓰지 않고, 확인되지 않는 항목은 '자세한 내용은 공식 공고에서 확인하세요'로 안내합니다. 이미지에만 있을 수 있는 정보는 추측하지 않습니다.

# ⚖️ 의정부 포털 공통 글쓰기 헌법 규칙 (STRICT WRITING RULES)
${STRICT_RULES}

[원본 공공 데이터]
${JSON.stringify(cleanItem, null, 2)}
${localContextBlock}
[기획안]
* 제목 : ${plan.frontmatter.title}
* 카테고리 : ${plan.frontmatter.category}
* 요약 : ${plan.frontmatter.summary}
* 기획의도 : ${plan.thoughtProcess}

[오늘의 글쓰기 관점]
- 관점(Angle) : [${angle.name}] ${angle.instruction}

위 헌법 규칙을 엄격히 준수하여 반드시 지정된 JSON(CONTENT_SCHEMA) 형식으로 반환해 주세요.`;
}

module.exports = {
  STRICT_RULES,
  PLAN_SCHEMA,
  CONTENT_SCHEMA,
  getRandomAngle,
  getEditorialGuideByCategory,
  getVerifiedLocalContext,
  buildPlanPrompt,
  buildContentPrompt
};
