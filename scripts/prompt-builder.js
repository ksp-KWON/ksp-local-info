'use strict';

/**
 * Step 1: JSON Schema for Planning (Frontmatter generation)
 */
const PLAN_SCHEMA = {
  type: 'OBJECT',
  properties: {
    thoughtProcess: { 
      type: 'STRING', 
      description: '사전 분석 및 목차 기획' 
    },
    frontmatter: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'SEO 최적화된 명확하고 전문적인 제목' },
        summary: { type: 'STRING', description: '구글 검색결과 스니펫에 노출될 150자 이내의 요약' },
        category: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: '다음 중 1~2개 선택: [복지·지원금, 문화·행사, 교육·육아, 건강·의료, 일자리·창업, 주거·부동산, 교통·환경, 생활·민원]'
        },
        tags: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: '관련 해시태그 3~4개'
        }
      },
      required: ['title', 'summary', 'category', 'tags']
    }
  },
  required: ['thoughtProcess', 'frontmatter']
};

/**
 * Step 1: Prompt for Planning
 */
function buildPlanPrompt(item) {
  const sourceLink = item.link && item.link !== '#' ? item.link : 'https://www.ui4u.go.kr';
  return `당신은 "의정부 건강·생활 정보 포털"의 수석 에디터입니다.
주어진 데이터를 바탕으로 구글 SEO 최적화된 블로그 포스트의 기획안(메타데이터)을 JSON 형식으로 작성하십시오.

[정보]
${JSON.stringify(item, null, 2)}
공식 출처: ${sourceLink}

[응답 규칙]
반드시 지정된 JSON 스키마를 따르는 순수 JSON 객체여야 합니다.
title 작성 시, 전국 공통 정책인 경우 '[의정부시]' 말머리를 제외하고 작성하세요. 특정 지역 전용 혜택에만 지역명을 포함하세요.`;
}

/**
 * Step 2: Prompt for Writing Content (No JSON, purely Markdown)
 */
function buildContentPrompt(item, plan) {
  const sourceLink = item.link && item.link !== '#' ? item.link : 'https://www.ui4u.go.kr';
  return `당신은 행정/의료 정책 분석가이자 전문 에디터입니다.
다음의 기획안과 원본 데이터를 바탕으로 1,500자 이상의 고밀도 전문 블로그 칼럼을 마크다운 형식으로 작성하십시오.

[원본 데이터]
${JSON.stringify(item, null, 2)}
공식 출처: ${sourceLink}

[기획안]
제목: ${plan.frontmatter.title}
요약: ${plan.frontmatter.summary}
분석: ${plan.thoughtProcess}

[작성 규칙]
1. H1('# 제목') 사용 금지. 대제목은 H2('##')로 작성하세요.
2. 이모지와 볼드(**) 남용을 피하고 객관적이고 논리정연한 전문가 톤을 유지하세요.
3. 도입부(현황 분석) -> 상세 해설 -> 실무 가이드(1. 2. 3.) -> 주의사항 순으로 전개하세요.
4. 본문 하단에 반드시 FAQ를 추가하세요 (Q는 H3(###) 사용).
5. "본 정보의 공식 출처는 [${sourceLink}](${sourceLink}) 입니다." 문구를 마지막에 자연스럽게 포함하세요.
6. 응답은 마크다운 본문 텍스트만 출력하십시오. (\`\`\`markdown 같은 감싸기나 다른 부연 설명 금지)`;
}

module.exports = {
  PLAN_SCHEMA,
  buildPlanPrompt,
  buildContentPrompt
};
