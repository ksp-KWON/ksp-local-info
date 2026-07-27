/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * gemini-helper.js (의정부 로컬인포 버전)
 * Gemini API 공통 유틸리티
 * - 지능형 429/503 에러 백오프
 * - 모델 자동 폴오버 (flash → flash-lite)
 * - Retry-After 헤더 존중
 */

'use strict';

const sleep = ms => new Promise(r => setTimeout(r, ms));

// 모델 폴오버 순서 (상위 → 하위)
const GEMINI_MODELS = [
  { name: 'gemini-2.5-flash',      maxTokens: 32768 },
  { name: 'gemini-2.0-flash',      maxTokens: 32768 },
  { name: 'gemini-1.5-flash-8b',   maxTokens: 16384 },
];

// 재시도 설정
const RETRY_CONFIG = {
  maxRetries: 2,                       // 모델당 최대 재시도 횟수
  retryOn: [429, 500, 503, 529],       // 재시도할 HTTP 상태 코드
  timeoutMs: 120000,                   // API 응답 타임아웃 (2분)
};

/**
 * Gemini API를 호출합니다.
 * @param {string} apiKey - Gemini API 키
 * @param {string} prompt - 보낼 프롬프트
 * @param {object|null} schema - JSON 출력용 스키마 (선택사항)
 * @returns {Promise<string|object>} 응답 텍스트 또는 파싱된 JSON
 */
async function callGemini(apiKey, prompt, schema = null) {
  if (!apiKey || apiKey.length < 10) {
    throw new Error('GEMINI_API_KEY가 등록되지 않았거나 유효하지 않습니다.');
  }

  const baseGenerationConfig = {
    temperature: schema ? 0.2 : 0.75,
  };

  if (schema) {
    baseGenerationConfig.responseMimeType = 'application/json';
    baseGenerationConfig.responseSchema = schema;
  }

  // 모델 폴오버 루프
  modelLoop: for (const { name: model, maxTokens } of GEMINI_MODELS) {
    const generationConfig = {
      ...baseGenerationConfig,
      maxOutputTokens: maxTokens,
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 재시도 루프
    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      let res;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs);

      try {
        console.log(`  [API] 모델 '${model}' 호출 중... (시도: ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1})`);
        res = await fetch(url, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig,
          }),
          signal: controller.signal,
        });
      } catch (networkErr) {
        console.error(`  [실패] '${model}' 네트워크 오류: ${networkErr.message.slice(0, 80)}`);
        if (attempt < RETRY_CONFIG.maxRetries) {
          await sleep(5000);
          continue;
        }
        continue modelLoop;
      } finally {
        clearTimeout(timeoutId);
      }

      // ── 에러 분석 및 지능형 대응 ──────────────────────────────────────
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');

        // 1. 할당량 초과 → 즉각 하위 모델로 우회
        if (res.status === 429 && errorText.toLowerCase().includes('quota')) {
          console.error(`  [에러] '${model}' 하루 할당량(Quota) 초과 → 즉시 하위 모델로 전환합니다.`);
          continue modelLoop;
        }

        const shouldRetry = RETRY_CONFIG.retryOn.includes(res.status) && attempt < RETRY_CONFIG.maxRetries;
        if (!shouldRetry) {
          console.error(`  [실패] '${model}' HTTP ${res.status} → 다음 모델로 전환합니다.`);
          continue modelLoop;
        }

        // 2. Retry-After 헤더 존중
        const retryAfter = res.headers.get('retry-after');
        let delaySec = 0;

        if (retryAfter && !isNaN(parseInt(retryAfter, 10))) {
          delaySec = parseInt(retryAfter, 10);
          console.error(`  [재시도] '${model}' 서버 지시(Retry-After) ${delaySec}초 대기...`);
        } else {
          // 3. 지수 백오프 (자체 알고리즘)
          const base = res.status >= 500 ? 5 : 10;
          const jitter = Math.floor(Math.random() * 3) + 1;
          delaySec = base * Math.pow(2, attempt) + jitter;
          const errorType = res.status >= 500 ? '서버 과부하' : '트래픽 몰림(Rate Limit)';
          console.error(`  [백오프] '${model}' HTTP ${res.status} (${errorType}) → ${delaySec}초 대기 후 재시도...`);
        }

        await sleep(delaySec * 1000);
        continue;
      }

      // ── 정상 응답 처리 ────────────────────────────────────────────────
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error(`  [실패] '${model}' JSON 파싱 오류.`);
        if (attempt < RETRY_CONFIG.maxRetries) { await sleep(2000); continue; }
        continue modelLoop;
      }

      const candidate = data?.candidates?.[0];
      const finishReason = candidate?.finishReason ?? 'UNKNOWN';
      const text = (candidate?.content?.parts ?? []).map(p => p.text ?? '').join('');

      if (!text) {
        console.error(`  [실패] '${model}' 빈 응답 수신 (finishReason: ${finishReason}).`);
        if (attempt < RETRY_CONFIG.maxRetries) { await sleep(2000); continue; }
        continue modelLoop;
      }

      if (schema) {
        try {
          // 마크다운 코드블록 제거 후 파싱
          const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        } catch (e) {
          console.error(`  [실패] '${model}' JSON 스키마 파싱 실패. Raw Text:\n${text}`);
          if (attempt < RETRY_CONFIG.maxRetries) { await sleep(2000); continue; }
          continue modelLoop;
        }
      }

      // 텍스트 응답: 마크다운 코드블록 제거
      return text.replace(/```markdown/gi, '').replace(/```/g, '').trim();
    }
    // 재시도 소진 → 다음 모델로
  }

  throw new Error('모든 Gemini 모델이 응답하지 않았습니다. 잠시 후 다시 실행해 주세요.');
}

module.exports = { callGemini, GEMINI_MODELS, sleep };
