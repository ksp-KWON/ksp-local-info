/**
 * scripts/generate-blog-post.js
 * ?섏젙遺 嫄닿컯쨌?앺솢 ?뺣낫 ?ы꽭 [?섏씠釉뚮━???먮룞 ?ъ뒪???ㅽ넗 ?뚯씪???붿쭊]
 * 
 * ?뚮쾿 以??(.agents/AGENTS.md)
 * Tier 1: ?뺣?24 怨듦났?곗씠???ы꽭 API (?좉퇋 蹂듭?쨌吏?먭툑 怨듦퀬 理쒖슦???묒꽦)
 * Tier 2: ?ㅼ떆媛??섏젙遺 ?댁뒪 Google RSS ?뚰꽣 (?ㅼ떆媛??섏젙遺 ?쒖젙/?됱궗/異뺤젣/吏?먭툑 ?댁뒪 ?ъ링 諛쒓뎬)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { XMLParser } = require('fast-xml-parser');
const { callGemini } = require('./gemini-helper');
const { POSTS_DIR, sleep, safeFetch } = require('./pipeline-utils');
const { generateSourceId, getExistingSourceIds, saveMarkdownPost, makeSlug, getKSTDateString } = require('./post-utils');
const {
  STRICT_RULES,
  PLAN_SCHEMA,
  CONTENT_SCHEMA,
  getRandomAngle,
  buildPlanPrompt,
  buildContentPrompt
} = require('./prompt-builder');

const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });
const LOCAL_INFO_PATH = path.join(process.cwd(), 'public/data/local-info.json');

// [怨듯넻] 湲곗〈 諛쒗뻾???쒕ぉ 紐⑸줉 ?섏쭛
function getExistingTitles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      return String(matter(content).data.title || '');
    } catch { return ''; }
  }).filter(Boolean);
}

// ??? [Tier 1] 怨듦났?곗씠??local-info.json) 湲곕컲 ?ъ뒪???????????????????????
async function runTier1() {
  console.log('\n[Tier 1] ?뺣?24 怨듦났?곗씠??誘몃컻????ぉ 寃??以?..');
  if (!fs.existsSync(LOCAL_INFO_PATH)) {
    console.log('  -> local-info.json ?뚯씪???놁뒿?덈떎.');
    return null;
  }

  const existingSourceIds = getExistingSourceIds();
  const localInfo = JSON.parse(fs.readFileSync(LOCAL_INFO_PATH, 'utf8'));
  const allItems = [...(localInfo.events || []), ...(localInfo.benefits || [])];

  const pending = allItems.filter(item => {
    if (!item.title) return false;
    const sourceId = generateSourceId(item.title);
    return !existingSourceIds.has(sourceId);
  });

  if (pending.length === 0) {
    console.log('  -> 怨듦났?곗씠?곗뿉 誘몃컻?됰맂 ?좉퇋 怨듦퀬媛 ?놁뒿?덈떎.');
    return null;
  }

  const targetItem = pending[0];
  const sourceId = generateSourceId(targetItem.title);
  console.log(`  -> Tier 1 ?寃??좎젙: "${targetItem.title}" (Source ID: ${sourceId})`);

  const angle = getRandomAngle();
  const plan = await callGemini(buildPlanPrompt(targetItem), PLAN_SCHEMA);
  await sleep(2000);
  const content = await callGemini(buildContentPrompt(targetItem, plan, angle), CONTENT_SCHEMA);

  const today = getKSTDateString();
  const slug = makeSlug(plan.frontmatter.title || targetItem.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: getKSTDateString() + 'T09:00:00+09:00',
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceId: sourceId,
    sourceLink: targetItem.link || 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ??? [Tier 2] ?ㅼ떆媛?Google News RSS ?뚰꽣 (?ㅺ컖???먯깋 媛뺥솕) ??????????????
async function fetchNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const response = await safeFetch(url);
    const xml = await response.text();
    const result = xmlParser.parse(xml);
    const rawItems = result?.rss?.channel?.item;
    if (!rawItems) return [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    return items.map(item => ({
      title: String(item.title || '').replace(/<[^>]+>/g, '').trim(),
      link: String(item.link || '').trim(),
      pubDate: String(item.pubDate || '').trim(),
    })).filter(item => item.title && item.title.length > 5);
  } catch (error) {
    console.error(`  -> RSS Fetch ?먮윭 (${query}): ${error.message}`);
    return [];
  }
}

async function runTier2() {
  console.log('\n[Tier 2] ?ㅼ떆媛??섏젙遺 ?댁뒪 Google RSS ?뚰꽣 媛??以?..');
  const existingTitles = getExistingTitles();

  // 1. AI?먭쾶 理쒖쟻 寃?됱뼱 ?앹꽦 ?붿껌
  const queryPrompt = `?뱀떊? ?섏젙遺?쒖쓽 理쒖떊 ?뚯떇??諛쒓뎬?섎뒗 濡쒖뺄 ?섏꽍 ?먮뵒?곗엯?덈떎.
湲곗〈???묒꽦??湲 ?쒕ぉ 紐⑸줉:
${existingTitles.slice(-25).join('\n')}

湲곗〈 湲?ㅺ낵 寃뱀튂吏 ?딅뒗, ?섏젙遺?쒖쓽 理쒖떊 ?쒗깮, 異뺤젣/?됱궗, 吏?먭툑, ?쇱옄由? 臾명솕, 蹂듭?, 援먰넻 愿??援ш? ?댁뒪 寃?됱뼱 1媛쒕? ?앹꽦?섏꽭?? (?? "?섏젙遺 泥?뀈 ?쒗깮", "?섏젙遺 異뺤젣 怨듭뿰", "?섏젙遺?щ옉移대뱶 ?쒗깮", "?섏젙遺 ?쇱옄由?諛뺣엺??)`;

  const querySchema = {
    type: 'OBJECT',
    properties: {
      query: { type: 'STRING', description: '援ш? ?댁뒪 寃?됱뼱 (?섏젙遺 ?ы븿)' }
    },
    required: ['query']
  };

  let searchQueries = [];
  try {
    const { query } = await callGemini(queryPrompt, querySchema);
    if (query) searchQueries.push(query.includes('?섏젙遺') ? query : `?섏젙遺 ${query}`);
  } catch (e) {
    console.error(`  -> AI 寃?됱뼱 ?앹꽦 ?ㅽ뙣: ${e.message}`);
  }

  // 2. ?ㅺ컖??諛깆뾽 荑쇰━ ? (Fallback Queries)
  const FALLBACK_QUERIES = [
    '?섏젙遺??吏?먭툑',
    '?섏젙遺 異뺤젣 臾명솕 ?됱궗',
    '?섏젙遺 泥?뀈 蹂듭?',
    '?섏젙遺?щ옉移대뱶 ?쒗깮',
    '?섏젙遺 援먰넻 ?쇱옄由?,
    '?섏젙遺 ?앺솢 誘쇱썝 ?쒗깮'
  ];
  for (const fq of FALLBACK_QUERIES) {
    if (!searchQueries.includes(fq)) searchQueries.push(fq);
  }

  // 3. ?쒖감 寃?됱쑝濡?理쒖쟻??湲곗궗 諛쒓뎬
  let candidate = null;
  for (const q of searchQueries) {
    console.log(`  -> RSS ?먯깋 荑쇰━: "${q}"`);
    const newsItems = await fetchNews(q);
    if (newsItems.length === 0) continue;

    // 湲곗〈 湲?ㅺ낵 ?쒕ぉ??寃뱀튂吏 ?딅뒗 ?좎꽑??湲곗궗 李얘린
    const freshItem = newsItems.find(item => {
      const cleanT = item.title.slice(0, 15);
      return !existingTitles.some(title => title.includes(cleanT));
    });

    if (freshItem) {
      candidate = freshItem;
      console.log(`  -> 理쒖쟻???좉퇋 ?댁뒪 諛쒓뎬: "${candidate.title}"`);
      break;
    }
  }

  if (!candidate) {
    console.log('  -> 愿???좉퇋 ?댁뒪瑜?李얠? 紐삵뻽?듬땲??');
    return null;
  }

  console.log(`  -> ?ъ뒪???묒꽦 ???湲곗궗: "${candidate.title}" (${candidate.pubDate})`);

  const planPrompt = `?뱀떊? ?섏젙遺 嫄닿컯쨌?앺솢 ?뺣낫 ?ы꽭???섏꽍 ?먮뵒?곗엯?덈떎.
?꾨옒 ?ㅼ떆媛??댁뒪 湲곗궗瑜?諛뷀깢?쇰줈 ?섏젙遺 ?쒕??ㅼ뿉寃??ㅼ쭏?곸씤 ?꾩????섎뒗 怨좏뭹吏?釉붾줈洹?湲고쉷??JSON)???묒꽦?섏꽭??

[湲곗궗 ?뺣낫]
?쒕ぉ: ${candidate.title}
留곹겕: ${candidate.link}
諛쒗뻾?? ${candidate.pubDate}

[?묒꽦 ?붽뎄?ы빆]
- ?섏젙遺 ?쒕????ㅼ깮???쒗깮, 李몄뿬 諛⑸쾿, ?좎껌 ?덉감瑜?以묒떖?쇰줈 湲고쉷?덉쓣 ?묒꽦?섏꽭??
- 援ш? 寃??理쒖쟻??SEO)瑜?怨좊젮???좊ː???믪? ?쒕ぉ怨?150???대궡??紐낆풄???붿빟臾몄쓣 留뚮뱶?몄슂.`;

  const plan = await callGemini(planPrompt, PLAN_SCHEMA);
  await sleep(2000);

  const angle = getRandomAngle();
  const contentPrompt = `?뱀떊? ?섏젙遺 ?쒕? ?ы꽭???섏꽍 怨듦났 ?먮뵒?곗엯?덈떎.
?꾨옒 湲고쉷?덉쓣 諛뷀깢?쇰줈 ?뚮쾿??100% 以?섑븯???덇꺽 ?덈뒗 留덊겕?ㅼ슫 蹂몃Ц???묒꽦?섏꽭??

[湲고쉷??
- ?쒕ぉ: ${plan.frontmatter.title}
- 移댄뀒怨좊━: ${plan.frontmatter.category}
- ?붿빟: ${plan.frontmatter.summary}

# ?룢截??섏젙遺 ?ы꽭 怨듯넻 湲?곌린 ?뚮쾿 洹쒖튃 (STRICT WRITING RULES)
${STRICT_RULES}

[?ㅻ뒛??湲?곌린 愿??
- 愿??Angle): [${angle.name}] ${angle.instruction}

??湲고쉷?덇낵 ?뚮쾿 洹쒖튃???꾨꼍??諛섏쁺?섏뿬 蹂몃Ц(markdownContent)留?JSON?쇰줈 諛섑솚?섏꽭??`;

  const content = await callGemini(contentPrompt, CONTENT_SCHEMA);

  const today = getKSTDateString();
  const slug = makeSlug(plan.frontmatter.title || candidate.title);
  const fileName = `${today}-${slug}.md`;

  saveMarkdownPost(fileName, {
    title: plan.frontmatter.title,
    date: getKSTDateString() + 'T09:00:00+09:00',
    summary: plan.frontmatter.summary,
    category: plan.frontmatter.category,
    tags: plan.frontmatter.tags,
    sourceLink: candidate.link || 'https://www.ui4u.go.kr'
  }, content.markdownContent);

  return fileName;
}

// ??? [硫붿씤 ?ㅽ뻾 ?붿쭊] ??????????????????????????????????????????????????
async function main() {
  console.log('======================================================');
  console.log('?룢截?[?섏젙遺 ?ы꽭] 2-Tier ?섏씠釉뚮━???ㅽ넗 ?뚯씪???붿쭊 ?쒖옉');
  console.log('?ㅽ뻾 ?쒓컖:', new Date().toISOString());
  console.log('======================================================');

  try {
    // 1?④퀎: ?뺣?24 怨듦났?곗씠???곗꽑
    const tier1Result = await runTier1();
    if (tier1Result) {
      console.log(`\n?럦 [Tier 1 ?깃났] ?좉퇋 怨듦났?곗씠???ъ뒪???꾨즺: ${tier1Result}`);
      return;
    }

    // 2?④퀎: ?ㅼ떆媛??섏젙遺 ?댁뒪 Google RSS ?뚰꽣
    const tier2Result = await runTier2();
    if (tier2Result) {
      console.log(`\n?럦 [Tier 2 ?깃났] ?ㅼ떆媛??댁뒪 RSS ?ъ뒪???꾨즺: ${tier2Result}`);
      return;
    }

    console.log('\n?좑툘 [?뚮┝] 湲덉씪 諛쒗뻾?????덈뒗 ?덈줈????ぉ???놁뒿?덈떎.');
  } catch (error) {
    console.error('\n?뮙 [移섎챸???ㅻ쪟] ?ㅽ넗 ?뚯씪???붿쭊 ?ㅽ뻾 ?ㅽ뙣:', error.message);
    process.exit(1);
  }
}

main();

