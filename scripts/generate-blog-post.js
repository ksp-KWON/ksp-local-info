/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ── 환경변수 로드 (.env.local) ──────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? '').replace(/(^['"]|['"]$)/g, '').trim();
    }
  });
}

async function main() {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    console.error("Missing GEMINI_API_KEY environment variable");
    process.exit(1);
  }

  try {
    // [1단계] 기존 포스트 파싱 (gray-matter 사용, 100% 무결점)
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const files = fs.readdirSync(postsDir);
    const existingTitles = new Set();

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        if (data.title) {
          existingTitles.add(data.title.trim());
        }
      }
    }

    // [2단계] 최신 데이터 확인
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    if (!fs.existsSync(localInfoPath)) {
      console.log("local-info.json 파일이 존재하지 않습니다.");
      return;
    }

    const localInfo = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
    const allItems = [...(localInfo.events || []), ...(localInfo.benefits || [])];
    
    // 중복 제거 (이미 포스팅된 항목 제외)
    const pendingItems = allItems.filter(item => item.title && !existingTitles.has(item.title.trim()));

    if (pendingItems.length === 0) {
      console.log("모든 데이터가 이미 포스팅되어 있습니다. 새 글을 작성하지 않습니다.");
      return;
    }

    console.log(`총 ${pendingItems.length}개의 새 데이터가 발견되었습니다. 일괄(Batch) 포스팅을 시작합니다...`);

    // [3단계] 순차적으로 Gemini AI로 블로그 글 생성
    for (const item of pendingItems) {
      console.log(`[작성 중] ${item.title}`);
      
      const today = new Date().toISOString().split('T')[0];
      const sourceLink = item.link && item.link !== '#' ? item.link : '의정부시청 공식 홈페이지';

      const prompt = `당신은 "의정부 건강·생활 정보 포털"의 수석 에디터이자 행정/의료 정책 분석가입니다. 
주어진 데이터를 바탕으로 구글 검색 엔진 최상위 노출(Top Ranking) 및 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 기준을 완벽하게 충족하는 고밀도의 전문 칼럼을 작성하십시오.

정보: ${JSON.stringify(item, null, 2)}
공식 출처: ${sourceLink}

아래 마크다운 형식으로 출력해 주십시오. 다른 텍스트나 부연 설명은 단 한 글자도 출력하지 마십시오.

---
title: (구글 SEO 클릭률을 극대화하는 명확하고 전문적인 제목 - 대괄호 활용 예: "[의정부시] 청년 응시료 지원 10만 원, 자격 조건 및 신청 실무 가이드")
date: ${today}
summary: (구글 검색결과 스니펫에 노출될 150자 이내의 전문적인 핵심 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

## 1. 사전 분석 및 분량 계획 (Chain-of-Thought) - 필수 수행
본문을 작성하기 전에 반드시 아래 형식의 분석 블록을 출력의 최상단에 작성하십시오.
[ANALYSIS_START]
- 정책/행사 분석 관점 : {이 정보가 시민에게 왜 중요한지 핵심 쟁점 정의}
- 실무 가이드 포인트 : {신청 시 주의점, 서류 등 실무적 관점 도출}
- 목차(H2) 및 분량 설계 : 
  * {AI가 기획한 H2 제목 1} : {분량 계획}
  * {AI가 기획한 H2 제목 2} : {분량 계획}
[ANALYSIS_END]
위 분석을 바탕으로 1,500자 이상의 고밀도 전문 칼럼을 자율적으로 구성하십시오.

## 2. Heading 및 시각화 규칙
- **H1 사용 금지** : 본문에는 절대 H1('# 제목')을 작성하지 마세요.
- **H2 필수** : 본문 각 섹션의 대제목은 무조건 H2('##')로 작성하여 박스 스타일 렌더링을 유도하십시오.
- **이모지 남발 금지** : 가벼운 블로그처럼 대제목마다 이모지를 억지로 붙이는 것을 금지합니다. 매우 제한적이고 전문적으로만 사용하십시오.
- **강조 표시(Bold) 남용 및 기호 금지 (매우 중요)** : 
  1) 본문 문장 중간에 '**단어**'와 같이 마크다운 볼드체(**)를 무분별하게 남용하는 것을 절대 금지합니다.
  2) 불필요하게 텍스트에 별표(*)를 삽입하지 마십시오.
  3) 링크 작성 시 텍스트 끝에 화살표 기호('↗')를 절대 추가하지 마십시오. (프론트엔드에서 자동으로 아이콘이 붙습니다.)

## 3. 본문 작성 코어 모듈 (필수 포함)
1) **공감 및 현황 분석 (도입부)** : 시민들이 겪는 현실적 문제(비용 부담, 정보의 비대칭 등)에 공감하며 이 제도의 도입 배경과 필요성을 전문적으로 해설합니다.
2) **제도/행사 상세 해설** : 대상자, 지원 내용, 혜택의 실질적 가치를 행정/실무자의 시선에서 객관적이고 깊이 있게 분석합니다.
3) **실무 신청 가이드 (Step-by-step)** : 신청 방법, 필요 서류를 구글이 선호하는 순서형 목록(1. 2. 3.)으로 명확히 구분하여 안내합니다.
4) **전문가의 주의사항 (사각지대)** : 예외 조건, 중복 수혜 불가 항목, 탈락하기 쉬운 사유 등 '진짜 전문가'만이 짚어줄 수 있는 주의사항을 서술합니다.

## 4. 구글 구조화된 데이터(JSON-LD) 파싱 대비 엄격한 FAQ 포맷
본문 하단에 반드시 FAQ를 추가하되, 아래 포맷을 엄수하십시오. (Q는 반드시 H3(###) 사용)
## 자주 묻는 질문 (FAQ)
### Q : {질문 내용}
A : {팩트 기반 답변 내용}

## 5. E-E-A-T 및 신뢰성 극대화 지침 (기계적 어휘 금지)
- "~에 대해 알아보았습니다", "명심하시기 바랍니다", "추천하는 3가지 이유!" 등의 뻔하고 촌스러운 AI 멘트와 블로거 말투를 전면 금지합니다.
- 객관적이고 논리정연한 행정/의료 칼럼니스트의 톤을 일관되게 유지하십시오.
- 글의 마지막에는 "본 정보의 공식 출처는 [${sourceLink}](${sourceLink}) 입니다." 문구를 자연스럽게 포함하십시오.

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명을 영문으로 출력하십시오.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!geminiRes.ok) {
        throw new Error(`Gemini API failed: ${geminiRes.status}`);
      }

      const geminiData = await geminiRes.json();
      let aiText = geminiData.candidates[0].content.parts[0].text;

      // 마크다운 코드블록 등이 감싸져서 올 수 있으므로 정제
      aiText = aiText.replace(/```markdown/gi, '').replace(/```/g, '').trim();

      // FILENAME 파트 분리
      const filenameMatch = aiText.match(/FILENAME:\s*([^\s\n\r]+)/i);
      if (!filenameMatch) {
        throw new Error("Gemini 응답에서 파일명(FILENAME)을 찾을 수 없습니다.");
      }

      const filename = filenameMatch[1].trim() + ".md";
      let postContent = aiText.replace(/FILENAME:\s*[^\s\n\r]+/gi, '').trim();

      // [4단계] 파일 저장
      const targetFilePath = path.join(postsDir, filename);
      fs.writeFileSync(targetFilePath, postContent, 'utf8');

      console.log(`[완료] ${filename} 저장됨.`);
      
      // API Rate Limit 방지를 위한 3초 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log("모든 배치 작업이 완료되었습니다.");

  } catch (error) {
    console.error("오류 발생:", error.message);
    process.exit(1);
  }
}

main();
