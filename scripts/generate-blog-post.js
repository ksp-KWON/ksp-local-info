/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * generate-blog-post.js (의정부 로컬인포 v2)
 * local-info.json의 미발행 항목에 대해 Gemini AI로 블로그 글을 생성합니다.
 *
 * 변경 이력:
 * v2 - gemini-helper.js 공통 모듈 사용 (지능형 재시도/모델 폴오버)
 *    - FILENAME 의존성 제거 → 스크립트가 직접 slug 생성 (안정성 향상)
 *    - 항목 간 쿨다운 10초로 증가 (API Rate Limit 방지)
 *    - 동일 날짜 파일명 충돌 방지 (시퀀스 번호 자동 부여)
 *    - ANALYSIS 블록 자동 제거 (최종 본문에만 포함)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { callGemini, sleep } = require('./gemini-helper');

// ── 환경변수 로드 (.env.local) ──────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? '').replace(/(^['"]|['"]$)/g, '').trim();
    }
  });
}

// ── 상수 ───────────────────────────────────────────────────────────────────
const POSTS_DIR      = path.join(process.cwd(), 'src/content/posts');
const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');

// 항목 사이 쿨다운 (초) — API Rate Limit 방지
const COOLDOWN_SEC = 10;

// ── 유틸리티 ────────────────────────────────────────────────────────────────

/**
 * 한글 제목을 영문 슬러그로 변환합니다.
 * Gemini에 의존하지 않고 스크립트가 직접 생성합니다.
 * @param {string} title - 한글 제목
 * @param {string} date  - YYYY-MM-DD
 * @param {number} seq   - 동일 날짜 충돌 방지 시퀀스
 */
function makeSlug(title, date, seq) {
  // 한글 → 영문 키워드 매핑 (주요 의정부 정책 키워드)
  const KEYWORD_MAP = {
    '의정부': 'uijeongbu', '버스킹': 'busking', '행복로': 'haengbokro',
    '청년': 'youth', '어르신': 'senior', '노인': 'senior', '장애인': 'disabled',
    '지원': 'support', '교육': 'education', '문화': 'culture', '축제': 'festival',
    '행사': 'event', '혜택': 'benefit', '창업': 'startup', '복지': 'welfare',
    '건강': 'health', '의료': 'medical', '경기': 'gyeonggi', '보육': 'childcare',
    '일자리': 'jobs', '취업': 'employment', '주거': 'housing', '환경': 'environment',
    '안전': 'safety', '교통': 'transport', '스포츠': 'sports', '도서관': 'library',
    '박물관': 'museum', '공원': 'park', '문화재': 'heritage',
  };

  let slug = title;
  for (const [kr, en] of Object.entries(KEYWORD_MAP)) {
    slug = slug.replace(new RegExp(kr, 'g'), `-${en}-`);
  }

  // 남은 한글·특수문자 제거, 하이픈 정리
  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 50);

  if (!slug || slug === '-') slug = `post-${seq}`;

  const seqSuffix = seq > 1 ? `-${seq}` : '';
  return `${date}-${slug}${seqSuffix}`;
}

/**
 * posts 디렉터리에서 이미 발행된 제목 Set을 반환합니다.
 */
function getExistingTitles() {
  const titles = new Set();
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return titles;
  }
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.md')) continue;
    const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
    if (data.title) titles.add(data.title.trim());
  }
  return titles;
}

/**
 * 슬러그 기반 파일명 충돌 시 시퀀스 번호를 부여합니다.
 */
function getUniqueFilePath(slug) {
  let filePath = path.join(POSTS_DIR, `${slug}.md`);
  let seq = 1;
  while (fs.existsSync(filePath)) {
    seq++;
    filePath = path.join(POSTS_DIR, `${slug}-${seq}.md`);
  }
  return filePath;
}

// ── 프롬프트 빌더 ────────────────────────────────────────────────────────────

function buildBlogPrompt(item, today) {
  const sourceLink = item.link && item.link !== '#' ? item.link : 'https://www.ui4u.go.kr';

  return `당신은 "의정부 건강·생활 정보 포털"의 수석 에디터이자 행정/의료 정책 분석가입니다.
주어진 데이터를 바탕으로 구글 검색 엔진 최상위 노출(Top Ranking) 및 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 기준을 완벽하게 충족하는 고밀도의 전문 칼럼을 작성하십시오.

정보: ${JSON.stringify(item, null, 2)}
공식 출처: ${sourceLink}

아래 마크다운 형식으로 출력해 주십시오. 다른 텍스트나 부연 설명은 단 한 글자도 출력하지 마십시오.

---
title: (구글 SEO 클릭률을 극대화하는 명확하고 전문적인 제목 - 예: "[의정부시] 청년 응시료 지원 10만 원, 자격 조건 및 신청 실무 가이드")
date: ${today}
summary: (구글 검색결과 스니펫에 노출될 150자 이내의 전문적인 핵심 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

## 1. 사전 분석 (Chain-of-Thought) — 필수 수행
[ANALYSIS_START]
- 정책/행사 분석 관점 : {이 정보가 시민에게 왜 중요한지 핵심 쟁점 정의}
- 실무 가이드 포인트 : {신청 시 주의점, 서류 등 실무적 관점 도출}
- 목차(H2) 및 분량 설계 :
  * {H2 제목 1} : {분량 계획}
  * {H2 제목 2} : {분량 계획}
[ANALYSIS_END]
위 분석을 바탕으로 1,500자 이상의 고밀도 전문 칼럼을 자율적으로 구성하십시오.

## 2. Heading 및 시각화 규칙
- H1 사용 금지 : 본문에는 절대 H1('# 제목')을 작성하지 마세요.
- H2 필수 : 본문 각 섹션의 대제목은 무조건 H2('##')로 작성하세요.
- 이모지 남발 금지 : 매우 제한적이고 전문적으로만 사용하십시오.
- 볼드(**) 남용 금지 : 문장 중간에 볼드체를 무분별하게 쓰지 마십시오.
- 링크 끝에 화살표(↗) 기호 삽입 금지.

## 3. 본문 작성 코어 모듈 (필수 포함)
1) 공감 및 현황 분석 (도입부) : 시민들이 겪는 현실적 문제에 공감하며 이 제도의 도입 배경과 필요성을 전문적으로 해설합니다.
2) 제도/행사 상세 해설 : 대상자, 지원 내용, 혜택의 실질적 가치를 행정/실무자의 시선에서 객관적이고 깊이 있게 분석합니다.
3) 실무 신청 가이드 (Step-by-step) : 신청 방법, 필요 서류를 순서형 목록(1. 2. 3.)으로 명확히 안내합니다.
4) 전문가의 주의사항 (사각지대) : 예외 조건, 중복 수혜 불가, 탈락 사유 등 핵심 주의사항을 서술합니다.

## 4. FAQ (구글 구조화 데이터 대비)
본문 하단에 반드시 FAQ 추가 (Q는 H3(###) 사용):
## 자주 묻는 질문 (FAQ)
### Q : {질문}
A : {팩트 기반 답변}

## 5. E-E-A-T 및 신뢰성 지침
- "~에 대해 알아보았습니다", "명심하시기 바랍니다" 등 AI 멘트 전면 금지.
- 객관적이고 논리정연한 행정/의료 칼럼니스트의 톤을 일관되게 유지하십시오.
- 글의 마지막에 "본 정보의 공식 출처는 [${sourceLink}](${sourceLink}) 입니다." 문구를 자연스럽게 포함하십시오.`;
}

// ── 메인 실행 ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== 의정부 자동글쓰기 시작 (${new Date().toISOString()}) ===`);

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('오류: GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
  }

  // [1단계] 기존 포스트 제목 수집
  const existingTitles = getExistingTitles();

  // [2단계] local-info.json 로드
  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('local-info.json 파일이 없습니다. 글쓰기를 건너뜁니다.');
    return;
  }

  const localInfo = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
  const allItems  = [...(localInfo.events || []), ...(localInfo.benefits || [])];

  // [3단계] 미발행 항목 필터링
  const pending = allItems.filter(item => item.title && !existingTitles.has(item.title.trim()));

  if (pending.length === 0) {
    console.log('모든 데이터가 이미 포스팅되어 있습니다. 새 글을 작성하지 않습니다.');
    return;
  }

  console.log(`총 ${pending.length}개의 새 데이터가 발견되었습니다. 일괄(Batch) 포스팅을 시작합니다...`);

  const today = new Date().toISOString().split('T')[0];
  let successCount = 0;
  let seq = 1;

  // [4단계] 순차 처리 (항목 간 쿨다운 적용)
  for (const item of pending) {
    console.log(`[작성 중] ${item.title}`);

    let aiText;
    try {
      aiText = await callGemini(geminiKey, buildBlogPrompt(item, today));
    } catch (err) {
      console.error(`  [건너뜀] "${item.title}" — API 오류: ${err.message}`);
      // 한 항목 실패해도 전체 중단하지 않고 다음으로 계속
      continue;
    }

    // ANALYSIS 블록 제거 (독자에게 보이지 않도록)
    const cleanedText = aiText.replace(/\[ANALYSIS_START\][\s\S]*?\[ANALYSIS_END\]/g, '').trim();

    // 슬러그 생성 및 파일 저장
    const slug     = makeSlug(item.title, today, seq);
    const filePath = getUniqueFilePath(slug);
    const fileName = path.basename(filePath);

    fs.writeFileSync(filePath, cleanedText, 'utf8');
    console.log(`[완료] ${fileName} 저장됨.`);

    successCount++;
    seq++;

    // 마지막 항목이 아니면 쿨다운 대기
    if (item !== pending[pending.length - 1]) {
      console.log(`  [대기] ${COOLDOWN_SEC}초 쿨다운...`);
      await sleep(COOLDOWN_SEC * 1000);
    }
  }

  console.log(`=== 자동글쓰기 종료 (성공: ${successCount}/${pending.length}건) ===`);
}

main().catch(err => {
  console.error('치명적 오류:', err.message);
  process.exit(1);
});
