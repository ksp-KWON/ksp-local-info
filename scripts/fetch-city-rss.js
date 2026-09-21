/**
 * scripts/fetch-city-rss.js
 * 의정부시청 공식 RSS 5종 공통 통합 수집 엔진
 * 
 * 헌법 제3조 3.1항 [표준 · 범용 · 콤팩트 · 통합 · 공유 · 공통] 준수
 * 외부 의존성 없이 Node.js 표준 fetch와 정규식으로 5개 피드 일괄 파싱 및 중복 필터링
 */

'use strict';

// 공공기관(GPKI) 사설 인증서 체인 오류 방지 (Node.js 내장 trust store 보완)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');
const path = require('path');
const { generateSourceId, getExistingSourceIds } = require('./post-utils');
const { safeFetch, sleep } = require('./pipeline-utils');

const CITY_RSS_FILE = path.join(process.cwd(), 'public/data/city-rss.json');

// ── 의정부시청 공식 RSS 5종 엔드포인트 및 직관형 카테고리 매핑 설정 ──
const RSS_CONFIGS = [
  {
    id: 'notice',
    name: '시정소식',
    category: '복지·지원금',
    url: 'http://www.ui4u.go.kr/portal/rssservice/RssServiceDetail.do?rssId=10000000000000000001',
  },
  {
    id: 'events',
    name: '행사안내',
    category: '축제·나들이',
    url: 'http://www.ui4u.go.kr/portal/rssservice/RssServiceDetail.do?rssId=10000000000000000004',
  },
  {
    id: 'press',
    name: '보도자료',
    category: '생활·민원',
    url: 'http://www.ui4u.go.kr/portal/rssservice/RssServiceDetail.do?rssId=10000000000000000003',
  },
  {
    id: 'news',
    name: '지역뉴스',
    category: '생활·민원',
    url: 'http://www.ui4u.go.kr/portal/rssservice/RssServiceDetail.do?rssId=10000000000000000005',
  },
  {
    id: 'bids',
    name: '입찰정보',
    category: '일자리·소상공인',
    url: 'http://www.ui4u.go.kr/portal/rssservice/RssServiceDetail.do?rssId=10000000000000000002',
  },
];

/**
 * 기한 만료 및 과거 연도 정보 자동 배제 필터 (2026년 기준)
 */
function isItemExpired(title, description) {
  const fullText = title + ' ' + (description || '');

  // 1) 2025년 이전 과거 연도 단독 포함 시 배제
  const oldYearMatch = fullText.match(/\b(201[0-9]|202[0-5])\b/);
  if (oldYearMatch && !fullText.includes('2026')) {
    return true;
  }

  // 2) KST 오늘 자정 기준 만료일 검사
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayThreshold = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 0, 0, 0));

  const regex = /(?:20)?(2[0-9])\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/g;
  const dates = [];
  let m;
  while ((m = regex.exec(fullText)) !== null) {
    const year = 2000 + parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const day = parseInt(m[3], 10);
    dates.push(new Date(Date.UTC(year, month, day, 23, 59, 59)));
  }

  if (dates.length > 0) {
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    if (maxDate < todayThreshold) {
      return true; // 기한 만료
    }
  }

  return false;
}

/**
 * 초경량 XML 아이템 파서 (기한 만료 자동 배제)
 */
function parseRssXml(xmlText, defaultCategory, feedName) {
  const items = [];
  const itemMatches = [...xmlText.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  for (const match of itemMatches) {
    const itemBlock = match[1];

    const titleMatch = itemBlock.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemBlock.match(/<title>(.*?)<\/title>/i);
    const linkMatch = itemBlock.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/i) || itemBlock.match(/<link>(.*?)<\/link>/i);
    const descMatch = itemBlock.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemBlock.match(/<description>([\s\S]*?)<\/description>/i);
    const dateMatch = itemBlock.match(/<pubDate><!\[CDATA\[(.*?)\]\]><\/pubDate>/i) || itemBlock.match(/<pubDate>(.*?)<\/pubDate>/i);

    const title = titleMatch ? titleMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    let description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const pubDate = dateMatch ? dateMatch[1].trim() : '';

    if (!title || title === feedName || title.includes('RSS서비스')) {
      continue;
    }

    // ── 기한 만료 및 과거 정보 자동 배제 ──
    if (isItemExpired(title, description)) {
      continue;
    }

    // 카테고리 스마트 세분화 (키워드 기반 교차 보정)
    let finalCategory = defaultCategory;
    if (title.includes('병원') || title.includes('약국') || title.includes('의료') || title.includes('검진') || title.includes('보건')) {
      finalCategory = '병원·약국';
    } else if (title.includes('축제') || title.includes('공연') || title.includes('행사') || title.includes('페스타') || title.includes('문화')) {
      finalCategory = '축제·나들이';
    } else if (title.includes('지원금') || title.includes('복지') || title.includes('수당') || title.includes('바우처') || title.includes('감면') || title.includes('장학')) {
      finalCategory = '복지·지원금';
    } else if (title.includes('일자리') || title.includes('채용') || title.includes('취업') || title.includes('소상공인') || title.includes('창업')) {
      finalCategory = '일자리·소상공인';
    }

    items.push({
      title,
      link,
      description,
      pubDate,
      category: finalCategory,
      feedName,
      sourceId: generateSourceId(title),
    });
  }

  return items;
}

async function main() {
  console.log('======================================================');
  console.log('📡 [의정부 포털] 시청 공식 RSS 5종 통합 수집 파이프라인');
  console.log('실행 시각:', new Date().toISOString());
  console.log('======================================================\n');

  const existingSourceIds = getExistingSourceIds();
  console.log(`기발행 게시글 Source ID: ${existingSourceIds.size}개 확인됨.`);

  // 기존 city-rss.json이 있으면 로드
  let existingRssQueue = [];
  if (fs.existsSync(CITY_RSS_FILE)) {
    try {
      existingRssQueue = JSON.parse(fs.readFileSync(CITY_RSS_FILE, 'utf8'));
    } catch {
      existingRssQueue = [];
    }
  }

  const seenSourceIds = new Set(existingSourceIds);
  existingRssQueue.forEach(item => seenSourceIds.add(item.sourceId));

  const allCollectedItems = [];
  let newCollectedCount = 0;

  for (const config of RSS_CONFIGS) {
    try {
      console.log(`\n[수집 중] ${config.name} RSS (${config.category}) -> ${config.url}`);
      const res = await safeFetch(config.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*;q=0.8',
        }
      }, 10000);
      if (!res.ok) {
        console.warn(`  ⚠️ HTTP 오류: ${res.status}`);
        continue;
      }

      const xmlText = await res.text();
      const parsedItems = parseRssXml(xmlText, config.category, config.name);
      console.log(`  -> 원본 ${parsedItems.length}개 아이템 파싱 완료.`);

      for (const item of parsedItems) {
        if (!seenSourceIds.has(item.sourceId)) {
          seenSourceIds.add(item.sourceId);
          allCollectedItems.push(item);
          newCollectedCount++;
        }
      }
    } catch (err) {
      console.error(`  ❌ ${config.name} 수집 실패:`, err.message);
    }
    await sleep(500);
  }

  // 큐 병합 및 만료 데이터 전면 정화 (신규 수집 항목 + 기존 미발행 항목 중 유효한 것만 유지)
  const mergedQueue = [...allCollectedItems, ...existingRssQueue];
  const finalQueue = [];
  const recordedIds = new Set(existingSourceIds);

  for (const item of mergedQueue) {
    if (!item || !item.sourceId || recordedIds.has(item.sourceId)) continue;
    if (isItemExpired(item.title, item.description)) continue;
    recordedIds.add(item.sourceId);
    finalQueue.push(item);
  }

  // 저장 디렉토리 보장 및 저장
  const dir = path.dirname(CITY_RSS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(CITY_RSS_FILE, JSON.stringify(finalQueue, null, 2), 'utf8');

  console.log('\n======================================================');
  console.log(`✅ [수집 완료] 신규 아이템: ${newCollectedCount}개`);
  console.log(`📦 [발행 대기 큐 총량 (만료 항목 전면 배제)]: ${finalQueue.length}개 (파일: public/data/city-rss.json)`);
  console.log('======================================================');
}

if (require.main === module) {
  main().catch(err => {
    console.error('치명적 에러:', err);
    process.exit(1);
  });
}

module.exports = {
  RSS_CONFIGS,
  parseRssXml,
};
