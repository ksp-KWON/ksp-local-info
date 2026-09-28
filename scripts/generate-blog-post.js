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
    return { attempted: 0, published: [] };
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
    return { attempted: 0, published: [] };
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

  return { attempted: pending.length, published };
}

// ── [Tier 2] 경기24 공공데이터(local-info.json) 보조 포스팅 ────────────
async function runTier2LocalInfo() {
  console.log('\n[Tier 2] 경기24 공공데이터 미발행 항목 검색 중...');
  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('  -> local-info.json 파일이 없습니다.');
    return { attempted: 0, published: [] };
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
    return { attempted: 0, published: [] };
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

  return { attempted: pending.length, published };
}

// ── [Tier 3] 의정부 평생학습 실시간 강좌(learning-courses.json) 자동 포스팅 ───
const LEARNING_COURSES_PATH = path.join(process.cwd(), 'src/data/learning-courses.json');

/**
 * 평생학습 강좌 질적 선별 필터 (CQF 헌법 준수)
 * - 커리큘럼(intro) 100자 이상 완비된 강좌만 선별
 * - 자잘한 사설 공예/소품 만들기(곱창밴드, 키친크로스 등) 및 단순 회차 배제
 * - 단순 분반(A반, B반) 및 온라인 신청 폼(수어노래방 등) 배제
 */
function isQualityCivicCourse(course) {
  if (!course || !course.title) return false;

  // 1. 상세 교육계획서(intro)가 최소 100자 이상 충실하게 작성된 강좌만 허용
  if (!course.intro || course.intro.trim().length < 100) return false;

  // 2. 자잘한 일일 취미 소품 만들기 및 단순 신청폼 배제
  const lowQualityKeywords = [
    '곱창밴드', '손바느질', '키친크로스', '도시락보자기', '패브릭 포스터',
    '가방만들기', '종이접기', '수어노래방', '우쿨렐레'
  ];
  if (lowQualityKeywords.some(kw => course.title.includes(kw))) return false;

  // 3. 단순 요일/분반 쪼개기 강좌 배제
  if (/-[A-Z]반|\b[0-9]반\b|화목반|월수반|금요반|토요반/.test(course.title)) return false;

  return true;
}

async function runTier3LifelongLearning() {
  console.log('\n[Tier 3] 의정부 평생학습 실시간 강좌 미발행 항목 검색 중...');
  if (!fs.existsSync(LEARNING_COURSES_PATH)) {
    console.log('  -> learning-courses.json 파일이 없어 자동 수집을 실행합니다...');
    try {
      const { execSync } = require('child_process');
      execSync('node scripts/build-learning-cache.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('  ❌ 강좌 캐시 수집 실패:', e.message);
      return { attempted: 0, published: [] };
    }
  }

  const existingSourceIds = getExistingSourceIds();
  // 기발행된 작은도서관 창의융합 놀이터 강좌 ID 명시적 제외
  existingSourceIds.add('ujb-139');

  const learningData = JSON.parse(fs.readFileSync(LEARNING_COURSES_PATH, 'utf8'));
  const courses = learningData.courses || [];

  // 대표님 선별 기준(isQualityCivicCourse)에 부합하는 고품질 미발행 강좌만 엄선
  const pending = courses.filter(item => {
    if (!item.title) return false;
    const sourceId = item.id || generateSourceId(item.title);
    if (existingSourceIds.has(sourceId)) return false;
    return isQualityCivicCourse(item);
  });

  if (pending.length === 0) {
    console.log('  -> 평생학습 강좌 중 선별 기준(알짜 킬러 강좌)을 통과한 미발행 신규 항목이 없습니다.');
    return { attempted: 0, published: [] };
  }

  // 대기열이 쌓이지 않도록 선별 기준을 통과한 신규 알짜 강좌 전수 일괄 자동 생성
  const targetCourses = pending;
  console.log(`  -> 선별 기준을 통과한 신규 알짜 강좌 ${pending.length}건 전수 자동 생성 시작...`);

  const published = [];
  for (let i = 0; i < targetCourses.length; i++) {
    const course = targetCourses[i];
    const postItem = {
      title: course.title,
      content: `교육기관: ${course.org}, 교육장소: ${course.address} (${course.dong}), 교육기간: ${course.eduPeriod}, 신청기간: ${course.applyPeriod}, 모집정원: ${course.capacity}, 수강료: ${course.isFree ? '무료' : '유료'} (${course.fee || ''}), 주요대상: ${course.target}, 분야: ${course.category}. 상세 교육내용 및 강의계획: ${course.intro}. 의정부시 평생학습 통합플랫폼 뉴런 공식 온라인 접수.`,
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

  return { attempted: pending.length, published };
}

// ── [메인 실행 엔진] ───────────────────────────────────────────────
async function main() {
  console.log('======================================================');
  console.log('🚀 [의정부 포털] 오토 포스팅 엔진 시작 (전수 일괄 발행 모드)');
  console.log('실행 시각:', new Date().toISOString());
  console.log('======================================================');

  try {
    // 1순위: 의정부시청 공식 RSS 피드 전수 발행
    const tier1 = await runTier1CityRss();

    // 2순위: 경기24 공공데이터 전수 발행
    const tier2 = await runTier2LocalInfo();

    // 3순위: 의정부 평생학습 실시간 강좌 선별 발행
    const tier3 = await runTier3LifelongLearning();

    const totalAttempted = (tier1.attempted || 0) + (tier2.attempted || 0) + (tier3.attempted || 0);
    const totalPublished = (tier1.published?.length || 0) + (tier2.published?.length || 0) + (tier3.published?.length || 0);
    const totalFailed = totalAttempted - totalPublished;

    console.log('\n======================================================');
    console.log(`📊 [발행 집계] 총 대상: ${totalAttempted}건 | 성공: ${totalPublished}건 | 실패: ${totalFailed}건`);
    console.log('======================================================');

    if (totalAttempted > 0 && totalPublished === 0) {
      console.error(`\n❌ [발행 전수 실패] 대상 ${totalAttempted}건 중 성공 0건. 파이프라인 무결성 오류로 프로세스를 중단합니다.`);
      process.exit(1);
    }

    if (totalFailed > 0) {
      console.warn(`\n⚠️ [부분 실패] 총 ${totalAttempted}건 중 ${totalPublished}건 성공, ${totalFailed}건 실패.`);
    } else if (totalPublished > 0) {
      console.log(`\n🎉 [성공] 총 ${totalPublished}건의 신규 시정 가이드 자동 포스팅 무결 발행 완료!`);
    } else {
      console.log('\nℹ️ [알림] 현재 발행 대기 중인 새로운 이슈가 없습니다.');
    }
  } catch (error) {
    console.error('\n❌ [치명적 오류] 오토 포스팅 엔진 실행 실패:', error.message);
    process.exit(1);
  }
}

main();
