'use strict';

/**
 * scripts/extract-latest-post.js
 * 배포 완료 시 최신 포스팅 메타데이터(제목, 슬러그)를 추출하여 GITHUB_ENV에 주입하는 표준 유틸리티
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'src/content/posts');
if (!fs.existsSync(postsDir)) {
  process.exit(0);
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort().reverse();
if (files.length === 0) {
  process.exit(0);
}

const latestFile = files[0];
const filePath = path.join(postsDir, latestFile);
const parsed = matter(fs.readFileSync(filePath, 'utf8'));
const title = parsed.data?.title || '의정부 시정 안내';
const slug = latestFile.replace(/\.md$/, '');

if (process.env.GITHUB_ENV) {
  fs.appendFileSync(process.env.GITHUB_ENV, `POST_TITLE=${title}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV, `POST_SLUG=${slug}\n`);
}

console.log(`Latest Post Extracted: [${title}] (Slug: ${slug})`);
