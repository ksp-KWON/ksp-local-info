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

  return (
    <div className="w-full pb-8 space-y-10">
      
      {/* 1. 상단 인트로 배너 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xs">
        <h2 className="text-xl md:text-2xl font-bold mb-2">의정부 주민 맞춤형 건강·혜택 가이드 🏥</h2>
        <p className="text-sm md:text-base text-blue-100 max-w-2xl leading-relaxed">
          지역 주요 병원 정보, 의료 혜택, 유아 및 청년 지원금부터 동네 문화 행사 소식까지 의정부의 모든 유용한 정보를 편리하게 찾아보세요.
        </p>
        <div className="mt-4 text-xs text-blue-200">
          마지막 업데이트 : {data.lastUpdated || '2026-05-29'}
        </div>
      </div>

      {/* 2. 병원 리스트 정보 섹션 */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-blue-600">🏥</span> 의정부 주요 의료기관 및 병원 안내
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital) => (
            <div 
              key={hospital.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-500 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[16px] text-slate-800 dark:text-slate-100">{hospital.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    hospital.treated 
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}>
                    {hospital.treated ? '포스팅 발행 완료 📝' : '발행 대기 중 ⏳'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{hospital.notes}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[12px] space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">📞</span> 
                  <span className="font-mono">{hospital.tel}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[10px] text-slate-400">📍</span>
                  <span className="truncate">{hospital.address}</span>
                </div>
              </div>
            </div>
          ))}
          {hospitals.length === 0 && (
            <p className="text-sm text-slate-400 col-span-3 text-center py-6">등록된 병원 정보가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 광고 영역 */}
      <div>
        <AdBanner slot="home-middle-ad" />
      </div>

      {/* 3. 우리동네 축제·행사 */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-blue-600">🎪</span> 우리동네 주요 축제 및 행사 정보
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="group flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 h-[110px] rounded-2xl shadow-xs"
              >
                <div className="w-[80px] flex-shrink-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 transition-colors flex items-center justify-center">
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎉</span>
                </div>
                <div className="flex flex-col p-4 flex-1 justify-between min-w-0">
                  <h4 className="text-[14px] text-slate-800 dark:text-slate-200 font-bold line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="truncate pr-2">📍 {item.location}</span>
                    <span className="flex-shrink-0">🗓 {item.startDate.substring(0, 5)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 4. 유용한 지원금·혜택 */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-blue-600">🎁</span> 놓치면 아쉬운 복지 지원금 및 혜택
        </h3>
        <div className="flex flex-col gap-4">
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
                className="group flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 rounded-2xl shadow-xs"
              >
                <div className="hidden sm:flex w-[100px] flex-shrink-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 flex-col items-center justify-center p-2 text-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 transition-colors">
                   <span className="text-xl mb-1 grayscale group-hover:grayscale-0 transition-all">💰</span>
                   <span className="text-[10px] text-slate-400">복지 혜택</span>
                </div>
                <div className="flex flex-col p-5 flex-1">
                  <h4 className="text-[15px] text-slate-800 dark:text-slate-100 font-bold mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{item.summary}</p>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-auto">
                    <span className="truncate pr-2">🎯 대상: {item.target}</span>
                    <span className="flex-shrink-0">⏳ 마감: {item.endDate}</span>
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
