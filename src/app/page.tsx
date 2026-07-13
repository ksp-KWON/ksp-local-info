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

interface Hospital {
  id: string;
  name: string;
  tel: string;
  address: string;
  treated: boolean;
  notes: string;
}

function findMatchingPostSlug(item: { title: string; slug?: string }, posts: Post[]): string | null {
  if (item.slug) {
    const exists = posts.some((p) => p.slug === item.slug);
    if (exists) return item.slug;
  }

  const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
  const normalizedTitle = normalize(item.title);
  
  const exactMatch = posts.find((p) => {
    const normalizedPostTitle = normalize(p.title);
    return normalizedPostTitle.includes(normalizedTitle) || normalizedTitle.includes(normalizedPostTitle);
  });

  if (exactMatch) return exactMatch.slug;

  return null;
}

async function getLocalData(): Promise<LocalData> {
  const filePath = path.join(process.cwd(), 'public/data/local-info.json');
  if (!fs.existsSync(filePath)) {
    return { events: [], benefits: [], lastUpdated: '' };
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function getMedicalData(): Promise<Hospital[]> {
  const filePath = path.join(process.cwd(), 'public/data/medical-info.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getLocalData();
  const hospitals = await getMedicalData();
  const posts = getSortedPostsData();

  // JSON-LD 구조화 데이터
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "의정부 주요 의료기관 및 병원 안내",
    "numberOfItems": hospitals.length,
    "itemListElement": hospitals.map((hospital, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "MedicalBusiness",
        "name": hospital.name,
        "telephone": hospital.tel,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": hospital.address,
          "addressLocality": "의정부시",
          "addressRegion": "경기도",
          "addressCountry": "KR"
        },
        "description": hospital.notes
      }
    }))
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "의정부 주요 축제 및 행사 정보",
    "numberOfItems": data.events.length,
    "itemListElement": data.events.map((item, idx) => {
      const start = item.startDate ? (item.startDate.match(/^\d{4}-\d{2}-\d{2}$/) ? item.startDate : new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
      const end = (item.endDate && item.endDate !== '상시' && item.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) ? item.endDate : start;
      return {
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Event",
          "name": item.title,
          "startDate": start,
          "endDate": end,
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
          },
          "description": item.summary
        }
      };
    })
  };

  return (
    <div className="space-y-8 sm:px-0 pb-16">
      {/* JSON-LD 구조화 데이터 삽입 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      
      {/* 1. 메인 페이지 인트로 헤더 (입체 박스 스타일) */}
      <div className="bg-white dark:bg-[#1e1f22]  p-5 sm:p-6 mb-6 rounded-none border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(0,144,214,0.2)] hover:border-[#0090D6] transition-all duration-300 relative overflow-hidden group/headerbox mt-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-3 sm:px-4 py-1.5 sm:py-2 mb-3">
          <span className="bg-gradient-to-r from-[#0090D6] to-[#00b4d8] dark:from-[#00b4d8] dark:to-[#90e0ef] bg-clip-text text-transparent">의정부 주민 맞춤형 혜택·의료 포털 🏥</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#9aa0a6] break-keep leading-relaxed font-medium">
          지역 주요 병원 정보, 의료 혜택, 유아 및 청년 지원금부터 동네 문화 행사 소식까지 의정부시의 유용한 생활 밀착 혜택들을 한곳에서 제공합니다.
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#0090D6] font-semibold bg-[#0090D6]/10 px-2.5 py-1 rounded-sm border border-[#0090D6]/20">
            🔄 최종 업데이트 : {data.lastUpdated || '2026-05-29'}
          </span>
        </div>
      </div>

      {/* 2. 병원 리스트 정보 섹션 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-5 px-4 sm:px-5 py-3 sm:py-3.5 bg-transparent relative z-10 group/header">
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-[#0090D6]">
            <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">🏥</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] dark:text-[#e8eaed] tracking-tight">
              주요 의료기관 및 병원 안내
            </h2>
          </div>
          <Link href="/blog?category=의료" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-[#0090D6] transition-colors group/link">
            전체보기
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <article 
              key={hospital.id} 
              className="group relative bg-white dark:bg-[#1e1f22]  rounded-none overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,144,214,0.15)] dark:hover:shadow-[0_12px_40px_rgba(0,144,214,0.3)] hover:border-[#0090D6] transition-all duration-300 flex flex-col justify-between min-h-[160px] p-4 sm:p-5"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-[#0090D6] transition-colors line-clamp-2 leading-snug break-keep bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2 py-1">
                    {hospital.name}
                  </h4>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md border border-transparent ${
                    hospital.treated 
                      ? 'bg-blue-50 text-[#0090D6] dark:bg-[#0090D6]/20 dark:text-[#00b4d8]' 
                      : 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                  }`}>
                    {hospital.treated ? '발행완료' : '대기중'}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed font-normal break-keep mb-4">
                  {hospital.notes}
                </p>
              </div>
              <div className="mt-4 w-full text-[12px] font-medium text-[#5f6368] dark:text-[#9aa0a6] space-y-1.5 border-t border-gray-100 dark:border-white/5 pt-3">
                <div className="flex items-center gap-2"><span className="text-[11px]">📞</span> {hospital.tel}</div>
                <div className="flex items-center gap-2"><span className="text-[11px]">📍</span> <span className="truncate">{hospital.address}</span></div>
              </div>
            </article>
          ))}
          {hospitals.length === 0 && (
            <p className="text-sm text-gray-400 col-span-3 text-center py-8">등록된 병원 정보가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 광고 영역 */}
      <div className="py-2">
        <AdBanner slot="home-middle-ad" />
      </div>

      {/* 3. 우리동네 축제·행사 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-5 px-4 sm:px-5 py-3 sm:py-3.5 bg-transparent relative z-10 group/header">
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-yellow-500">
            <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">🎉</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] dark:text-[#e8eaed] tracking-tight">
              주요 축제 및 행사 정보
            </h2>
          </div>
          <Link href="/blog?category=행사" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-yellow-600 transition-colors group/link">
            전체보기
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {data.events.map((item) => {
            const matchedSlug = findMatchingPostSlug(item, posts);
            const href = matchedSlug ? `/blog/${matchedSlug}` : (item.link && item.link !== '#' ? item.link : '/blog');
            const isExternal = href.startsWith('http');
            return (
              <Link 
                href={href} 
                key={item.id} 
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative bg-white dark:bg-[#1e1f22]  rounded-none overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(234,179,8,0.15)] dark:hover:shadow-[0_12px_40px_rgba(234,179,8,0.3)] hover:border-yellow-500 transition-all duration-300 flex flex-col min-h-[140px]"
              >
                <div className="p-4 sm:p-5 flex flex-col justify-between h-full flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-md border border-transparent bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {item.category || '행사/축제'}
                    </span>
                    <time className="text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1 shrink-0">
                      🗓 {item.startDate.substring(0, 10)}
                    </time>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug break-keep bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2 py-1">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-4 w-full text-[12px] font-medium text-[#5f6368] dark:text-[#9aa0a6] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                    <div className="flex items-center gap-2 truncate">
                      📍 {item.location}
                    </div>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. 유용한 지원금·혜택 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-5 px-4 sm:px-5 py-3 sm:py-3.5 bg-transparent relative z-10 group/header">
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-emerald-500">
            <span className="text-xl sm:text-2xl leading-none" aria-hidden="true">💰</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] dark:text-[#e8eaed] tracking-tight">
              복지 지원금 및 혜택
            </h2>
          </div>
          <Link href="/blog?category=혜택" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors group/link">
            전체보기
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {data.benefits.map((item) => {
            const matchedSlug = findMatchingPostSlug(item, posts);
            const href = matchedSlug ? `/blog/${matchedSlug}` : (item.link && item.link !== '#' ? item.link : '/blog');
            const isExternal = href.startsWith('http');
            return (
              <Link 
                href={href} 
                key={item.id} 
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative bg-white dark:bg-[#1e1f22]  rounded-none overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_12px_40px_rgba(16,185,129,0.3)] hover:border-emerald-500 transition-all duration-300 flex flex-col min-h-[160px]"
              >
                <div className="p-4 sm:p-5 flex flex-col justify-between h-full flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-md border border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                      {item.category || '복지/혜택'}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded">
                      ⏳ 마감: {item.endDate}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="text-sm font-bold text-[#202124] dark:text-[#e8eaed] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug break-keep bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5 dark:to-transparent px-2 py-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed font-normal break-keep">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-4 w-full text-[12px] font-medium text-[#5f6368] dark:text-[#9aa0a6] flex items-center justify-between transition-colors p-2.5 rounded-none bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    <div className="flex items-center gap-2 truncate">
                      🎯 대상: {item.target}
                    </div>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      
    </div>
  );
}
