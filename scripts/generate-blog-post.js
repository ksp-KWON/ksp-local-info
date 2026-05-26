const fs = require('fs');
const path = require('path');

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
    
    // 가장 최근에 추가된 항목 (events나 benefits 배열의 0번째가 unshift 방식이므로 가장 최신일 수 있으나,
    // 사용자가 "마지막 항목(배열의 마지막)을 읽어옴" 이라고 지정했으므로, 
    // JSON 구조상 events와 benefits 중 어느 것이 더 최근인지는 알 수 없으므로 두 배열 중 아이템이 있는 것을 찾습니다.
    // 배열의 마지막 항목을 읽어오는 로직을 구현합니다.
    // 일단 events와 benefits를 합치거나, 각 배열의 마지막 중 더 최신 항목을 선택해야 할 수 있습니다.
    // 사용자 지시: "public/data/local-info.json에서 마지막 항목(배열의 마지막)을 읽어옴"
    // 단순하게 events와 benefits 중 데이터가 존재하는 배열의 마지막 요소를 선택하도록 구현하겠습니다.
    // 보통 혜택이나 행사 중 하나일 텐데, JSON 파일에 마지막으로 저장된 데이터를 확인합니다.
    // 안전하게 events와 benefits를 뒤에서부터 탐색하여 판단해봅시다.
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

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

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
    // 본문 내용에서 FILENAME 라인 제거
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
