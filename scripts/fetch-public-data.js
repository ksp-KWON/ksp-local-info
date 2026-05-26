const fs = require('fs');
const path = require('path');

async function main() {
  const apiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !geminiKey) {
    console.error("Missing API keys");
    process.exit(1);
  }

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(apiKey)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API fetch failed: ${response.status}`);
    }
    const data = await response.json();
    const items = data.data || [];

    // 필터링
    let filtered = items.filter(item => 
      (item.서비스명 && item.서비스명.includes('성남')) ||
      (item.서비스목적요약 && item.서비스목적요약.includes('성남')) ||
      (item.지원대상 && item.지원대상.includes('성남')) ||
      (item.소관기관명 && item.소관기관명.includes('성남'))
    );

    if (filtered.length === 0) {
      filtered = items.filter(item => 
        (item.서비스명 && item.서비스명.includes('경기')) ||
        (item.서비스목적요약 && item.서비스목적요약.includes('경기')) ||
        (item.지원대상 && item.지원대상.includes('경기')) ||
        (item.소관기관명 && item.소관기관명.includes('경기'))
      );
    }

    if (filtered.length === 0) {
      filtered = items;
    }

    if (filtered.length === 0) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // [2단계] 기존 데이터와 비교
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    let localInfo = { events: [], benefits: [], lastUpdated: "" };
    if (fs.existsSync(localInfoPath)) {
      const fileContent = fs.readFileSync(localInfoPath, 'utf8');
      localInfo = JSON.parse(fileContent);
    }

    const existingNames = new Set([
      ...localInfo.events.map(e => e.title), // local-info.json에서는 title을 사용함
      ...localInfo.benefits.map(b => b.title)
    ]);

    // 새로운 항목 1개 찾기
    let newItem = null;
    for (const item of filtered) {
      if (!existingNames.has(item.서비스명)) {
        newItem = item;
        break;
      }
    }

    if (!newItem) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // [3단계] Gemini AI로 새 항목 1개만 가공
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터:
${JSON.stringify(newItem)}`;

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
    
    // 마크다운 코드블록 제거
    aiText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedItem = JSON.parse(aiText);

    // [4단계] 기존 데이터에 추가
    const finalItem = {
      id: String(parsedItem.id),
      title: parsedItem.name, // 프론트엔드 호환성을 위해 name을 title로 매핑
      category: parsedItem.category,
      startDate: parsedItem.startDate,
      endDate: parsedItem.endDate,
      location: parsedItem.location,
      target: parsedItem.target,
      summary: parsedItem.summary,
      link: parsedItem.link || "#"
    };

    if (finalItem.category === '행사') {
      localInfo.events.unshift(finalItem);
    } else {
      localInfo.benefits.unshift(finalItem);
    }

    localInfo.lastUpdated = new Date().toISOString().split('T')[0];

    fs.writeFileSync(localInfoPath, JSON.stringify(localInfo, null, 2), 'utf8');
    console.log("데이터 추가 성공");

  } catch (error) {
    console.error("오류 발생:", error.message);
    process.exit(1);
  }
}

main();
