import fs from 'fs';
import path from 'path';

export default function AboutPage() {
  const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
  let lastUpdated = '';

  try {
    if (fs.existsSync(localInfoPath)) {
      const data = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
      lastUpdated = data.lastUpdated || '';
    }
  } catch {
    // Ignore errors
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">사이트 소개</h1>
      
      <div className="prose prose-sky max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">1. 서비스 운영 목적</h2>
          <p className="text-gray-600 leading-relaxed">
            본 사이트는 의정부시 및 경기도 지역 주민들이 실생활에서 유용하게 활용할 수 있는 다양한 <strong>지역 행사, 복지 혜택, 그리고 정부 지원금 정보</strong>를 신속하고 편리하게 확인하실 수 있도록 돕기 위해 운영되고 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">2. 공공데이터 기반 정보 제공 및 출처</h2>
          <p className="text-gray-600 leading-relaxed">
            본 사이트의 지역 정보 데이터는 대한민국 정부 공공데이터포털(data.go.kr)의 공공서비스 목록 API 데이터를 수집하여 활용하고 있습니다. 수집된 정보는 의정부 및 경기도 행정구역 기준으로 가공 및 필터링을 거쳐 제공됩니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">3. 콘텐츠 생성 방식 및 AI 활용 고지</h2>
          <p className="text-gray-600 leading-relaxed">
            본 사이트의 블로그 콘텐츠는 최신 공공서비스 데이터의 핵심 개요를 바탕으로 <strong>Gemini AI 기술을 활용하여 자동 생성</strong>됩니다. AI 가공 과정에서 가독성을 높이고 신청 절차를 더욱 이해하기 쉽게 풀어썼으나, 정책 세부 변경 사항이 즉시 반영되지 못할 수 있습니다.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
            <p className="text-sm text-amber-700">
              ⚠️ <strong>주의사항</strong>: 제공되는 지원 자격이나 혜택 범위 등은 시점 및 행정 지침에 따라 바뀔 수 있으므로, 신청하시기 전에 반드시 해당 소관 기관(동 주민센터 등)이나 원문 공식 웹사이트 링크를 통해 최종 상세 조건을 직접 검증하시기 바랍니다.
            </p>
          </div>
        </section>

        {lastUpdated && (
          <div className="text-sm text-gray-400 mt-12 border-t pt-4">
            데이터 동기화 최종 업데이트일: {lastUpdated}
          </div>
        )}
      </div>
    </div>
  );
}
