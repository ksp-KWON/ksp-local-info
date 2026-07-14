import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sourceText, type } = await req.json();

    if (!sourceText) {
      return NextResponse.json({ error: '텍스트가 없습니다.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    let promptContext = '';
    if (type === 'policy') {
      promptContext = '당신은 의정부시청 공공정책 전문 에디터 K입니다. 다음 공공데이터/정책 원문을 분석하여, 의정부 시민들이 가장 궁금해할 "지원 자격", "핵심 혜택", "신청 방법"을 3~4문장으로 아주 쉽고 친절하게 요약해주세요. 복잡한 행정 용어는 풀어서 설명해야 합니다.';
    } else if (type === 'benefit') {
      promptContext = '당신은 의정부 혜택 알리미 에디터 K입니다. 다음 혜택 정보를 분석하여 시민들이 받을 수 있는 실질적인 금전적/비금전적 이득과 주의사항을 3~4문장으로 명확히 짚어주세요.';
    } else {
      promptContext = '당신은 의정부 지역 전문 에디터 K입니다. 다음 지역 행사/소식 원문을 분석하여 일정, 장소, 그리고 참여 시 얻을 수 있는 장점을 3~4문장으로 요약해주세요.';
    }

    const prompt = `${promptContext}\n\n[원문]\n${sourceText.substring(0, 3000)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return NextResponse.json({ error: 'AI 생성 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const comment = data.candidates?.[0]?.content?.parts?.[0]?.text || '분석 결과를 생성하지 못했습니다.';

    return NextResponse.json({ comment: comment.trim() });
  } catch (error) {
    console.error('AI Comment Error:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}
