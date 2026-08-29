'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TableOfContents from './TableOfContents';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButtons from './ShareButtons';
import AppIcon from '@/components/ui/AppIcon';
import { parseBlogPost } from '@/lib/blog-utils';

const SCROLL_OFFSET = 140;

interface BlogPostClientProps {
  content: string;
  title: string;
  sourceLink?: string;
}

export default function BlogPostClient({ content, title, sourceLink }: BlogPostClientProps) {
  const [activeId, setActiveId] = useState('');
  const { opening, keyPoints, keyPointsTitle, checklistItems, checklistTitle, faqItems, toc, sections } = parseBlogPost(content);

  // [무기 4] 자가진단 체크리스트 인터랙티브 상태
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  // [무기 5] FAQ 아코디언 열림/닫힘 상태 (기본 첫 번째 항목 열림)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => {
      const headings = document.querySelectorAll('[data-blog-body] h2[id]');
      let current = '';
      headings.forEach((h) => {
        if (h.getBoundingClientRect().top < SCROLL_OFFSET + 10) current = h.id;
      });
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleTOCClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
        behavior: 'smooth',
      });
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-7" data-blog-body>
      {/* ── [무기 1] 행정 핵심 요약 (3줄 브리핑) ── */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="my-6 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-gray-100 dark:border-zinc-800 font-bold text-base text-zinc-900 dark:text-zinc-100">
            <AppIcon name="file-text" size={18} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400" />
            <span>{keyPointsTitle || '행정 핵심 요약 (3줄 브리핑)'}</span>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-[15px] font-normal text-zinc-800 dark:text-zinc-200">
            {keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                <span className="leading-relaxed">
                  <MarkdownRenderer content={pt} inline />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 오프닝 서술 문단 ── */}
      {opening && (
        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] sm:text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
          <MarkdownRenderer content={opening} />
        </div>
      )}

      {/* ── [무기 2] 시민 안내 목차 내비게이터 (TOC) ── */}
      {toc && toc.length > 0 && (
        <TableOfContents toc={toc} activeId={activeId} onItemClick={handleTOCClick} />
      )}

      {/* ── 본문 챕터 섹션들 ── */}
      {sections.map((section, idx) => (
        <div key={idx} className="prose prose-slate dark:prose-invert max-w-none text-[15px] sm:text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
          <MarkdownRenderer content={section} />
        </div>
      ))}

      {/* ── [무기 4] 신청 자격 / 관람 1분 체크리스트 (인터랙티브 체크리스트) ── */}
      {checklistItems && checklistItems.length > 0 && (
        <div className="my-8 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2 m-0">
              <AppIcon
                name={
                  checklistTitle?.includes('관람') || checklistTitle?.includes('축제')
                    ? 'sparkles'
                    : checklistTitle?.includes('응급') || checklistTitle?.includes('대처')
                    ? 'shield-alert'
                    : checklistTitle?.includes('검진')
                    ? 'stethoscope'
                    : 'shield-check'
                }
                size={18}
                strokeWidth={2.5}
                className="text-sky-600 dark:text-sky-400"
              />
              <span>{checklistTitle || '신청 자격 1분 자가진단'}</span>
            </h3>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/60 px-2.5 py-0.5 border border-sky-200 dark:border-sky-800">
              {checklistTitle?.includes('관람')
                ? '관람안내'
                : checklistTitle?.includes('체크리스트')
                ? '체크리스트'
                : '자가점검표'}
            </span>
          </div>
          <div className="space-y-2.5">
            {checklistItems.map((item, idx) => {
              const isChecked = !!checkedMap[idx];
              const cleanItem = item.replace(/^\[\s*\]\s*/, '').replace(/^\[x\]\s*/i, '');
              return (
                <button
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`w-full text-left flex items-start gap-3 p-3 transition-all border rounded-none cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-[#181a1d] border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className={`w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'}`}>
                    {isChecked && <AppIcon name="check" size={14} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium break-keep leading-snug ${isChecked ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-75' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {cleanItem}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── [무기 5] 자주 묻는 질문 (Civic FAQ 아코디언) ── */}
      {faqItems && faqItems.length > 0 && (
        <div className="my-8 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-zinc-800 font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
            <AppIcon name="chat" size={18} strokeWidth={2.5} className="text-amber-600 dark:text-amber-400" />
            <span>자주 묻는 질문 (FAQ)</span>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all overflow-hidden rounded-none"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-center justify-between p-3.5 bg-zinc-50/70 dark:bg-zinc-900/60 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 pr-2">
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800">Q</span>
                      <span className="break-keep">{faq.q}</span>
                    </span>
                    <AppIcon
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      strokeWidth={2.5}
                      className="shrink-0 text-zinc-600 dark:text-zinc-400"
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-[#181a1d] border-t border-gray-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      <p className="whitespace-pre-wrap">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── [무기 6] 원스톱 공식 신청처 안내 배너 ── */}
      {sourceLink && (
        <div className="my-8 bg-gradient-to-r from-blue-50/60 via-zinc-50/40 to-transparent dark:from-blue-950/20 dark:via-zinc-900/40 dark:to-transparent p-5 sm:p-6 border border-blue-200/80 dark:border-blue-900/40 shadow-[0_0_20px_rgba(3,105,161,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_50px_rgba(3,105,161,0.30),0_0_20px_rgba(3,105,161,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300">
          <div>
            <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <AppIcon name="external-link" size={16} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
              <span>의정부시 공식 신청처 및 관련 공고</span>
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
              상세 접수 일정 및 추가 공고 사항은 공식 접수처에서 바로 확인하세요.
            </p>
          </div>
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs border border-blue-600 inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <span>공식 접수처 바로가기</span>
            <AppIcon name="chevron-right" size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}

      {/* ── [무기 7] 내 주변 생활 지도 퀵메뉴 ── */}
      <div className="my-8 pt-4 border-t border-gray-200/80 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/services/emergency"
            className="p-4 bg-white dark:bg-[#181a1d] border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all duration-300 shadow-[0_0_20px_rgba(4,120,87,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(4,120,87,0.35),0_0_15px_rgba(4,120,87,0.18)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px]"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 dark:text-emerald-200">
              <AppIcon name="hospital" size={16} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400" />
              <span>달빛병원·심야약국</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-between mt-2">
              <span>야간·휴일 응급의료</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/local-currency"
            className="p-4 bg-white dark:bg-[#181a1d] border border-blue-200/80 dark:border-blue-900/40 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all duration-300 shadow-[0_0_20px_rgba(3,105,161,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(3,105,161,0.35),0_0_15px_rgba(3,105,161,0.18)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px]"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-blue-950 dark:text-blue-200">
              <AppIcon name="bank" size={16} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
              <span>사랑카드 가맹점</span>
            </div>
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400 flex items-center justify-between mt-2">
              <span>지역화폐 가맹점 검색</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/health-check"
            className="p-4 bg-white dark:bg-[#181a1d] border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all duration-300 shadow-[0_0_20px_rgba(180,83,9,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(180,83,9,0.35),0_0_15px_rgba(180,83,9,0.18)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px]"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-amber-950 dark:text-amber-200">
              <AppIcon name="stethoscope" size={16} strokeWidth={2.5} className="text-amber-600 dark:text-amber-400" />
              <span>국가 건강검진 기관</span>
            </div>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center justify-between mt-2">
              <span>지정 병·의원 지도</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* ── 원클릭 공유 & 링크 복사 바 ── */}
      <ShareButtons title={title} />
    </div>
  );
}
