import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { getSortedPostsData, Post } from '@/lib/posts';

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

// 블로그 글과 공공데이터 항목 매칭용 헬퍼 함수
function findMatchingPostSlug(itemTitle: string, posts: Post[]): string | null {
  const exactMatch = posts.find(
    (p) => p.title === itemTitle || p.title.includes(itemTitle) || itemTitle.includes(p.title)
  );
  if (exactMatch) return exactMatch.slug;

  const keywords = itemTitle
    .split(/[\s()]+/)
    .filter((w) => w.length > 1 && !['지원', '지원금', '안내', '축제', '성남시', '경기도'].includes(w));
  
  if (keywords.length > 0) {
    const keywordMatch = posts.find((p) =>
      keywords.some((kw) => p.title.includes(kw) || p.content.includes(kw))
    );
    if (keywordMatch) return keywordMatch.slug;
  }

  return null;
}

async function getLocalData(): Promise<LocalData> {
  const filePath = path.join(process.cwd(), 'public/data/local-info.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getLocalData();
  const posts = getSortedPostsData();

  // Event 스키마 빌드 (행사용)
  const eventSchemas = data.events.map(item => {
    const todayYear = new Date().getFullYear();
    
    const parseDateText = (dateText: string) => {
      const match = dateText.match(/(\d+)월\s*(\d+)일/);
      if (match) {
        const month = match[1].padStart(2, '0');
        const day = match[2].padStart(2, '0');
        return `${todayYear}-${month}-${day}`;
      }
      return dateText;
    };

    const isoStart = parseDateText(item.startDate);
    const isoEnd = parseDateText(item.endDate);

    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": item.title,
      "description": item.summary,
      "startDate": isoStart,
      "endDate": isoEnd,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": item.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "의정부시",
          "addressRegion": "경기도",
          "addressCountry": "KR"
        }
      }
    };
  });

  // GovernmentService 스키마 빌드 (혜택용)
  const benefitSchemas = data.benefits.map(item => {
    return {
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      "name": item.title,
      "description": item.summary,
      "serviceAudience": {
        "@type": "Audience",
        "audienceType": item.target
      },
      "provider": {
        "@type": "GovernmentOrganization",
        "name": item.location || "지자체"
      }
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {eventSchemas.map((schema, index) => (
        <script
          key={`event-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {benefitSchemas.map((schema, index) => (
        <script
          key={`benefit-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* 1. 상단 그라데이션 히어로 섹션 */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 py-20 px-4 text-center text-white shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mb-4 backdrop-blur-xs">
            📢 우리 동네 정보 알림이
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            의정부시 생활 정보통 ✨
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            의정부시 곳곳의 실시간 축제·행사 일정과<br />
            놓치기 아까운 정부 혜택·지원금을 한눈에 모았습니다.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-16">
        
        {/* 2. 행사/축제 섹션 */}
        <section className="mb-16">
          <div className="flex items-center gap-2 pb-3 mb-8 border-b border-slate-200">
            <span className="text-2xl">📅</span>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">이번 달 주요 행사</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.events.map((item) => {
              const dayMatch = item.startDate.match(/(\d+)일/);
              const day = dayMatch ? dayMatch[1] : item.startDate.substring(0,2);
              const monthMatch = item.startDate.match(/(\d+)월/);
              const month = monthMatch ? monthMatch[1] : "";

              const matchedSlug = findMatchingPostSlug(item.title, posts);
              const href = matchedSlug 
                ? `/blog/${matchedSlug}` 
                : (item.link && item.link !== '#' ? item.link : '/blog');
              const isExternal = href.startsWith('http');

              return (
                <Link 
                  href={href} 
                  key={item.id} 
                  className="block group"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <div className="h-full p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 flex-shrink-0 text-center bg-indigo-50 rounded-xl py-2.5 border border-indigo-100/60">
                          <span className="block text-xs font-bold text-indigo-500 mb-0.5">{month}월</span>
                          <span className="block text-2xl font-extrabold text-indigo-900">{day}</span>
                        </div>
                        <div className="pt-1">
                          <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 mt-auto">
                      <span className="flex items-center font-medium">
                        <span className="mr-1">📍</span> {item.location}
                      </span>
                      <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {item.startDate !== item.endDate ? `${item.startDate}~${item.endDate}` : item.startDate}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 광고 영역 */}
        <div className="my-12">
          <AdBanner slot="home-middle-ad" />
        </div>

        {/* 3. 지원금/혜택 섹션 */}
        <section className="mt-16">
          <div className="flex items-center gap-2 pb-3 mb-8 border-b border-slate-200">
            <span className="text-2xl">🎁</span>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">놓치면 아쉬운 혜택</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benefits.map((item) => {
              const matchedSlug = findMatchingPostSlug(item.title, posts);
              const href = matchedSlug 
                ? `/blog/${matchedSlug}` 
                : (item.link && item.link !== '#' ? item.link : '/blog');
              const isExternal = href.startsWith('http');

              return (
                <Link 
                  href={href} 
                  key={item.id} 
                  className="block group"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <div className="h-full p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-violet-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-violet-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    
                    <div>
                      <div className="bg-violet-50/70 border border-violet-100/60 rounded-xl p-3.5 mb-4">
                        <span className="block text-xs font-bold text-violet-600 mb-1">🎯 지원 대상</span>
                        <span className="block text-sm font-bold text-slate-700">{item.target}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center">
                          <span className="mr-1">🏛️</span> {item.location || '의정부시'}
                        </span>
                        <span className="font-medium text-slate-500 bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                          기한: {item.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 */}
      <footer className="border-t border-slate-200 bg-white mt-24 py-12 text-center text-sm text-slate-500">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2 font-bold text-slate-800 text-base">의정부시 생활 정보통 📢</p>
          <p className="mb-4">본 정보는 <a href="https://www.data.go.kr" className="underline font-semibold text-indigo-600 hover:text-indigo-800">공공데이터포털</a> 데이터를 바탕으로 가공되어 제공됩니다.</p>
          <p className="text-xs text-slate-400">최종 업데이트: {data.lastUpdated}</p>
        </div>
      </footer>

    </div>
  );
}
