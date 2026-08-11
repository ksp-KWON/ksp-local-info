'use strict';

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? '').replace(/(^['"]|['"]$)/g, '').trim();
    }
  });
}

const { callGemini, sleep } = require('./gemini-helper');
const { generateSourceId, getExistingSourceIds, saveMarkdownPost, makeSlug } = require('./post-utils');
const { 
  PLAN_SCHEMA, 
  CONTENT_SCHEMA, 
  getRandomAngle, 
  buildPlanPrompt, 
  buildContentPrompt 
} = require('./prompt-builder');

const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');
const COOLDOWN_SEC = 10;

async function main() {
  console.log(`=== 의정부 AI 자동글쓰기 2-Step 파이프라인 시작 (${new Date().toISOString()}) ===`);

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('오류: GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
  }

  // 1. 기존 발행된 포스트들의 sourceId 목록 추출
  const existingSourceIds = getExistingSourceIds();

  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('local-info.json 파일이 없습니다. 종료합니다.');
    return;
  }

  const localInfo = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
  const allItems = [...(localInfo.events || []), ...(localInfo.benefits || [])];

  // 2. 미발행 항목 필터링 (sourceId 기반의 완벽한 중복 검증)
  const pending = allItems.filter(item => {
    if (!item.title) return false;
    const sourceId = generateSourceId(item.title);
    return !existingSourceIds.has(sourceId);
  });

  if (pending.length === 0) {
    console.log('모든 데이터가 이미 포스팅되어 있습니다. 새 글을 작성하지 않습니다.');
    return;
  }

  console.log(`총 ${pending.length}개의 미발행 항목 발견. 일괄 포스팅을 시작합니다.`);

  const today = new Date().toISOString().split('T')[0];
  let successCount = 0;

  // 3. 메인 루프 (2-Step AI 호출 -> 파일 저장)
  for (const item of pending) {
    const sourceId = generateSourceId(item.title);
    console.log(`\n[작업 시작] ${item.title} (Source ID: ${sourceId})`);
    
    const currentAngle = getRandomAngle();
    console.log(`  [설정] 앵글(관점): ${currentAngle.name}`);

    try {
      // Step 1: 기획안 생성
      console.log('  [Step 1] 기획안 생성 중...');
      const planPrompt = buildPlanPrompt(item);
      const plan = await callGemini(planPrompt, PLAN_SCHEMA);
      
      console.log(`    🧠 [기획 사고 과정] : ${plan.thoughtProcess}`);
      console.log(`    ✅ 기획 완료 : ${plan.frontmatter.title}`);
      
      console.log('  [대기] 5초 쿨다운...');
      await sleep(5000);

      // Step 2: 본문 작성
      console.log('  [Step 2] 본문 마크다운 작성 중...');
      const contentPrompt = buildContentPrompt(item, plan, currentAngle);
      const contentResult = await callGemini(contentPrompt, CONTENT_SCHEMA);
      
      console.log(`    🧠 [본문 집필 사고 과정] : ${contentResult.thoughtProcess}`);
      console.log(`    ✅ 본문 완료 (${contentResult.markdownContent.length}자)`);

      // 메타데이터 병합 및 저장
      const frontmatter = {
        title: plan.frontmatter.title,
        date: today,
        summary: plan.frontmatter.summary,
        category: plan.frontmatter.category,
        tags: plan.frontmatter.tags,
        sourceId: sourceId,
        slug: makeSlug(item.title, today)
      };

      const saved = saveMarkdownPost(frontmatter, contentResult.markdownContent);
      console.log(`  [완료] ${path.basename(saved.filePath)} 저장됨.`);
      successCount++;

    } catch (err) {
      console.error(`  [오류] "${item.title}" — 파이프라인 실패: ${err.message}`);
    }

    if (item !== pending[pending.length - 1]) {
      console.log(`  [대기] ${COOLDOWN_SEC}초 쿨다운...`);
      await sleep(COOLDOWN_SEC * 1000);
    }
  }

  console.log(`\n=== 자동글쓰기 종료 (성공: ${successCount}/${pending.length}건) ===`);
}

main().catch(err => {
  console.error('치명적 오류:', err.message);
  process.exit(1);
});
