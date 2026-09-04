import React from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import { PostData } from '@/lib/types';

interface BlogSidebarProps {
  recentPosts?: PostData[];
}

export default function BlogSidebar({ recentPosts = [] }: BlogSidebarProps) {
  return (
    <aside className="hidden lg:block w-full lg:w-[27%] shrink-0">
      <div className="lg:sticky lg:top-[84px] space-y-6">
        {/* 1. 의정부 4대 생활 지도 퀵메뉴 */}
        <div className="bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] p-5 rounded-none">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-zinc-800">
            <AppIcon name="pin" size={16} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
            <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white tracking-tight">
              내 주변 생활 지도 퀵메뉴
            </h3>
          </div>
          <div className="space-y-2">
            <Link
              href="/services/health-check"
              className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-gray-200/70 dark:border-zinc-700/70 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                  <AppIcon name="hospital" size={15} strokeWidth={2} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                    달빛어린이병원
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    야간·휴일 소아청소년과
                  </div>
                </div>
              </div>
              <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/blog?category=의료·건강"
              className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-gray-200/70 dark:border-zinc-700/70 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                  <AppIcon name="pill" size={15} strokeWidth={2} className="text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                    공공심야약국
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    새벽 운영 당번약국 안내
                  </div>
                </div>
              </div>
              <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/services/health-check"
              className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-gray-200/70 dark:border-zinc-700/70 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                  <AppIcon name="stethoscope" size={15} strokeWidth={2} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                    국민건강검진기관
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    일반·암검진 지정병원 찾기
                  </div>
                </div>
              </div>
              <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/blog?category=생활·환경"
              className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-gray-200/70 dark:border-zinc-700/70 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                  <AppIcon name="bank" size={15} strokeWidth={2} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
                    의정부사랑카드 가맹점
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    지역화폐 인센티브 혜택
                  </div>
                </div>
              </div>
              <AppIcon name="chevron-right" size={14} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 2. 추천 생활 소식 (Recent Posts) */}
        {recentPosts.length > 0 && (
          <div className="bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] p-5 rounded-none">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-zinc-800">
              <AppIcon name="file-text" size={16} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
              <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white tracking-tight">
                주목할 의정부 소식
              </h3>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {recentPosts.map((p) => (
                <li key={p.slug} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block space-y-1"
                  >
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white line-clamp-2 leading-snug break-keep transition-colors">
                      {p.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <AppIcon name="calendar" size={11} strokeWidth={2} />
                      <span>{p.date}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. 의정부시 공식 포털 바로가기 */}
        <div className="bg-zinc-900 dark:bg-zinc-800 text-white p-5 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-2">
            <AppIcon name="external-link" size={16} strokeWidth={2.5} className="text-zinc-300" />
            <h3 className="text-sm font-extrabold tracking-tight">
              의정부 공식 민원 직통
            </h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed break-keep mb-3.5">
            복지·행정 신청 및 공식 민원 접수는 공공 포털을 통해 신속하게 진행하실 수 있습니다.
          </p>
          <div className="space-y-1.5">
            <a
              href="https://www.uijeongbu.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span>의정부시청 공식 포털</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={2.5} />
            </a>
            <a
              href="https://www.gov.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span>정부24 민원 서비스</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
