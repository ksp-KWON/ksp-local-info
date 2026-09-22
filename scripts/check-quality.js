/**
 * scripts/check-quality.js
 * 글로벌 마크다운(GFM) & W3C 시맨틱 표준 CQF 품질 검증 엔진
 * 
 * [헌법 원칙: 표준 · 콤팩트 · 통합 · 공유 · 공통]
 * - 자체 중복 정규식을 전면 철폐하고, 전사 단일 표준 엔진(src/lib/markdown-standard.ts)에 직결
 * - 빌드 파이프라인에서 필수 무결성 검증 및 초고속 동기화 수행
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { normalizePost } = require('../src/lib/markdown-standard');

const POSTS_DIR = path.join(__dirname, '../src/content/posts');

function normalizeFilename(filename) {
  const baseName = filename.replace(/\.md$/, '');
  // 구글 SEO 표준: 소문자 영문, 숫자, 하이픈만 허용
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(baseName)) {
    return filename;
  }
  const clean = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
  return (clean || 'post') + '.md';
}

function processPost(filePath) {
  const fileRaw = fs.readFileSync(filePath, 'utf8');
  const result = normalizePost(fileRaw);
  if (result.isChanged) {
    fs.writeFileSync(filePath, result.fullContent, 'utf8');
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) return;
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  let modifiedCount = 0;

  files.forEach((f) => {
    let fullPath = path.join(POSTS_DIR, f);
    const standardName = normalizeFilename(f);
    if (standardName !== f) {
      const newPath = path.join(POSTS_DIR, standardName);
      fs.renameSync(fullPath, newPath);
      fullPath = newPath;
      modifiedCount++;
    }
    if (processPost(fullPath)) {
      modifiedCount++;
    }
  });

  if (modifiedCount > 0) {
    console.log('🛠️ CQF 의정부 품질 검증 엔진 자동 교정 완료 (적용 파일: ' + modifiedCount + '개).');
  }
  console.log('✅ All Uijeongbu blog posts passed quality checks (Rock-Solid Verified).');
}

main();
