/**
 * generate-local-news.js
 * 의정부 지역 뉴스 기반 다이내믹 AI 자동글쓰기 엔진
 * 보상스쿨의 select-daily-topic.js 아키텍처 완벽 이식판
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const { callGemini } = require('./gemini-helper');
const { POSTS_DIR, sleep, safeFetch } = require('./pipeline-utils');
const matter = require('gray-matter');

const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });

async function getExistingTitles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).slice(-50);
  return files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      return matter(content).data.title;
    } catch { return ''; }
  }).filter(Boolean);
}

// ── [1단계] Google News RSS 검색 ─────────────────────────────────────
async function fetchNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const response = await safeFetch(url);
    const xml = await response.text();
    const result = xmlParser.parse(xml);
    const items = result?.rss?.channel?.item;
    return Array.isArray(items) ? items : (items ? [items] : []);
  } catch (error) {
    console.error(`RSS Fetch 에러: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('=== 의정부 AI 뉴스 헌터 파이프라인 시작 ===');

  const existingTitles = await getExistingTitles();
  
  // 1. 키워드 생성 (AI 자유도 보장)
  const querySchema = {
    type: 'OBJECT',
    properties: {
      query: { type: 'STRING', description: '구글 뉴스 검색어' }
    }
  };
  
  const queryPrompt = `당신은 의정부시의 트렌디한 소식을 발굴하는 로컬 에디터입니다.
기존 다룬 주제: ${existingTitles.join(', ')}
위 주제들과 겹치지 않는, 의정부시 최신 정책, 행사, 복지, 부동산 개발 등 시민이 가장 관심가질 만한 뉴스 검색어 1개를 만드세요.
특히 시민들이 가장 클릭하고 싶어하는 '돈 되는 지원금 혜택'이나 '주말 나들이/행사' 위주로 발굴하세요. (예: "의정부 청년 혜택", "의정부 축제", "의정부사랑카드")`;

  console.log('[1/4] AI 검색어 창작 중...');
  const { query } = await callGemini(queryPrompt, querySchema);
  console.log(`  -> AI 선택 검색어: "${query}"`);

  // 2. RSS 기사 수집
  console.log('[2/4] 구글 뉴스 RSS 수집 중...');
  const newsItems = await fetchNews(`의정부 ${query}`);
  
  if (newsItems.length === 0) {
    console.log('  -> 관련 뉴스가 없습니다. 종료합니다.');
    return;
  }
  
  const bestNews = newsItems[0];
  console.log(`  -> 타겟 기사 발굴: ${bestNews.title}`);

  // 3. 기획안 작성 (Step 1)
  // 의정부 전용 헌법 규칙 (보상스쿨 12조 완벽 이식)
  const { STRICT_RULES } = require('./prompt-builder.js');

  const planPrompt = `의정부 시민을 위한 정보성 블로그 글 기획안을 작성하세요.
[기사 원문]
제목: ${bestNews.title}
링크: ${bestNews.link}
발행일: ${bestNews.pubDate}

이 기사를 바탕으로, 시민들이 알아야 할 혜택이나 정보를 뽑아내 SEO 최적화된 블로그 기획안(JSON)을 만드세요.`;

  const PLAN_SCHEMA = {
    type: 'OBJECT',
    properties: {
      thoughtProcess: { type: 'STRING' },
      slug: { type: 'STRING', description: '영문 하이픈 구분 (예: uijeongbu-youth-support)' },
      title: { type: 'STRING' },
      summary: { type: 'STRING' },
      category: { type: 'STRING', description: "'숨은 지원금 찾기', '이번주 뭐하지?', '우리 아이 혜택', '아플 때 든든하게', '취업과 창업', '슬기로운 주거생활', '출퇴근과 교통', '알아두면 쓸데있는 팁' 중 반드시 1개를 선택하세요." },
      tags: { type: 'ARRAY', items: { type: 'STRING' } }
    },
    required: ['thoughtProcess', 'slug', 'title', 'summary', 'category', 'tags']
  };

  console.log('[3/4] AI 기획(Plan) 중...');
  const plan = await callGemini(planPrompt, PLAN_SCHEMA);
  console.log(`  -> 기획 완료: ${plan.title}`);
  
  await sleep(3000);

  // 4. 본문 작성 (Step 2)
  const contentPrompt = `의정부 시민 블로그 에디터로서 아래 기획안을 바탕으로 마크다운 본문을 작성하세요.
목표: 시민들에게 유익한 정보 전달 및 의정부 지역 검색 노출 최적화

[기획안]
- 제목: ${plan.title}
- 내용 요약: ${plan.summary}

# ⚖️ 공통 글쓰기 헌법 규칙 (STRICT WRITING RULES)
${STRICT_RULES}

[추가 특별 지침]
- 방대한 분량(최소 4~5개 H2 섹션)과 촘촘한 분석(하위 H3)을 갖춘 초장문 전문 칼럼을 작성하십시오.
- 절차나 데이터, 비교 항목 등은 텍스트로 나열하지 말고 반드시 "마크다운 표(|---|---|)"를 사용하여 렌더링하세요.

위 기획안과 헌법 규칙을 100% 준수하여, 본문(markdownContent)만 JSON으로 반환하세요.`;

  const CONTENT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      markdownContent: { type: 'STRING' }
    },
    required: ['markdownContent']
  };

  console.log('[4/4] AI 본문 집필(Execute) 중...');
  const { markdownContent } = await callGemini(contentPrompt, CONTENT_SCHEMA);
  
  // 5. 파일 저장
  const dateStr = new Date().toISOString().split('T')[0];
  const uniqueSlug = `${dateStr}-${plan.slug}`;
  
  const frontmatter = {
    title: plan.title,
    date: new Date().toISOString(),
    summary: plan.summary,
    category: plan.category,
    tags: plan.tags,
    sourceLink: bestNews.link || ''
  };

  const fileContent = matter.stringify(markdownContent, frontmatter);
  
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(POSTS_DIR, `${uniqueSlug}.md`), fileContent, 'utf8');
  
  console.log(`=== 저장 완료: ${uniqueSlug}.md ===`);
}

main().catch(err => {
  console.error('치명적 에러:', err.message);
  process.exit(1);
});
