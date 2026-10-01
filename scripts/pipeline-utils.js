/**
 * pipeline-utils.js
 * 자동글쓰기 파이프라인 공통 유틸리티
 * — sleep, .env.local 로드, POSTS_DIR 상수를 이 파일 하나로 통합 관리
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const tls  = require('tls');

// ── TLS 중간 인증서 로드 (ui4u.go.kr 등 중간 체인 누락 사이트 전용) ─────────
const certPath = path.join(process.cwd(), 'scripts', 'certs', 'ui4u-intermediate.pem');
let customDispatcher = null;
if (fs.existsSync(certPath)) {
  try {
    const { Agent } = require('undici');
    const pem = fs.readFileSync(certPath, 'utf8');
    customDispatcher = new Agent({
      connect: {
        ca: [...tls.rootCertificates, pem]
      }
    });
  } catch {}
}

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

// ── 공통 유틸 ────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function safeFetch(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const fetchOpts = { ...options, signal: controller.signal };
    if (customDispatcher && !fetchOpts.dispatcher && (typeof url === 'string' && url.includes('ui4u.go.kr'))) {
      fetchOpts.dispatcher = customDispatcher;
    }
    return await fetch(url, fetchOpts);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Fetch timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

module.exports = { POSTS_DIR, sleep, safeFetch };

