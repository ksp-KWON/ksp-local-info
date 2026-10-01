/**
 * pipeline-utils.js
 * 자동글쓰기 파이프라인 공통 유틸리티
 * — sleep, .env.local 로드, POSTS_DIR 상수를 이 파일 하나로 통합 관리
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── .env.local 로드 (파이프라인 전역 1회만 실행) ─────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? '').replace(/(^['"]|['"]$)/g, '').trim();
    }
  });
}

// ── 공통 상수 ────────────────────────────────────────────────────────────────
const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const MIN_SOURCE_CHARS = 100;

// ── 공통 원천 분량 판정 유틸 ────────────────────────────────────────────────
function getCleanSourceText(item) {
  if (!item) return '';
  if (typeof item === 'string') return item.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  const raw = item.intro || item.description || item.content || [
    item.summary,
    item.target,
    item.location,
    item.서비스목적요약,
    item.지원내용,
    item.지원대상,
    item.선정기준
  ].filter(Boolean).join(' ');
  return String(raw).replace(/<[^>]+>/g, '').replace(/\s+/g, '');
}

function isSourceSufficient(item) {
  return getCleanSourceText(item).length >= MIN_SOURCE_CHARS;
}

// ── 공통 유틸 ────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function safeFetch(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Fetch timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

module.exports = {
  POSTS_DIR,
  MIN_SOURCE_CHARS,
  getCleanSourceText,
  isSourceSufficient,
  sleep,
  safeFetch
};

