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
    <div className="w-full pb-8">
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
      
      {/* 1. 우리동네 축제·행사 (그리드 커버 스타일) */}
      <div className="mb-10">
        <h2 className="bg-[#555] text-white text-[15px] px-5 py-2.5 mx-0 mb-4 font-normal flex items-center">
          <span className="mr-2 text-xs">▼</span> 우리동네 축제·행사
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
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
                className="group flex bg-white border border-[#555] overflow-hidden hover:border-[#ff5544] transition-all duration-200 h-[120px] shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
              >
                {/* 썸네일 대용 아이콘 영역 */}
                <div className="w-[100px] flex-shrink-0 bg-[#eee] border-r border-[#ccc] group-hover:bg-[#ddd] transition-colors flex items-center justify-center">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🎉</span>
                </div>
                {/* 텍스트 영역 */}
                <div className="flex flex-col p-3 flex-1 justify-between min-w-0">
                  <div>
                    <h3 className="text-[15px] text-[#111] font-medium line-clamp-2 leading-snug group-hover:text-[#ff5544] transition-colors">{item.title}</h3>
                  </div>
                  <div className="flex justify-between items-end text-[13px] text-[#777]">
                    <span className="truncate pr-1"><span className="text-xs mr-0.5">📍</span>{item.location}</span>
                    <span className="flex-shrink-0"><span className="text-xs mr-0.5">🗓</span>{item.startDate.substring(0, 5)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="my-10 px-1">
        <AdBanner slot="home-middle-ad" />
      </div>

      {/* 2. 유용한 지원금·혜택 (리스트 커버 스타일) */}
      <div className="mb-10">
        <h2 className="bg-[#555] text-white text-[15px] px-5 py-2.5 mx-0 mb-4 font-normal flex items-center">
          <span className="mr-2 text-xs">▼</span> 놓치면 아쉬운 지원금·혜택
        </h2>
        
        <div className="flex flex-col gap-4 px-1">
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
                className="group flex bg-white border border-[#555] overflow-hidden hover:border-[#ff5544] transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
              >
                <div className="hidden sm:flex w-[120px] flex-shrink-0 bg-[#f9f9f9] border-r border-[#eee] flex-col items-center justify-center p-2 text-center group-hover:bg-[#f1f1f1] transition-colors">
                   <span className="text-2xl mb-1 grayscale group-hover:grayscale-0 transition-all">🎁</span>
                   <span className="text-[11px] text-[#999]">혜택 안내</span>
                </div>
                <div className="flex flex-col p-4 flex-1">
                  <h3 className="text-[16px] text-[#111] font-medium mb-1.5 group-hover:text-[#ff5544] transition-colors leading-snug">{item.title}</h3>
                  <p className="text-[14px] text-[#888] line-clamp-2 mb-3 leading-relaxed">{item.summary}</p>
                  
                  <div className="flex justify-between items-center text-[12px] text-[#777] border-t border-[#f0f0f0] pt-2 mt-auto">
                    <span className="truncate pr-2">🎯 대상: {item.target}</span>
                    <span className="flex-shrink-0">마감: {item.endDate}</span>
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
