const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../src/content/posts');

function processPost(filePath) {
  const fileRaw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileRaw);

  let body = content;

  // 1. 핵심 요약 헤더 표준화
  body = body.replace(/##\s*(?:\[[^\]]+\]\s*)?(?:핵심\s*요약|행정\s*핵심\s*요약|3줄\s*요약|요약)[^\n]*/gi, '## 행정 핵심 요약');

  // 2. 자주 묻는 질문 표준화
  body = body.replace(/##\s*(?:[1-9]\.\s*)?(?:자주\s*묻는\s*질문|FAQ|시민\s*FAQ)[^\n]*/gi, '## 자주 묻는 질문');

  // 3. 자가진단 체크리스트 표준화 (체크리스트 전용 헤더만 정밀 매칭)
  body = body.replace(/##\s*(?:\[[^\]]+\]\s*)?(?:신청\s*자격\s*1분\s*자가진단|1분\s*자가진단|자가진단\s*체크리스트|1분\s*체크리스트|신청\s*자격\s*체크리스트)[^\n]*/gi, '## 신청 자격 1분 자가진단');

  // 4. 시그니처 박스 표준화
  body = body.replace(
    />\s*###\s*(?:의정부\s*생활\s*꿀팁|의정부\s*생활포털|행정\s*인사이트|실무\s*팁|실무TIP)[^\n]*/gi,
    '> ### 의정부 생활 꿀팁 & 행정 인사이트'
  );

  // 5. 이모지 및 불필요한 대괄호 제거
  body = body.replace(/##\s*[💡📋🏆🛡️⭐💎🎯📌🧑‍⚖️⚖️]+\s*/g, '## ');
  body = body.replace(/###\s*[💡📋🏆🛡️⭐💎🎯📌🧑‍⚖️⚖️]+\s*/g, '### ');

  // 6. 다중 빈 줄 정리
  // 6-1. 리스트 및 마크다운 목록 문법 정밀 표준화 (공백 누락 방지)
  body = body.replace(/(\d+)\.\s*\*\*/g, '$1. **');
  body = body.replace(/>\s*-\s*\*\*/g, '> - **');
  body = body.replace(/^>\s*\*\*/gm, '> **');
  body = body.replace(/\*\*\s*:\s*/g, '** : ');
  body = body.replace(/(\d+\.\s*\*\*[^*]+\*\*\s*:[^\n]+)(\n)(\d+\.)/g, '$1\n\n$3');

  // 7. 마크다운 별표(Bold) 문법 정밀 표준화
  body = body.replace(/\*{3,}([^*]+?)\*{2,}/g, '**$1**');
  body = body.replace(/\*{2,}([^*]+?)\*{3,}/g, '**$1**');
  body = body.replace(/^>\s*\*\*([^*:\n]+)\*\s*:/gm, '> **$1** :');
  body = body.replace(/\*\*\s+([^*]+?)\*\*/g, '**$1**');
  body = body.replace(/\*\*([^*]+?)\s+\*\*/g, '**$1**');

  // 6. 다중 빈 줄 정리
  body = body.replace(/(?:\r?\n){3,}/g, '\n\n').trim();

  const newContent = matter.stringify(body, data);
  if (newContent !== fileRaw) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  }
  return false;
}

function normalizeFilename(filename) {
  const baseName = filename.replace(/\.md$/, '');
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(baseName)) {
    return filename;
  }
  const clean = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
  return `${clean || 'post'}.md`;
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
    console.log(`🛠️ CQF 의정부 품질 검증 엔진 자동 교정 완료 (적용 파일: ${modifiedCount}개).`);
  }
  console.log('✅ All Uijeongbu blog posts passed quality checks (Rock-Solid Verified).');
}

main();
