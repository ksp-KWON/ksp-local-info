export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const sourceText = body.sourceText;
    const type = body.type;

    if (!sourceText) {
      return new Response(JSON.stringify({ error: '텍스트가 없습니다.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formattingRule = '절대 마크다운 기호(###, ---, ** 등)를 사용하지 마세요. 오직 순수한 텍스트와 줄바꿈, 그리고 기본 기호( - )만 사용하여 줄글 형태로 자연스럽게 작성해주세요.';
    let promptContext = '';
    if (type === 'policy') {
      promptContext = `당신은 의정부시청 공공정책 전문 에디터 K입니다. 다음 공공데이터/정책 원문을 분석하여, 의정부 시민들이 가장 궁금해할 "지원 자격", "핵심 혜택", "신청 방법"을 3~4문장으로 아주 쉽고 친절하게 요약해주세요. 복잡한 행정 용어는 풀어서 설명해야 합니다. ${formattingRule}`;
    } else if (type === 'benefit') {
      promptContext = `당신은 의정부 혜택 알리미 에디터 K입니다. 다음 혜택 정보를 분석하여 시민들이 받을 수 있는 실질적인 금전적/비금전적 이득과 주의사항을 3~4문장으로 명확히 짚어주세요. ${formattingRule}`;
    } else {
      promptContext = `당신은 의정부 지역 전문 에디터 K입니다. 다음 지역 행사/소식 원문을 분석하여 일정, 장소, 그리고 참여 시 얻을 수 있는 장점을 3~4문장으로 요약해주세요. ${formattingRule}`;
    }

    const prompt = `${promptContext}\n\n[원문]\n${sourceText.substring(0, 3000)}`;
    const fallbackModels = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-pro-latest'];
    
    let comment = '';
    let lastError = null;

    for (const modelName of fallbackModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800,
              }
            })
          }
        );

        const data = await response.json();
        
        if (!data.error && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          comment = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    if (!comment) {
      return new Response(JSON.stringify({ error: 'AI 생성 중 오류가 발생했습니다.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 강제로 마크다운 기호 제거
    comment = comment.replace(/(\*\*|###|---|__)/g, '').replace(/^#+\s/gm, '');

    return new Response(JSON.stringify({ comment: comment.trim() }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '서버 에러가 발생했습니다.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
