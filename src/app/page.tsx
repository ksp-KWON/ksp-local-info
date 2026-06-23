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

  // 1. 의료기관 구조화 데이터 목록 생성
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

  // 2. 축제 및 행사 구조화 데이터 목록 생성
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
    <div className="w-full pb-16 space-y-16">
      {/* JSON-LD 구조화 데이터 삽입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      
      {/* 1. 상단 인트로 히어로 배너 (토스·애플 스타일 미니멀 플랫 카드) */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xs border border-slate-800">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <span className="text-blue-500 font-bold text-xs uppercase tracking-widest font-title">의정부 생활 백서</span>
          <h2 className="text-3xl md:text-4xl font-black font-title tracking-tight leading-[1.15]">
            주민 맞춤형 <br className="sm:hidden" />
            건강·혜택 가이드 🏥
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed font-light">
            지역 주요 병원 정보, 의료 혜택, 유아 및 청년 지원금부터 동네 문화 행사 소식까지 의정부의 모든 유용한 정보를 편리하게 찾아보세요.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold bg-slate-800/60 w-fit px-3 py-1.5 rounded-full border border-slate-800">
              🔄 최종 업데이트 : {data.lastUpdated || '2026-05-29'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 병원 리스트 정보 섹션 */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-title tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-blue-500">🏥</span> 의정부 주요 의료기관 및 병원 안내
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div 
              key={hospital.id} 
              className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-750 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="font-bold font-title text-[15px] text-slate-800 dark:text-slate-100 leading-snug">{hospital.name}</h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    hospital.treated 
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-500 border border-blue-100/30' 
                      : 'bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border border-slate-100/30'
                  }`}>
                    {hospital.treated ? '발행 완료' : '대기 중'}
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-light">{hospital.notes}</p>
              </div>

              <div className="border-t border-slate-100/80 dark:border-slate-850 pt-4 text-[12px] space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">📞</span> 
                  <span className="font-mono font-medium">{hospital.tel}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[11px] text-slate-400">📍</span>
                  <span className="truncate font-light">{hospital.address}</span>
                </div>
              </div>
            </div>
          ))}
          {hospitals.length === 0 && (
            <p className="text-sm text-slate-400 col-span-3 text-center py-8">등록된 병원 정보가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="py-2">
        <AdBanner slot="home-middle-ad" />
      </div>

      {/* 3. 우리동네 축제·행사 */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-title tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-blue-500">🎪</span> 우리동네 주요 축제 및 행사 정보
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="group flex bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 overflow-hidden hover:border-slate-300 dark:hover:border-slate-750 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 h-[105px] rounded-2xl"
              >
                <div className="w-[70px] flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/20 border-r border-slate-100/80 dark:border-slate-850 group-hover:bg-slate-100/40 dark:group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                  <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-300">🎉</span>
                </div>
                <div className="flex flex-col p-5 flex-1 justify-between min-w-0">
                  <h4 className="text-[14px] text-slate-800 dark:text-slate-200 font-bold line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors font-title">
                    {item.title}
                  </h4>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="truncate pr-2 font-light">📍 {item.location}</span>
                    <span className="flex-shrink-0 font-mono font-light">🗓 {item.startDate.substring(0, 10)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 4. 유용한 지원금·혜택 */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-title tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-blue-500">🎁</span> 놓치면 아쉬운 복지 지원금 및 혜택
        </h3>
        <div className="flex flex-col gap-6">
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
                className="group flex bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 overflow-hidden hover:border-slate-300 dark:hover:border-slate-750 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
              >
                <div className="hidden sm:flex w-[90px] flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/20 border-r border-slate-100/80 dark:border-slate-850 flex-col items-center justify-center p-2 text-center group-hover:bg-slate-100/40 dark:group-hover:bg-slate-900/40 transition-colors">
                   <span className="text-xl mb-1 grayscale group-hover:grayscale-0 transition-all duration-300">💰</span>
                   <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">BENEFIT</span>
                </div>
                <div className="flex flex-col p-6 flex-1">
                  <h4 className="text-[15px] text-slate-800 dark:text-slate-100 font-bold mb-2 group-hover:text-blue-500 transition-colors leading-snug font-title">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-light">{item.summary}</p>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100/60 dark:border-slate-850 pt-3.5 mt-auto">
                    <span className="truncate pr-2 font-light">🎯 대상: {item.target}</span>
                    <span className="flex-shrink-0 font-light">⏳ 마감: {item.endDate}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      
    </div>
  );
}
