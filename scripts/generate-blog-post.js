/**
 * scripts/generate-blog-post.js
 * 의정부 건강·생활 정보 포털 [3-Tier 하이브리드 자동 포스팅 오토 파일럿 엔진]
 * 
 * 헌법 준수 (.agents/AGENTS.md)
 * Tier 1: 정부24 공공데이터 API (신규 공고 발굴 시 우선 작성)
 * Tier 2: 실시간 의정부 뉴스 RSS 헌터 (최신 이슈/행사/지원금)
 * Tier 3: 의정부 시민 필수 에버그린(Evergreen) 지식 베이스 (중복 없는 365일 무중단 발행 보장)
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

// ── [공통] 기존 발행된 제목 및 Source ID 목록 수집 ─────────────────────────
function getExistingTitles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      return matter(content).data.title;
    } catch { return ''; }
  }).filter(Boolean);
}

// ── [Tier 1] 공공데이터(local-info.json) 기반 포스팅 ─────────────────────────
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
  await sleep(3000);
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

// ── [Tier 2] 실시간 Google News RSS 헌터 ──────────────────────────────────
async function fetchNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const response = await safeFetch(url);
    const xml = await response.text();
    const result = xmlParser.parse(xml);
    const items = result?.rss?.channel?.item;
    return Array.isArray(items) ? items : (items ? [items] : []);
  } catch (error) {
    console.error(`  -> RSS Fetch 에러: ${error.message}`);
    return [];
  }
}

async function runTier2() {
  console.log('\n[Tier 2] 실시간 의정부 뉴스 RSS 헌터 가동 중...');
  const existingTitles = getExistingTitles();

  const queryPrompt = `당신은 의정부시의 최신 소식을 발굴하는 로컬 에디터입니다.
기존 다룬 주제: ${existingTitles.slice(-30).join(', ')}
위 주제들과 겹치지 않는, 의정부시 최신 정책, 축제, 복지 지원금, 교통, 일자리 관련 구글 뉴스 검색어 1개를 생성하세요. (예: "의정부 청년 혜택", "의정부 축제", "의정부사랑카드")`;

  const querySchema = {
    type: 'OBJECT',
    properties: {
      query: { type: 'STRING', description: '구글 뉴스 검색어' }
    },
    required: ['query']
  };

  const { query } = await callGemini(queryPrompt, querySchema);
  console.log(`  -> AI 발굴 검색어: "의정부 ${query}"`);

  const newsItems = await fetchNews(`의정부 ${query}`);
  if (!newsItems || newsItems.length === 0) {
    console.log('  -> 관련 신규 뉴스가 없습니다.');
    return null;
  }

  // 기존 글과 제목 유사도가 낮은 최적 기사 선택
  const candidate = newsItems.find(item => {
    return !existingTitles.some(title => title.includes(item.title.slice(0, 15)));
  }) || newsItems[0];

  console.log(`  -> 타겟 기사 발굴: "${candidate.title}"`);

  const planPrompt = `의정부 시민을 위한 정보성 블로그 글 기획안을 작성하세요.
[기사 원문]
제목: ${candidate.title}
링크: ${candidate.link}
발행일: ${candidate.pubDate}

이 기사를 바탕으로, 의정부 시민들이 알아야 할 혜택이나 정보를 뽑아내 SEO 최적화된 블로그 기획안(JSON)을 만드세요.`;

  const plan = await callGemini(planPrompt, PLAN_SCHEMA);
  await sleep(3000);

  const angle = getRandomAngle();
  const contentPrompt = `의정부 시민 블로그 에디터로서 아래 기획안을 바탕으로 마크다운 본문을 작성하세요.
목표: 시민들에게 유익한 정보 전달 및 의정부 지역 검색 노출 최적화

[기획안]
- 제목: ${plan.frontmatter.title}
- 카테고리: ${plan.frontmatter.category}
- 요약: ${plan.frontmatter.summary}

# ⚖️ 의정부 포털 공통 글쓰기 헌법 규칙 (STRICT WRITING RULES)
${STRICT_RULES}

[오늘의 글쓰기 관점]
- 관점(Angle): [${angle.name}] ${angle.instruction}

위 기획안과 헌법 규칙을 100% 준수하여 본문(markdownContent)만 JSON으로 반환하세요.`;

  const content = await callGemini(contentPrompt, CONTENT_SCHEMA);

  const today = new Date().toISOString().split('T')[0];
  const slug = makeSlug(plan.frontmatter.title);
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

// ── [Tier 3] 의정부 시민 필수 에버그린(Evergreen) 지식 베이스 ─────────────
const EVERGREEN_TOPICS = [
  {
    title: "의정부시 달빛어린이병원 & 심야약국 이용 가이드 및 야간진료비 꿀팁",
    category: "아플 때 든든하게",
    tags: ["의정부달빛어린이병원", "의정부심야약국", "야간진료", "소아과야간진료", "의정부응급의료"]
  },
  {
    title: "의정부사랑카드 인센티브 10% 혜택 및 사용처 가맹점 총정리",
    category: "숨은 지원금 찾기",
    tags: ["의정부사랑카드", "경기지역화폐", "지역화폐가맹점", "의정부인센티브", "생활비절약"]
  },
  {
    title: "의정부시 청년 면접정장 무료 대여 '청년옷장' 신청 방법 및 대여 꿀팁",
    category: "취업과 창업",
    tags: ["의정부청년옷장", "면접정장무료대여", "의정부청년지원", "취업준비", "청년일자리"]
  },
  {
    title: "의정부시 보건소 무료 건강검진 및 생애주기별 예방접종 혜택 총정리",
    category: "아플 때 든든하게",
    tags: ["의정부보건소", "무료건강검진", "국가건강검진", "보건소예방접종", "의정부의료혜택"]
  },
  {
    title: "2026 의정부시 출산축하금 및 첫만남이용권 신청 자격과 혜택",
    category: "우리 아이 혜택",
    tags: ["의정부출산축하금", "첫만남이용권", "의정부임산부혜택", "출산지원금", "산후조리비"]
  },
  {
    title: "의정부시 청년 주거급여 분리지급 자격 요건 및 온라인 신청 가이드",
    category: "슬기로운 주거생활",
    tags: ["청년주거급여", "의정부청년주거", "주거급여분리지급", "복지로신청", "청년월세지원"]
  },
  {
    title: "의정부 경전철 환승 할인 및 K-패스(알뜰교통카드) 교통비 30% 환급 팁",
    category: "출퇴근과 교통",
    tags: ["의정부경전철", "K패스", "의정부교통할인", "대중교통환승", "기후동행카드"]
  },
  {
    title: "의정부시 어르신 기초연금 수급자격 및 재산·소득 기준 완벽 가이드",
    category: "숨은 지원금 찾기",
    tags: ["의정부기초연금", "어르신복지", "기초노령연금", "국민연금", "시니어지원"]
  },
  {
    title: "의정부시 1인 가구 병원 안심동행 서비스 신청 방법 및 이용 요금",
    category: "아플 때 든든하게",
    tags: ["1인가구안심동행", "병원동행서비스", "의정부1인가구", "돌봄서비스", "시민복지"]
  },
  {
    title: "의정부 평생학습원 무료 자격증 강좌 및 인기 프로그램 수강신청 노하우",
    category: "알아두면 쓸데있는 팁",
    tags: ["의정부평생학습원", "무료자격증강좌", "시민평생교육", "취미강좌", "역량강화"]
  }
];

async function runTier3() {
  console.log('\n[Tier 3] 의정부 에버그린 지식 베이스 가동 중...');
  const existingTitles = getExistingTitles();

  const unwritten = EVERGREEN_TOPICS.filter(t => {
    return !existingTitles.some(title => title.includes(t.title.slice(0, 15)));
  });

  if (unwritten.length === 0) {
    console.log('  -> 에버그린 토픽 목록이 모두 소진되었습니다.');
    return null;
  }

  const topic = unwritten[0];
  console.log(`  -> 에버그린 타겟 선정: "${topic.title}"`);

  const angle = getRandomAngle();
  const planPrompt = `의정부 시민을 위한 공공 정보 칼럼 기획안을 작성하세요.
주제: ${topic.title}
기본 카테고리: ${topic.category}
추천 태그: ${topic.tags.join(', ')}

의정부 시민이 일상에서 반드시 알아야 할 알찬 혜택을 담아 구글 SEO 최적화 기획안(JSON)을 작성하세요.`;

  const plan = await callGemini(planPrompt, PLAN_SCHEMA);
  await sleep(3000);

  const contentPrompt = `당신은 의정부 건강·생활 정보 포털의 수석 공공 에디터입니다.
아래 기획안을 바탕으로 헌법을 100% 준수하는 마크다운 본문을 작성하세요.

[기획안]
- 제목: ${plan.frontmatter.title}
- 카테고리: ${plan.frontmatter.category}
- 요약: ${plan.frontmatter.summary}

# ⚖️ 의정부 포털 공통 글쓰기 헌법 규칙 (STRICT WRITING RULES)
${STRICT_RULES}

[오늘의 글쓰기 관점]
- 관점(Angle): [${angle.name}] ${angle.instruction}

위 기획안과 헌법 규칙을 100% 준수하여 본문(markdownContent)만 JSON으로 반환하세요.`;

  const content = await callGemini(contentPrompt, CONTENT_SCHEMA);

  const today = new Date().toISOString().split('T')[0];
  const slug = makeSlug(plan.frontmatter.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: new Date().toISOString(),
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceLink: 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ── [Master Main Orchestrator] ───────────────────────────────────────────
async function main() {
  console.log(`\n======================================================`);
  console.log(`🏛️ [의정부 포털] 3-Tier 하이브리드 오토 파일럿 엔진 시작`);
  console.log(`실행 시각: ${new Date().toISOString()}`);
  console.log(`======================================================`);

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('치명적 오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  let generatedFile = null;

  // 1순위: 정부24 공공데이터 검사
  try {
    generatedFile = await runTier1();
  } catch (err) {
    console.warn(`[Tier 1 경고] 공공데이터 처리 실패: ${err.message}`);
  }

  // 2순위: 실시간 Google News RSS 헌터
  if (!generatedFile) {
    try {
      generatedFile = await runTier2();
    } catch (err) {
      console.warn(`[Tier 2 경고] 뉴스 RSS 헌터 처리 실패: ${err.message}`);
    }
  }

  // 3순위: 의정부 에버그린 지식 베이스
  if (!generatedFile) {
    try {
      generatedFile = await runTier3();
    } catch (err) {
      console.error(`[Tier 3 에러] 에버그린 처리 실패: ${err.message}`);
    }
  }

  if (generatedFile) {
    console.log(`\n🎉 [성공] 신규 의정부 칼럼 발행 완료: ${generatedFile}`);
  } else {
    console.log('\n⚠️ [알림] 금일 발행할 수 있는 항목이 없습니다.');
  }
}

main().catch(err => {
  console.error('파이프라인 치명적 오류:', err.message);
  process.exit(1);
});
