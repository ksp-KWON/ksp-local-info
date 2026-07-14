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

      const prompt = `당신은 "의정부시 생활정보 전문 에디터 K"입니다. 구글 검색 엔진 최상위 노출(Top Ranking) 및 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 기준을 완벽하게 충족하는 고퀄리티 공공서비스 안내 블로그 글을 작성해주세요.

정보: ${JSON.stringify(item, null, 2)}
공식 출처: ${sourceLink}

아래 마크다운 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목 - 구글 SEO 클릭률 향상을 위해 대괄호나 구체적 혜택 결합. 예: "[의정부 청년 혜택] 최대 10만 원 보상하는 응시료 지원 대상과 신청법 정리")
date: ${today}
summary: (구글 검색결과 스니펫에 노출될 매력적인 한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문 구조 및 작성 가이드 - 분량 1,500자 이상 전문적이고 심도있게 작성)

1. **독창적인 도입부 (경험 및 공감)**:
   - 정보의 혜택 대상자가 겪을 만한 실제 상황에 깊이 공감하며 글을 시작. 에디터 K의 관점에서 작성.

2. **💡 이 혜택(행사)을 추천하는 3가지 이유!**:
   - 일반적인 사실 나열이 아닌, 대상자에게 실질적으로 가장 매력적인 혜택 포인트를 분석.

3. **📋 지원 자격 및 10초 자가진단 체크리스트**:
   - 소제목과 함께 "- [ ] 조건 1" 형식의 체크리스트 포함.

4. **⚙️ 세부 신청 방법 및 필수 준비 서류**:
   - 신청 경로와 주의사항을 상세하게 단계별로 작성.

5. **⚠️ 전문가의 꿀팁 및 주의사항**:
   - 마감 기한, 중복 수혜, 반려당하기 쉬운 예외 상황 등 '진짜 전문가'만이 알 수 있는 깊이 있는 정보 제공.

6. **🔗 공식 출처 및 문의처**:
   - "이 정보의 공식 출처는 [${sourceLink}](${sourceLink}) 입니다." 문구 포함. 담당 부서 연락처가 있다면 추가.

7. **💬 자주 묻는 질문 (FAQ) 3가지**:
   - 사람들이 가장 궁금해할 만한 핵심 질문 3가지와 명쾌한 답변 작성. (구글 스키마 노출 목적)
   - 반드시 아래와 같이 Q: 와 A: 로 시작하는 엄격한 포맷을 준수할 것.
   Q: 질문 내용
   A: 답변 내용

(텍스트 가독성 및 마크다운 표준 가이드)
- 각 주요 단락의 시작에 적절한 이모지 적극 사용.
- 핵심 단어는 **굵은 글씨** 강조되, 조사는 강조 기호 밖에 배치. (예: **혜택**을)
- 텍스트 속 콜론(\`:\`) 앞뒤 띄어쓰기 1칸 추가.

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
