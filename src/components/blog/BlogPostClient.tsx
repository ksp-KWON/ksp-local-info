'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TableOfContents from './TableOfContents';
import CommonBox from './CommonBox';
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
        <CommonBox
          title={keyPointsTitle || '행정 핵심 요약 (3줄 브리핑)'}
          icon={<AppIcon name="file-text" size={18} strokeWidth={2.5} />}
        >
          <ul className="space-y-2.5 font-normal text-zinc-800 dark:text-zinc-200">
            {keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <AppIcon name="check" size={14} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100 mt-1 shrink-0" />
                <span className="leading-relaxed">
                  <MarkdownRenderer content={pt} inline />
                </span>
              </li>
            ))}
          </ul>
        </CommonBox>
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

      {/* ── [무기 4] 신청 자격 1분 자가진단 (체크리스트) ── */}
      {checklistItems && checklistItems.length > 0 && (
        <CommonBox
          title={checklistTitle || '신청 자격 1분 자가진단'}
          icon={
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
            />
          }
          headerRight={
            <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 dark:text-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700">
              {checklistTitle?.includes('관람')
                ? '관람안내'
                : checklistTitle?.includes('체크리스트')
                ? '체크리스트'
                : '자가진단'}
            </span>
          }
        >
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
                      ? 'bg-zinc-100/90 dark:bg-zinc-800/70 border-zinc-400 dark:border-zinc-600'
                      : 'bg-white dark:bg-[#181a1d] border-gray-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className={`w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${isChecked ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950' : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'}`}>
                    {isChecked && <AppIcon name="check" size={14} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium break-keep leading-snug ${isChecked ? 'text-zinc-900 dark:text-zinc-100 font-bold line-through opacity-70' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {cleanItem}
                  </span>
                </button>
              );
            })}
          </div>
        </CommonBox>
      )}

      {/* ── [무기 5] 자주 묻는 질문 (FAQ 아코디언) ── */}
      {faqItems && faqItems.length > 0 && (
        <CommonBox
          title="자주 묻는 질문 (FAQ)"
          icon={<AppIcon name="chat" size={18} strokeWidth={2.5} />}
        >
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
                      <span className="px-1.5 py-0.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-extrabold border border-zinc-900 dark:border-zinc-100">Q</span>
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
        </CommonBox>
      )}

      {/* ── [무기 6] 원스톱 공식 신청처 안내 배너 (흑요석 프리미엄 CTA) ── */}
      {sourceLink && (
        <div className="my-8 relative overflow-hidden rounded-none border border-zinc-900 dark:border-zinc-700 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 dark:from-zinc-900 dark:via-[#181a1d] dark:to-zinc-950 text-white p-5 sm:p-7 shadow-[0_0_20px_rgba(0,0,0,0.12)] dark:shadow-[0_0_25px_rgba(0,0,0,0.60)] hover:shadow-[0_0_40px_rgba(0,0,0,0.25),0_0_15px_rgba(0,0,0,0.15)] transition-all duration-300 group">
          <div className="absolute right-3.5 bottom-1.5 opacity-5 text-white pointer-events-none group-hover:scale-105 transition-transform duration-500">
            <AppIcon name="external-link" size={90} strokeWidth={1.5} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 text-zinc-200 text-[11px] font-bold border border-white/20">
                <AppIcon name="shield-check" size={12} strokeWidth={2.5} />
                <span>의정부시 공식 접수처</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                원스톱 공식 신청 및 상세 공고 안내
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
                상세 접수 일정 및 추가 구비서류 공고 사항은 공식 접수처에서 바로 확인하세요.
              </p>
            </div>
            <a
              href={sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-xs sm:text-sm transition-all duration-200 shrink-0 w-full sm:w-auto shadow-md hover:shadow-lg rounded-none group/btn"
            >
              <span>공식 접수처 바로가기</span>
              <AppIcon name="chevron-right" size={14} strokeWidth={3} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {/* ── [무기 7] 내 주변 생활 지도 퀵메뉴 ── */}
      <div className="my-8 pt-6 border-t border-gray-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <AppIcon name="compass" size={15} strokeWidth={2.5} />
          <span>의정부 시민 내 주변 생활 지도 퀵메뉴</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/services/emergency"
            className="p-4 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px] rounded-none"
          >
            <div className="flex items-center gap-2 font-extrabold text-xs text-zinc-950 dark:text-zinc-100">
              <AppIcon name="hospital" size={16} strokeWidth={2.5} className="text-zinc-700 dark:text-zinc-300" />
              <span>달빛병원·심야약국</span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white flex items-center justify-between mt-2 transition-colors">
              <span>야간·휴일 응급의료</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/local-currency"
            className="p-4 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px] rounded-none"
          >
            <div className="flex items-center gap-2 font-extrabold text-xs text-zinc-950 dark:text-zinc-100">
              <AppIcon name="bank" size={16} strokeWidth={2.5} className="text-zinc-700 dark:text-zinc-300" />
              <span>사랑카드 가맹점</span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white flex items-center justify-between mt-2 transition-colors">
              <span>지역화폐 가맹점 검색</span>
              <AppIcon name="chevron-right" size={12} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/health-check"
            className="p-4 bg-white dark:bg-[#181a1d] border border-gray-200/90 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] hover:shadow-[0_0_40px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.70),0_0_15px_rgba(0,0,0,0.50)] hover:-translate-y-1 group flex flex-col justify-between min-h-[95px] rounded-none"
          >
            <div className="flex items-center gap-2 font-extrabold text-xs text-zinc-950 dark:text-zinc-100">
              <AppIcon name="stethoscope" size={16} strokeWidth={2.5} className="text-zinc-700 dark:text-zinc-300" />
              <span>국가 건강검진 기관</span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white flex items-center justify-between mt-2 transition-colors">
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
