'use client';

import React, { useEffect, useState } from 'react';
import TableOfContents from './TableOfContents';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButtons from './ShareButtons';
import { parseBlogPost } from '@/lib/blog-utils';

const SCROLL_OFFSET = 140;

interface BlogPostClientProps {
  content: string;
  title: string;
  sourceLink?: string;
}

export default function BlogPostClient({ content, title, sourceLink }: BlogPostClientProps) {
  const [activeId, setActiveId] = useState('');
  const { opening, keyPoints, toc, sections } = parseBlogPost(content);

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

  return (
    <div className="space-y-6" data-blog-body>
      {/* 1. 도입부 서술 */}
      {opening && (
        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <MarkdownRenderer content={opening} />
        </div>
      )}

      {/* 2. 스마트 목차 (TOC) */}
      {toc && toc.length > 0 && (
        <TableOfContents toc={toc} activeId={activeId} onItemClick={handleTOCClick} />
      )}

      {/* 3. 본문 챕터들 */}
      {sections.map((section, idx) => (
        <div key={idx} className="prose prose-slate dark:prose-invert max-w-none text-[15px] sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <MarkdownRenderer content={section} />
        </div>
      ))}

      {/* 4. 원문 출처 (공식 공고) */}
      {sourceLink && (
        <div className="my-8 bg-blue-50 dark:bg-blue-900/10 p-5 border border-blue-100 dark:border-blue-900/50 rounded-none">
          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2 text-sm">
            <span className="text-blue-600 dark:text-blue-400">🔗</span> 의정부시 공식 원문 출처
          </span>
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline font-bold break-all text-[13.5px]"
          >
            {sourceLink}
          </a>
        </div>
      )}

      {/* 5. 원클릭 공유 & 링크 복사 바 */}
      <ShareButtons title={title} />
    </div>
  );
}
