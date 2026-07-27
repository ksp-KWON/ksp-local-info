'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

/**
 * Generate a unique hash (sourceId) for a given text (usually the original title).
 * This acts as an immutable identifier to prevent duplicate posts.
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
    } catch (e) {
      // Ignore parsing errors for individual files
    }
  }
  return sourceIds;
}

/**
 * Safely generate a slug based on title and date.
 */
function makeSlug(title, date, seq = 1) {
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

  let slug = title || '';
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

  if (!slug || slug === '-') slug = `post`;

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
 */
function saveMarkdownPost(frontmatter, content) {
  // Use gray-matter to stringify
  const fileContent = matter.stringify(content || '', frontmatter);
  
  const baseSlug = frontmatter.slug || 'post';
  const { filePath, slug: finalSlug } = getUniqueFilePath(baseSlug);
  
  // Re-serialize in case slug changed (though usually slug in frontmatter matches filename)
  if (finalSlug !== baseSlug) {
      frontmatter.slug = finalSlug;
      const updatedContent = matter.stringify(content || '', frontmatter);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
  } else {
      fs.writeFileSync(filePath, fileContent, 'utf8');
  }

  return { filePath, slug: finalSlug };
}

module.exports = {
  generateSourceId,
  getExistingSourceIds,
  makeSlug,
  saveMarkdownPost
};
