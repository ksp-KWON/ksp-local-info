'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

/**
 * Generate a unique hash (sourceId) for a given text.
 */
function generateSourceId(text) {
  return crypto.createHash('md5').update(text || '').digest('hex').slice(0, 12);
}

/**
 * Returns a Set of sourceIds from all existing markdown posts.
 */
function getExistingSourceIds() {
  const sourceIds = new Set();
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return sourceIds;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    try {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(content);
      if (parsed.data.sourceId) {
        sourceIds.add(parsed.data.sourceId);
      }
    } catch {
      // Ignore parsing errors
    }
  }
  return sourceIds;
}

/**
 * Safely generate a slug based on title and date.
 */
function makeSlug(title, date, seq = 1) {
  const KEYWORD_MAP = {
    '?섏젙遺': 'uijeongbu', '踰꾩뒪??: 'busking', '?됰났濡?: 'haengbokro',
    '泥?뀈': 'youth', '?대Ⅴ??: 'senior', '?몄씤': 'senior', '?μ븷??: 'disabled',
    '吏??: 'support', '援먯쑁': 'education', '臾명솕': 'culture', '異뺤젣': 'festival',
    '?됱궗': 'event', '?쒗깮': 'benefit', '李쎌뾽': 'startup', '蹂듭?': 'welfare',
    '嫄닿컯': 'health', '?섎즺': 'medical', '寃쎄린': 'gyeonggi', '蹂댁쑁': 'childcare',
    '?쇱옄由?: 'jobs', '痍⑥뾽': 'employment', '二쇨굅': 'housing', '?섍꼍': 'environment',
    '?덉쟾': 'safety', '援먰넻': 'transport', '?ㅽ룷痢?: 'sports', '?꾩꽌愿': 'library',
    '諛뺣Ъ愿': 'museum', '怨듭썝': 'park', '?뚯븙洹?: 'music-theatre', '?λ젮湲?: 'grant',
  };

  let slug = String(title || '');
  for (const [kr, en] of Object.entries(KEYWORD_MAP)) {
    slug = slug.replace(new RegExp(kr, 'g'), `-${en}-`);
  }

  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 50);

  if (!slug || slug === '-') slug = 'post';

  const datePrefix = date ? `${date}-` : '';
  const seqSuffix = seq > 1 ? `-${seq}` : '';
  return `${datePrefix}${slug}${seqSuffix}`;
}

/**
 * Ensure the file path is unique.
 */
function getUniqueFilePath(baseSlug) {
  let filePath = path.join(POSTS_DIR, `${baseSlug}.md`);
  let seq = 1;
  let currentSlug = baseSlug;
  
  while (fs.existsSync(filePath)) {
    seq++;
    currentSlug = `${baseSlug}-${seq}`;
    filePath = path.join(POSTS_DIR, `${currentSlug}.md`);
  }
  return { filePath, slug: currentSlug };
}

/**
 * Save post using gray-matter for strict YAML serialization.
 * Supports both saveMarkdownPost(fileName, frontmatter, content) and saveMarkdownPost(frontmatter, content)
 */
function saveMarkdownPost(arg1, arg2, arg3) {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  let fileName = '';
  let frontmatter = {};
  let content = '';

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    fileName = arg1;
    frontmatter = arg2 || {};
    content = typeof arg3 === 'string' ? arg3 : '';
  } else if (typeof arg1 === 'object') {
    frontmatter = arg1 || {};
    content = typeof arg2 === 'string' ? arg2 : '';
  }

  let filePath;
  let finalSlug;

  if (fileName) {
    const cleanFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    filePath = path.join(POSTS_DIR, cleanFileName);
    finalSlug = path.basename(filePath, '.md');
  } else {
    const baseSlug = frontmatter.slug || makeSlug(frontmatter.title || 'post');
    const unique = getUniqueFilePath(baseSlug);
    filePath = unique.filePath;
    finalSlug = unique.slug;
  }

  const fileContent = matter.stringify(content || '', frontmatter);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`  [????꾨즺] ${filePath}`);

  return { filePath, slug: finalSlug };
}


/**
 * 정확한 한국 표준시(KST, UTC+9) 날짜 문자열 생성기 (전 세계 서버 완벽 호환)
 * GitHub Actions Ubuntu 러너의 UTC 환경에서도 항상 KST 기준 날짜 반환
 */
function getKSTDateString(date) {
  date = date || new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // 'YYYY-MM-DD' 형식
}

module.exports = {
  POSTS_DIR,
  generateSourceId,
  getExistingSourceIds,
  makeSlug,
  saveMarkdownPost
};

