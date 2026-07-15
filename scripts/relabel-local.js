const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../src/content/posts');

function getCategoriesByKeywords(content) {
  const text = content.toLowerCase();
  const categories = new Set();

  if (text.match(/응시료|취업|일자리|창업|면접|구직/)) {
    categories.add('일자리·창업');
    categories.add('복지·지원금');
  }
  if (text.match(/버스킹|콘서트|오페라|극단|행사|축제|공연|전시/)) {
    categories.add('문화·행사');
  }
  if (text.match(/출산|육아|보육|어린이|교육|유아/)) {
    categories.add('교육·육아');
    categories.add('복지·지원금');
  }
  if (text.match(/긴급|복지|지원금|수당|장려금|지원/)) {
    categories.add('복지·지원금');
  }
  if (text.match(/병원|건강|검진|의료|돌봄|치료|진료/)) {
    categories.add('건강·의료');
  }
  if (text.match(/주택|월세|전세|부동산|주거/)) {
    categories.add('주거·부동산');
  }
  if (text.match(/교통|버스|지하철|환경|에코/)) {
    categories.add('교통·환경');
  }
  if (text.match(/민원|카드|지역화폐|사랑카드|생활/)) {
    categories.add('생활·민원');
  }

  // 매칭되는게 없으면 기본값
  if (categories.size === 0) {
    categories.add('생활·민원');
  }

  // Set to Array, limit to 2
  return Array.from(categories).slice(0, 2);
}

function processFiles() {
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 프론트매터 파싱을 위해 --- 와 --- 사이 추출 (CRLF 지원)
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) continue;

    const frontmatter = frontmatterMatch[1];
    
    // 기존 카테고리가 이미 배열 형식이면 (최신에 작성된 것) 스킵
    if (frontmatter.includes('category: [')) {
      continue;
    }

    // 제목과 요약으로 키워드 판단
    const titleMatch = frontmatter.match(/title:\s*(.*)/);
    const summaryMatch = frontmatter.match(/summary:\s*(.*)/);
    const title = titleMatch ? titleMatch[1] : '';
    const summary = summaryMatch ? summaryMatch[1] : '';

    const newCategories = getCategoriesByKeywords(title + ' ' + summary);
    const categoryString = `[${newCategories.join(', ')}]`;

    // category: 정보 -> category: [카테고리1, 카테고리2] 로 변경
    let newFrontmatter = frontmatter;
    if (newFrontmatter.includes('category:')) {
      newFrontmatter = newFrontmatter.replace(/category:\s*.*/, `category: ${categoryString}`);
    } else {
      newFrontmatter += `\ncategory: ${categoryString}`;
    }

    const newContent = content.replace(frontmatterMatch[0], `---\n${newFrontmatter}\n---`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    updatedCount++;
    console.log(`[업데이트] ${file} -> ${categoryString}`);
  }

  console.log(`\n총 ${updatedCount}개의 파일이 재분류되었습니다.`);
}

processFiles();
