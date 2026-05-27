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

(본문 스타일 가이드)
- 친근하고 정중한 블로그 어조로 작성해줘.
- 각 주요 단락의 시작이나 혜택/조건을 설명하는 부분에는 어울리는 이모지(예: 📅 일정, 🎁 혜택, 📍 장소, 🎯 대상, 💡 팁, 📌 신청방법 등)를 적재적소에 적극적으로 배치해줘.
- 800자 이상으로 풍부한 정보를 담아줘.
- 추천 이유 3가지를 명확히 💡 이 혜택(행사)을 추천하는 3가지 이유! 헤더 아래 작성해줘.
- 신청 방법과 필요 서류를 알기 쉽게 서술해줘.
- 가독성이 좋아지도록 중요한 키워드는 **볼드(굵은 글씨)** 처리해줘.

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
