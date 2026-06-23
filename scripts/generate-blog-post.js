const fs = require('fs');
const path = require('path');

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
    // [1단계] 최신 데이터 확인
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    if (!fs.existsSync(localInfoPath)) {
      console.log("local-info.json 파일이 존재하지 않습니다.");
      return;
    }

    const localInfo = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
    
    let latestItem = null;
    const hasEvents = localInfo.events && localInfo.events.length > 0;
    const hasBenefits = localInfo.benefits && localInfo.benefits.length > 0;

    if (hasBenefits) {
      latestItem = localInfo.benefits[localInfo.benefits.length - 1];
    } else if (hasEvents) {
      latestItem = localInfo.events[localInfo.events.length - 1];
    }

    if (!latestItem) {
      console.log("가져올 최신 데이터가 없습니다.");
      return;
    }

    // src/content/posts/ 폴더의 기존 파일들과 비교해서 이미 같은 name(여기서는 title)으로 글이 있으면 종료
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const files = fs.readdirSync(postsDir);
    const existingTitles = new Set();

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        // title 매칭 확인
        const titleMatch = content.match(/^title:\s*(["']?)(.*?)\1\s*$/m);
        if (titleMatch) {
          existingTitles.add(titleMatch[2].trim());
        }
      }
    }

    if (existingTitles.has(latestItem.title)) {
      console.log("이미 작성된 글입니다");
      return;
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.
이 글은 구글의 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 기준을 완벽하게 충족하고 검색 엔진에 최상위 노출되기 위해 전문적이고 독창적인 가치를 담아야 합니다.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목 - 구글 SEO 클릭률 향상을 위해 대괄호나 구체적 혜택을 결합하여 지을 것. 예: "[의정부 청년 혜택] 최대 10만 원 보상하는 응시료 지원 대상과 신청법 정리")
date: ${today}
summary: (구글 검색결과 스니펫에 노출될 매력적인 한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문 구조 및 작성 가이드 - 구글 E-E-A-T & 사용자 경험 극대화)

1. **독창적인 도입부 (경험 및 공감)**:
   - 정보의 혜택 대상자가 겪을 만한 실제 상황에 공감하며 글을 시작해줘. (예: "시험 한 번 볼 때마다 몇만 원씩 깨지는 응시료, 매번 부담스러우셨죠?")

2. **💡 이 혜택(행사)을 추천하는 3가지 이유!** (헤더 형식 엄수):
   - 일반적인 사실 나열이 아닌, 대상자에게 실질적으로 가장 매력적인 혜택 포인트를 분석하여 3가지 항목으로 설명해줘.

3. **📋 지원 자격 및 10초 자가진단 체크리스트**:
   - 사용자가 글을 읽고 자신이 자격이 되는지 바로 알 수 있게, 소제목과 함께 "- [ ] 조건 1\n- [ ] 조건 2" 형식의 자가진단 리스트를 본문에 포함해줘.

4. **⚙️ 세부 신청 방법 및 필수 준비 서류**:
   - 단계별로 신청 경로(웹사이트, 오프라인 등)와 서류 제출 시 주의사항을 상세하게 단계별로 작성해줘.

5. **⚠️ 주의사항 및 꿀팁 (전문성 및 신뢰성)**:
   - 중복 수혜 가능 여부, 마감 기한 직전 유의사항, 반려당하기 쉬운 예외 상황(예: 소득 판정 기준일 등)을 짚어주는 "이것만은 주의하세요!" 단락을 구성해줘.

(텍스트 가독성 및 마크다운 표준 가이드)
- 친근하면서도 전문적이고 정중한 블로그 어조로 작성해줘.
- 각 주요 단락의 시작이나 설명 부분에는 적절한 이모지(📅, 🎁, 📍, 🎯, 💡, 📌 등)를 적극적으로 배치해줘.
- 글의 길이는 전문성과 신뢰도를 높이기 위해 최소 1,000자 이상으로 풍부한 정보를 담아줘.
- 문장 속 가독성을 높이기 위해 핵심 단어는 **굵은 글씨(볼드체)**로 강조해줘.
- **[중요 - 마크다운 문법 준수]**:
  - **강조할 단어** 뒤에 조사(예: ~은, ~는, ~이, ~가, ~을, ~를, ~으로, ~에 등)가 올 경우 조사를 강조 표시 안쪽에 함께 넣어 작성해줘. (예: **혜택을** [O] / **혜택**을 [X])
  - 한글 특수문자나 괄호(예: 「」, ~, ())와 인접하여 강조 표시를 사용할 때는 강조 기호(**)의 앞뒤로 공백을 최소 한 칸 띄우고 작성하여, 표준 마크다운 엔진이 굵은 글씨를 오류 없이 해석할 수 있도록 해줘.
  - 마크다운 파서 및 데이터 정합성을 위해 텍스트 속 콜론 기호(\`:\`) 앞뒤로는 띄어쓰기를 한 칸씩 자연스럽게 포함해줘. (예: "지원 대상 : 의정부 시민")

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

    // [3단계] 파일 저장
    const targetFilePath = path.join(postsDir, filename);
    fs.writeFileSync(targetFilePath, postContent, 'utf8');

    console.log("생성 완료");

  } catch (error) {
    console.error("오류 발생:", error.message);
    process.exit(1);
  }
}

main();
