/**
 * scripts/generate-blog-post.js
 * 의정부 건강·생활 정보 포털 [공공데이터 자동 포스팅 파이프라인 엔진]
 * 
 * 헌법 준수 (.agents/AGENTS.md)
 * Tier 1: 경기24 공공데이터 포털 API (신규 복지·지원금 공고 최우선 포스팅)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { callGemini } = require('./gemini-helper');
const { sleep } = require('./pipeline-utils');
const { generateSourceId, getExistingSourceIds, saveMarkdownPost, makeSlug, getKSTDateString } = require('./post-utils');
const {
  PLAN_SCHEMA,
  CONTENT_SCHEMA,
  getRandomAngle,
  buildPlanPrompt,
  buildContentPrompt
} = require('./prompt-builder');

const CITY_RSS_PATH = path.join(process.cwd(), 'public/data/city-rss.json');
const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');

// ── 공통 포스팅 생성 및 마크다운 저장 엔진 ─────────────────────────────
async function generateAndSavePost(targetItem, tierLabel) {
  const sourceId = targetItem.sourceId || generateSourceId(targetItem.title);
  console.log(`  -> [${tierLabel}] 타깃 선정: "${targetItem.title}" (Source ID: ${sourceId})`);

  const angle = getRandomAngle();
  const plan = await callGemini(buildPlanPrompt(targetItem), PLAN_SCHEMA);
  await sleep(2000);
  const content = await callGemini(buildContentPrompt(targetItem, plan, angle), CONTENT_SCHEMA);

  const today = getKSTDateString();
  const slug = makeSlug(plan.frontmatter.title || targetItem.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: getKSTDateString() + 'T09:00:00+09:00',
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceId: sourceId,
    sourceLink: targetItem.link || 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ── [Tier 1] 의정부시청 공식 RSS 최우선 포스팅 ─────────────────────
async function runTier1CityRss() {
  console.log('\n[Tier 1] 의정부시청 공식 RSS 미발행 항목 검색 중...');
  if (!fs.existsSync(CITY_RSS_PATH)) {
    console.log('  -> city-rss.json 파일이 없습니다.');
    return [];
  }

  const existingSourceIds = getExistingSourceIds();
  const rssQueue = JSON.parse(fs.readFileSync(CITY_RSS_PATH, 'utf8'));

  const pending = rssQueue.filter(item => {
    if (!item.title) return false;
    const sourceId = item.sourceId || generateSourceId(item.title);
    return !existingSourceIds.has(sourceId);
  });

  if (pending.length === 0) {
    console.log('  -> 시청 RSS에 미발행된 신규 소식이 없습니다.');
    return [];
  }

  console.log(`  -> 미발행 신규 소식 ${pending.length}건 발견. 전수 자동 생성 시작...`);
  const published = [];
  for (let i = 0; i < pending.length; i++) {
    const item = pending[i];
    try {
      console.log(`\n[${i + 1}/${pending.length}] 글 작성 진행: "${item.title}"`);
      const fileName = await generateAndSavePost(item, 'Tier 1: 시청 공식 RSS');
      published.push(fileName);
      existingSourceIds.add(item.sourceId || generateSourceId(item.title));
      await sleep(2500); // Gemini API 레이트 리밋 방지 쾌적 대기
    } catch (err) {
      console.error(`  ❌ "${item.title}" 생성 실패:`, err.message);
    }
  }

  return published;
}

// ── [Tier 2] 경기24 공공데이터(local-info.json) 보조 포스팅 ────────────
async function runTier2LocalInfo() {
  console.log('\n[Tier 2] 경기24 공공데이터 미발행 항목 검색 중...');
  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('  -> local-info.json 파일이 없습니다.');
    return [];
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
    console.log('  -> 경기24 공공데이터에 미발행된 신규 공고가 없습니다.');
    return [];
  }

  console.log(`  -> 미발행 경기24 공공데이터 ${pending.length}건 발견. 전수 자동 생성 시작...`);
  const published = [];
  for (let i = 0; i < pending.length; i++) {
    const item = pending[i];
    try {
      console.log(`\n[${i + 1}/${pending.length}] 글 작성 진행: "${item.title}"`);
      const fileName = await generateAndSavePost(item, 'Tier 2: 경기24 공공데이터');
      published.push(fileName);
      existingSourceIds.add(generateSourceId(item.title));
      await sleep(2500);
    } catch (err) {
      console.error(`  ❌ "${item.title}" 생성 실패:`, err.message);
    }
  }

  return published;
}

// ── [Tier 3] 의정부 평생학습 실시간 강좌(learning-courses.json) 자동 포스팅 ───
const LEARNING_COURSES_PATH = path.join(process.cwd(), 'src/data/learning-courses.json');

async function runTier3LifelongLearning() {
  console.log('\n[Tier 3] 의정부 평생학습 실시간 강좌 미발행 항목 검색 중...');
  if (!fs.existsSync(LEARNING_COURSES_PATH)) {
    console.log('  -> learning-courses.json 파일이 없어 자동 수집을 실행합니다...');
    try {
      const { execSync } = require('child_process');
      execSync('node scripts/build-learning-cache.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('  ❌ 강좌 캐시 수집 실패:', e.message);
      return [];
    }
  }

  const existingSourceIds = getExistingSourceIds();
  const learningData = JSON.parse(fs.readFileSync(LEARNING_COURSES_PATH, 'utf8'));
  const courses = learningData.courses || [];

  // 신규 미발행 접수중 강좌 탐색
  const pending = courses.filter(item => {
    if (!item.title) return false;
    const sourceId = item.id || generateSourceId(item.title);
    return !existingSourceIds.has(sourceId);
  });

  if (pending.length === 0) {
    console.log('  -> 평생학습 강좌에 미발행된 신규 항목이 없습니다.');
    return [];
  }

  // 양산형 페널티 방지를 위해 1회 배치당 최우선 알짜 강좌 최대 2건 선별 발행
  const targetCourses = pending.slice(0, 2);
  console.log(`  -> 미발행 평생학습 강좌 ${pending.length}건 중 엄선된 ${targetCourses.length}건 자동 생성 시작...`);

  const published = [];
  for (let i = 0; i < targetCourses.length; i++) {
    const course = targetCourses[i];
    const postItem = {
      title: course.title,
      content: `교육기관: ${course.org}, 교육장소: ${course.address} (${course.dong}), 교육기간: ${course.eduPeriod}, 신청기간: ${course.applyPeriod}, 모집정원: ${course.capacity}, 수강료: ${course.isFree ? '무료' : '유료'}, 주요대상: ${course.target}, 분야: ${course.category}. 의정부시 평생학습 통합플랫폼 뉴런 공식 온라인 접수.`,
      link: course.applyUrl || 'https://sugang.ull.or.kr',
      sourceId: course.id,
      category: '교육·청소년',
      department: course.org
    };

    try {
      console.log(`\n[${i + 1}/${targetCourses.length}] 평생학습 글 작성 진행: "${course.title}"`);
      const fileName = await generateAndSavePost(postItem, 'Tier 3: 의정부 평생학습 실시간 강좌');
      published.push(fileName);
      existingSourceIds.add(course.id);
      await sleep(2500);
    } catch (err) {
      console.error(`  ❌ "${course.title}" 생성 실패:`, err.message);
    }
  }

  return published;
}

// ── [메인 실행 엔진] ───────────────────────────────────────────────
async function main() {
  console.log('======================================================');
  console.log('🚀 [의정부 포털] 오토 포스팅 엔진 시작 (전수 일괄 발행 모드)');
  console.log('실행 시각:', new Date().toISOString());
  console.log('======================================================');

  try {
    // 1순위: 의정부시청 공식 RSS 피드 전수 발행
    const tier1Results = await runTier1CityRss();

    // 2순위: 경기24 공공데이터 전수 발행
    const tier2Results = await runTier2LocalInfo();

    // 3순위: 의정부 평생학습 실시간 강좌 선별 발행
    const tier3Results = await runTier3LifelongLearning();

    const totalCount = (tier1Results?.length || 0) + (tier2Results?.length || 0) + (tier3Results?.length || 0);
    if (totalCount > 0) {
      console.log(`\n🎉 [성공] 총 ${totalCount}건의 신규 시정 가이드 자동 포스팅 완료!`);
    } else {
      console.log('\nℹ️ [알림] 현재 발행 대기 중인 새로운 이슈가 없습니다.');
    }
  } catch (error) {
    console.error('\n❌ [치명적 오류] 오토 포스팅 엔진 실행 실패:', error.message);
    process.exit(1);
  }
}

main();
