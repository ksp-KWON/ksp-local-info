/**
 * scripts/generate-blog-post.js
 * 의정부 건강·생활 정보 포털 [하이브리드 자동 포스트 오토 파일럿 엔진]
 * 
 * 헌법 준수 (.agents/AGENTS.md)
 * Tier 1: 정부24 공공데이터 포털 API (신규 복지·지원금 공고 최우선 작성)
 * Tier 2: 실시간 의정부 뉴스 Google RSS 헌터 (실시간 의정부 시정/행사/축제/지원금 뉴스 심층 발굴)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { XMLParser } = require('fast-xml-parser');
const { callGemini } = require('./gemini-helper');
const { POSTS_DIR, sleep, safeFetch } = require('./pipeline-utils');
const { generateSourceId, getExistingSourceIds, saveMarkdownPost, makeSlug } = require('./post-utils');
const {
  STRICT_RULES,
  PLAN_SCHEMA,
  CONTENT_SCHEMA,
  getRandomAngle,
  buildPlanPrompt,
  buildContentPrompt
} = require('./prompt-builder');

const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });
const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');

// [공통] 기존 발행된 제목 목록 수집
function getExistingTitles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      return String(matter(content).data.title || '');
    } catch { return ''; }
  }).filter(Boolean);
}

// ─── [Tier 1] 공공데이터(local-info.json) 기반 포스팅 ─────────────────────
async function runTier1() {
  console.log('\n[Tier 1] 정부24 공공데이터 미발행 항목 검사 중...');
  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('  -> local-info.json 파일이 없습니다.');
    return null;
  }

  const existingSourceIds = getExistingSourceIds();
  const localInfo = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
  const allItems = [...(localInfo.events || []), ...(localInfo.benefits || [])];

  const pending = allItems.filter(item => {
    if (!item.title) return false;
    const sourceId = generateSourceId(item.title);
    return !existingSourceIds.has(sourceId);
  });

  if (pending.length === 0) {
    console.log('  -> 공공데이터에 미발행된 신규 공고가 없습니다.');
    return null;
  }

  const targetItem = pending[0];
  const sourceId = generateSourceId(targetItem.title);
  console.log(`  -> Tier 1 타겟 선정: "${targetItem.title}" (Source ID: ${sourceId})`);

  const angle = getRandomAngle();
  const plan = await callGemini(buildPlanPrompt(targetItem), PLAN_SCHEMA);
  await sleep(2000);
  const content = await callGemini(buildContentPrompt(targetItem, plan, angle), CONTENT_SCHEMA);

  const today = new Date().toISOString().split('T')[0];
  const slug = makeSlug(plan.frontmatter.title || targetItem.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: new Date().toISOString(),
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceId: sourceId,
    sourceLink: targetItem.link || 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ─── [Tier 2] 실시간 Google News RSS 헌터 (다각도 탐색 강화) ──────────────
async function fetchNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const response = await safeFetch(url);
    const xml = await response.text();
    const result = xmlParser.parse(xml);
    const rawItems = result?.rss?.channel?.item;
    if (!rawItems) return [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    return items.map(item => ({
      title: String(item.title || '').replace(/<[^>]+>/g, '').trim(),
      link: String(item.link || '').trim(),
      pubDate: String(item.pubDate || '').trim(),
    })).filter(item => item.title && item.title.length > 5);
  } catch (error) {
    console.error(`  -> RSS Fetch 에러 (${query}): ${error.message}`);
    return [];
  }
}

async function runTier2() {
  console.log('\n[Tier 2] 실시간 의정부 뉴스 Google RSS 헌터 가동 중...');
  const existingTitles = getExistingTitles();

  // 1. AI에게 최적 검색어 생성 요청
  const queryPrompt = `당신은 의정부시의 최신 소식을 발굴하는 로컬 수석 에디터입니다.
기존에 작성된 글 제목 목록:
${existingTitles.slice(-25).join('\n')}

기존 글들과 겹치지 않는, 의정부시의 최신 혜택, 축제/행사, 지원금, 일자리, 문화, 복지, 교통 관련 구글 뉴스 검색어 1개를 생성하세요. (예: "의정부 청년 혜택", "의정부 축제 공연", "의정부사랑카드 혜택", "의정부 일자리 박람회")`;

  const querySchema = {
    type: 'OBJECT',
    properties: {
      query: { type: 'STRING', description: '구글 뉴스 검색어 (의정부 포함)' }
    },
    required: ['query']
  };

  let searchQueries = [];
  try {
    const { query } = await callGemini(queryPrompt, querySchema);
    if (query) searchQueries.push(query.includes('의정부') ? query : `의정부 ${query}`);
  } catch (e) {
    console.error(`  -> AI 검색어 생성 실패: ${e.message}`);
  }

  // 2. 다각도 백업 쿼리 풀 (Fallback Queries)
  const FALLBACK_QUERIES = [
    '의정부시 지원금',
    '의정부 축제 문화 행사',
    '의정부 청년 복지',
    '의정부사랑카드 혜택',
    '의정부 교통 일자리',
    '의정부 생활 민원 혜택'
  ];
  for (const fq of FALLBACK_QUERIES) {
    if (!searchQueries.includes(fq)) searchQueries.push(fq);
  }

  // 3. 순차 검색으로 최적의 기사 발굴
  let candidate = null;
  for (const q of searchQueries) {
    console.log(`  -> RSS 탐색 쿼리: "${q}"`);
    const newsItems = await fetchNews(q);
    if (newsItems.length === 0) continue;

    // 기존 글들과 제목이 겹치지 않는 신선한 기사 찾기
    const freshItem = newsItems.find(item => {
      const cleanT = item.title.slice(0, 15);
      return !existingTitles.some(title => title.includes(cleanT));
    });

    if (freshItem) {
      candidate = freshItem;
      console.log(`  -> 최적의 신규 뉴스 발굴: "${candidate.title}"`);
      break;
    }
  }

  if (!candidate) {
    console.log('  -> 관련 신규 뉴스를 찾지 못했습니다.');
    return null;
  }

  console.log(`  -> 포스팅 작성 대상 기사: "${candidate.title}" (${candidate.pubDate})`);

  const planPrompt = `당신은 의정부 건강·생활 정보 포털의 수석 에디터입니다.
아래 실시간 뉴스 기사를 바탕으로 의정부 시민들에게 실질적인 도움이 되는 고품질 블로그 기획안(JSON)을 작성하세요.

[기사 정보]
제목: ${candidate.title}
링크: ${candidate.link}
발행일: ${candidate.pubDate}

[작성 요구사항]
- 의정부 시민의 실생활 혜택, 참여 방법, 신청 절차를 중심으로 기획안을 작성하세요.
- 구글 검색 최적화(SEO)를 고려한 신뢰도 높은 제목과 150자 이내의 명쾌한 요약문을 만드세요.`;

  const plan = await callGemini(planPrompt, PLAN_SCHEMA);
  await sleep(2000);

  const angle = getRandomAngle();
  const contentPrompt = `당신은 의정부 시민 포털의 수석 공공 에디터입니다.
아래 기획안을 바탕으로 헌법을 100% 준수하여 품격 있는 마크다운 본문을 작성하세요.

[기획안]
- 제목: ${plan.frontmatter.title}
- 카테고리: ${plan.frontmatter.category}
- 요약: ${plan.frontmatter.summary}

# 🏛️ 의정부 포털 공통 글쓰기 헌법 규칙 (STRICT WRITING RULES)
${STRICT_RULES}

[오늘의 글쓰기 관점]
- 관점(Angle): [${angle.name}] ${angle.instruction}

위 기획안과 헌법 규칙을 완벽히 반영하여 본문(markdownContent)만 JSON으로 반환하세요.`;

  const content = await callGemini(contentPrompt, CONTENT_SCHEMA);

  const today = new Date().toISOString().split('T')[0];
  const slug = makeSlug(plan.frontmatter.title || candidate.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: new Date().toISOString(),
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceLink: candidate.link || 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ─── [메인 실행 엔진] ──────────────────────────────────────────────────
async function main() {
  console.log('======================================================');
  console.log('🏛️ [의정부 포털] 2-Tier 하이브리드 오토 파일럿 엔진 시작');
  console.log('실행 시각:', new Date().toISOString());
  console.log('======================================================');

  try {
    // 1단계: 정부24 공공데이터 우선
    const tier1Result = await runTier1();
    if (tier1Result) {
      console.log(`\n🎉 [Tier 1 성공] 신규 공공데이터 포스팅 완료: ${tier1Result}`);
      return;
    }

    // 2단계: 실시간 의정부 뉴스 Google RSS 헌터
    const tier2Result = await runTier2();
    if (tier2Result) {
      console.log(`\n🎉 [Tier 2 성공] 실시간 뉴스 RSS 포스팅 완료: ${tier2Result}`);
      return;
    }

    console.log('\n⚠️ [알림] 금일 발행할 수 있는 새로운 항목이 없습니다.');
  } catch (error) {
    console.error('\n💥 [치명적 오류] 오토 파일럿 엔진 실행 실패:', error.message);
    process.exit(1);
  }
}

main();
