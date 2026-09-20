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

const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');

// ── [Tier 1] 공공데이터(local-info.json) 기반 포스팅 ─────────────────
async function runTier1() {
  console.log('\n[Tier 1] 경기24 공공데이터 미발행 항목 검색 중...');
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
  console.log(`  -> Tier 1 타깃 선정: "${targetItem.title}" (Source ID: ${sourceId})`);

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

// ── [메인 실행 엔진] ───────────────────────────────────────────────
async function main() {
  console.log('======================================================');
  console.log('🚀 [의정부 포털] 오토 포스팅 엔진 시작');
  console.log('실행 시각:', new Date().toISOString());
  console.log('======================================================');

  try {
    // 1단계: 경기24 공공데이터 우선
    const tier1Result = await runTier1();
    if (tier1Result) {
      console.log(`\n🎉 [Tier 1 성공] 신규 공공데이터 포스팅 완료: ${tier1Result}`);
      return;
    }

    console.log('\n⚠️ [알림] 금일 발행할 수 있는 새로운 이슈가 없습니다.');
  } catch (error) {
    console.error('\n❌ [치명적 오류] 오토 포스팅 엔진 실행 실패:', error.message);
    process.exit(1);
  }
}

main();
