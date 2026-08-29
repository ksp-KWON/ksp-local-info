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
  const { opening, keyPoints, checklistItems, faqItems, toc, sections } = parseBlogPost(content);

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
      {/* ── [무기 1] 시정 핵심 요약 (3줄 브리핑) ── */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="my-6 bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 pb-3 mb-3.5 border-b-2 border-black dark:border-white font-black text-base text-black dark:text-white">
            <AppIcon name="file-text" size={18} strokeWidth={2.5} />
            <span>시정 핵심 요약 (3줄 브리핑)</span>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
            {keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="font-black text-black dark:text-white mt-0.5 shrink-0">■</span>
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

      {/* ── [무기 4] 신청 자격 1분 자가진단 (인터랙티브 체크리스트) ── */}
      {checklistItems && checklistItems.length > 0 && (
        <div className="my-8 bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black dark:border-white">
            <h3 className="font-black text-base sm:text-lg text-black dark:text-white flex items-center gap-2 m-0">
              <AppIcon name="shield-check" size={18} strokeWidth={2.5} />
              <span>신청 자격 1분 자가진단</span>
            </h3>
            <span className="text-xs font-black text-white bg-black dark:text-black dark:bg-white px-2 py-0.5 border border-black dark:border-white">
              자가점검표
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
                  className={`w-full text-left flex items-start gap-3 p-3 transition-all border-2 rounded-none cursor-pointer ${
                    isChecked
                      ? 'bg-zinc-100 dark:bg-zinc-850 border-black dark:border-white'
                      : 'bg-white dark:bg-[#181a1d] border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <div className={`w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center border-2 border-black dark:border-white ${isChecked ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-zinc-900'}`}>
                    {isChecked && <AppIcon name="check" size={14} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs sm:text-sm font-bold break-keep leading-snug ${isChecked ? 'text-black dark:text-white line-through opacity-75' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {cleanItem}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── [무기 5] 시민 자주 묻는 질문 (Civic FAQ 아코디언) ── */}
      {faqItems && faqItems.length > 0 && (
        <div className="my-8 bg-white dark:bg-[#181a1d] border-2 border-black dark:border-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-black dark:border-white font-black text-base sm:text-lg text-black dark:text-white">
            <AppIcon name="chat" size={18} strokeWidth={2.5} />
            <span>시민 자주 묻는 질문 (FAQ)</span>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all overflow-hidden rounded-none"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900/60 font-black text-xs sm:text-sm text-black dark:text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2 pr-2">
                      <span className="px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black">Q</span>
                      <span className="break-keep">{faq.q}</span>
                    </span>
                    <AppIcon
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      strokeWidth={2.5}
                      className="shrink-0 text-black dark:text-white"
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-[#181a1d] border-t-2 border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
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
        <div className="my-8 bg-zinc-50 dark:bg-zinc-900 p-5 sm:p-6 border-2 border-black dark:border-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-black text-black dark:text-white flex items-center gap-2 mb-1 text-sm sm:text-base">
              <AppIcon name="external-link" size={16} strokeWidth={2.5} />
              <span>의정부시 공식 신청처 및 관련 공고</span>
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              상세 접수 일정 및 추가 공고 사항은 공식 접수처에서 바로 확인하세요.
            </p>
          </div>
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black font-black text-xs border-2 border-black dark:border-white inline-flex items-center gap-1.5 hover:opacity-85 transition-opacity shrink-0 cursor-pointer"
          >
            <span>공식 접수처 바로가기</span>
            <AppIcon name="chevron-right" size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}

      {/* ── [무기 7] 내 주변 생활 지도 퀵메뉴 ── */}
      <div className="my-8 pt-4 border-t-2 border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/services/emergency"
            className="p-3.5 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] group flex flex-col justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-2 font-black text-xs text-black dark:text-white">
              <AppIcon name="hospital" size={16} strokeWidth={2.5} />
              <span>달빛병원·심야약국</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 flex items-center justify-between mt-2">
              <span>야간·휴일 응급의료</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/local-currency"
            className="p-3.5 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] group flex flex-col justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-2 font-black text-xs text-black dark:text-white">
              <AppIcon name="bank" size={16} strokeWidth={2.5} />
              <span>사랑카드 가맹점</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 flex items-center justify-between mt-2">
              <span>지역화폐 가맹점 검색</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/health-check"
            className="p-3.5 bg-white dark:bg-[#181a1d] border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] group flex flex-col justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-2 font-black text-xs text-black dark:text-white">
              <AppIcon name="stethoscope" size={16} strokeWidth={2.5} />
              <span>국가 건강검진 기관</span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 flex items-center justify-between mt-2">
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
