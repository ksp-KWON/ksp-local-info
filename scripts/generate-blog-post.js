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
const { POST_SCHEMA, buildBlogPrompt } = require('./prompt-builder');

const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');
const COOLDOWN_SEC = 10;

async function main() {
  console.log(`=== 의정부 자동글쓰기 전면 개편 버전 시작 (${new Date().toISOString()}) ===`);

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

  // 3. 메인 루프 (항목별 AI 호출 -> 파일 저장)
  for (const item of pending) {
    const sourceId = generateSourceId(item.title);
    console.log(`\n[작성 중] ${item.title} (Source ID: ${sourceId})`);

    let aiResult;
    try {
      const prompt = buildBlogPrompt(item);
      // JSON Schema를 강제하여 파싱 에러나 찌꺼기 텍스트 발생을 원천 차단
      aiResult = await callGemini(geminiKey, prompt, POST_SCHEMA);
    } catch (err) {
      console.error(`  [건너뜀] "${item.title}" — API 오류: ${err.message}`);
      continue;
    }

    if (!aiResult || !aiResult.frontmatter || !aiResult.markdownContent) {
      console.error(`  [오류] AI가 올바른 JSON 규격으로 응답하지 않았습니다. 스킵합니다.`);
      continue;
    }

    // AI가 생성한 메타데이터에 시스템 고유값 주입
    const frontmatter = {
      title: aiResult.frontmatter.title,
      date: today,
      summary: aiResult.frontmatter.summary,
      category: aiResult.frontmatter.category,
      tags: aiResult.frontmatter.tags,
      sourceId: sourceId,
      slug: makeSlug(item.title, today)
    };

    // gray-matter 를 사용하여 완벽한 YAML 문법으로 안전하게 파일 저장
    try {
      const saved = saveMarkdownPost(frontmatter, aiResult.markdownContent);
      console.log(`  [완료] ${path.basename(saved.filePath)} 저장됨.`);
      successCount++;
    } catch (err) {
      console.error(`  [오류] 파일 저장 중 문제 발생: ${err.message}`);
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
