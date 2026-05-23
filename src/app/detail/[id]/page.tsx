import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface LocalItem {
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
  events: LocalItem[];
  benefits: LocalItem[];
}

// 데이터 읽기 헬퍼
function getLocalData(): LocalData {
  const filePath = path.join(process.cwd(), 'public/data/local-info.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// 정적 내보내기를 위한 동적 라우팅 경로 생성
export async function generateStaticParams() {
  const data = getLocalData();
  const allItems = [...data.events, ...data.benefits];
  
  return allItems.map((item) => ({
    id: item.id,
  }));
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 최신 버전(15) 대응을 위해 params를 비동기로 가져옵니다.
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const data = getLocalData();
  
  // 행사와 혜택을 합쳐서 id로 데이터 찾기
  const item = [...data.events, ...data.benefits].find(item => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다.</h1>
        <Link href="/" className="text-sky-600 hover:underline font-medium">목록으로 돌아가기</Link>
      </div>
    );
  }

  // 행사인지 혜택인지에 따라 테마 색상 결정
  const isEvent = item.id.startsWith('e');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 상단 배너 (메인 페이지와 톤앤매너 일치) */}
      <div className={`${isEvent ? 'bg-sky-100' : 'bg-emerald-100'} py-12 px-4 text-center`}>
        <span className={`inline-block px-3 py-1 mb-4 rounded text-sm font-bold ${isEvent ? 'bg-sky-200 text-sky-800' : 'bg-emerald-200 text-emerald-800'}`}>
          {item.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight max-w-3xl mx-auto leading-snug">
          {item.title}
        </h1>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col min-h-[60vh]">
        
        {/* 뒤로 가기 (상단) */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            &larr; 목록으로 돌아가기
          </Link>
        </div>

        {/* 상세 정보 요약 박스 */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 mb-10">
          <ul className="space-y-4 text-base md:text-lg">
            <li className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-4">
              <span className="font-bold text-gray-500 w-24 flex-shrink-0 mb-1 md:mb-0">기간</span>
              <span className="font-medium text-gray-900">
                {item.startDate !== item.endDate ? `${item.startDate} ~ ${item.endDate}` : item.startDate}
              </span>
            </li>
            <li className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-4">
              <span className="font-bold text-gray-500 w-24 flex-shrink-0 mb-1 md:mb-0">장소</span>
              <span className="font-medium text-gray-900">{item.location}</span>
            </li>
            <li className="flex flex-col md:flex-row md:items-center">
              <span className="font-bold text-gray-500 w-24 flex-shrink-0 mb-1 md:mb-0">대상</span>
              <span className="font-medium text-gray-900">{item.target}</span>
            </li>
          </ul>
        </div>

        {/* 상세 설명 전문 */}
        <div className="mb-12 flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-gray-900 pl-3">상세 내용</h2>
          <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
            {item.summary}
          </p>
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
            💡 본 데이터는 샘플입니다. 실제 데이터 연동 시 이곳에 행사/혜택에 대한 긴 상세 설명이 들어갑니다.
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col gap-3 mt-auto">
          <a 
            href={item.link} 
            target="_blank" 
            rel="noreferrer"
            className={`block w-full text-center py-4 rounded-xl font-bold text-lg text-white transition-colors shadow-sm
              ${isEvent ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'}
            `}
          >
            원본 사이트에서 자세히 보기 &rarr;
          </a>
          
          <Link 
            href="/" 
            className="block w-full text-center py-4 rounded-xl font-bold text-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            목록으로 돌아가기
          </Link>
        </div>

      </main>
      
      {/* 푸터 */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 bg-gray-50">
        <p className="font-bold text-gray-700">우리 동네 소식통</p>
      </footer>

    </div>
  );
}
