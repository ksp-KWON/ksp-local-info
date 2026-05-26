import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 데이터 타입 정의
interface LocalEvent {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

interface LocalData {
  events: LocalEvent[];
  benefits: LocalEvent[];
  lastUpdated: string;
}

// 서버 컴포넌트에서 데이터 읽어오기
async function getLocalData(): Promise<LocalData> {
  const filePath = path.join(process.cwd(), 'public/data/local-info.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getLocalData();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. 상단 큰 배너 (하늘색 배경 유지) */}
      <div className="bg-sky-100 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-900 tracking-tight mb-4">
          우리 동네 소식통
        </h1>
        <p className="text-sky-700 text-lg md:text-xl font-medium">
          성남시의 유용한 행사와 혜택을 깔끔하게 모았습니다
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* 2. 행사/축제 섹션 (카드 형태로 변경, 파란색 계열) */}
        <section className="mb-16">
          <div className="border-b-2 border-gray-900 pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">이번 달 주요 행사</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.events.map((item) => {
              // 날짜 텍스트 파싱
              const dayMatch = item.startDate.match(/(\d+)일/);
              const day = dayMatch ? dayMatch[1] : item.startDate.substring(0,2);
              const monthMatch = item.startDate.match(/(\d+)월/);
              const month = monthMatch ? monthMatch[1] : "";

              return (
                <Link href="/blog" key={item.id} className="block group">
                  <div className="h-full p-6 bg-white border-2 border-sky-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    
                    {/* 상단 장식 바 */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start gap-4 mb-4">
                      {/* 큰 날짜 영역 (카드 내부에 배치) */}
                      <div className="w-16 flex-shrink-0 text-center bg-sky-50 rounded-lg py-2 border border-sky-100">
                        <span className="block text-xs font-bold text-sky-600 mb-0.5">{month}월</span>
                        <span className="block text-2xl font-extrabold text-sky-900">{day}</span>
                      </div>
                      
                      {/* 제목 영역 */}
                      <div className="pt-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-sky-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                      {item.summary}
                    </p>
                    
                    {/* 하단 요약 정보 */}
                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <span className="flex items-center">
                        <span className="mr-1">📍</span> {item.location}
                      </span>
                      <span>
                        {item.startDate !== item.endDate ? `${item.startDate}~${item.endDate}` : item.startDate}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. 지원금/혜택 섹션 (파란색 테마로 통일) */}
        <section>
          <div className="border-b-2 border-gray-900 pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">놓치면 아쉬운 혜택</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benefits.map((item) => (
              <Link href="/blog" key={item.id} className="block group">
                <div className="h-full p-6 bg-white border-2 border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  
                  {/* 상단 장식 바 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* 상단: 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:underline decoration-blue-500 underline-offset-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                    {item.summary}
                  </p>
                  
                  {/* 대상자 눈에 띄게 강조 (파란색 테마) */}
                  <div className="mt-auto bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <span className="block text-xs font-bold text-blue-600 mb-1">지원 대상</span>
                    <span className="block text-sm font-bold text-gray-900">{item.target}</span>
                  </div>

                  <div className="mt-4 text-right text-xs text-gray-400 font-medium">
                    기한: {item.endDate}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 */}
      <footer className="border-t border-gray-200 mt-12 py-8 text-center text-sm text-gray-500">
        <p className="mb-2 font-bold text-gray-700">우리 동네 소식통</p>
        <p>본 정보는 <a href="https://www.data.go.kr" className="underline hover:text-blue-600">공공데이터포털</a> 데이터를 바탕으로 작성되었습니다.</p>
        <p className="mt-2 text-xs">최종 업데이트: {data.lastUpdated}</p>
      </footer>

    </div>
  );
}
