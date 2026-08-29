'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';
import PremiumHeading from '@/components/ui/PremiumHeading';
import PremiumCard from '@/components/ui/PremiumCard';
import AppIcon from '@/components/ui/AppIcon';
import { BLOG_TONE_TOKENS, getToneColor as getTokenTone, getKeywordTone, BlogTone } from '@/lib/blog-tokens';

const SCROLL_OFFSET = 140;

const extractTextFromNode = (n: any): string => {
  if (typeof n === 'string') return n;
  if (Array.isArray(n)) return n.map(extractTextFromNode).join('');
  if (n?.props?.children) return extractTextFromNode(n.props.children);
  return '';
};

// 수묵 헤딩 명도 매핑
const getHeadingBgClass = (level: number) => {
  switch (level) {
    case 2: return 'from-black/[0.08] via-black/[0.02] to-transparent dark:from-white/[0.12] dark:via-white/[0.03] to-transparent border-b-2 border-black dark:border-white';
    case 3: return 'from-black/[0.05] via-black/[0.015] to-transparent dark:from-white/[0.08] dark:via-white/[0.02] to-transparent border-b-2 border-zinc-700 dark:border-zinc-300';
    case 4:
    case 5: return 'from-black/[0.03] to-transparent dark:from-white/[0.05] to-transparent border-b border-zinc-400 dark:border-zinc-600';
    case 6: return 'from-black/[0.06] to-transparent dark:from-white/[0.09] to-transparent border-b-2 border-black dark:border-white';
    default: return 'from-black/[0.05] to-transparent dark:from-white/[0.08] to-transparent';
  }
};

const UnifiedHeadingRenderer = ({ level, children, id }: { level: 1|2|3|4|5|6, children?: React.ReactNode, id?: string }) => {
  const styles: Record<number, string> = {
    2: 'mt-14 mb-6 py-3',
    3: 'mt-10 mb-5 py-2.5',
    4: 'mt-8 mb-4 py-2',
    5: 'mt-6 mb-3 py-1.5',
    6: 'mt-6 mb-3 py-2',
  };

  return (
    <PremiumHeading 
      level={level as any} 
      id={id} 
      showLeftBorder 
      style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }} 
      className={`${styles[level] || styles[5]} pr-4 rounded-none break-keep bg-gradient-to-r ${getHeadingBgClass(level)} !text-black dark:!text-white font-black`}
    >
      {children}
    </PremiumHeading>
  );
};

// 인용구(Blockquote) 톤 컬러 결정 (blog-tokens 엔진과 100% 통합)
const getToneColor = (node: React.ReactNode): BlogTone => {
  const fullText = extractTextFromNode(node).trim();
  return getTokenTone(fullText);
};

// 표준 마크다운 컴포넌트 맵 (수묵화 墨 & 굵은 라인 SVG 모노톤)
export const sharedComponents: Components & Record<string, any> = {
  h1: ({ children, id }) => (
    <PremiumHeading level={1} id={id} style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }} className="mt-16 mb-8 pb-4 border-b-4 border-black dark:border-white break-keep !text-black dark:!text-white font-black">
      {children}
    </PremiumHeading>
  ),
  h2: (props) => <UnifiedHeadingRenderer level={2} {...props} />,
  h3: (props) => <UnifiedHeadingRenderer level={3} {...props} />,
  h4: (props) => <UnifiedHeadingRenderer level={4} {...props} />,
  h5: (props) => <UnifiedHeadingRenderer level={5} {...props} />,
  h6: (props) => <UnifiedHeadingRenderer level={6} {...props} />,

  p: ({ children }) => <p className="mb-4 leading-[1.85] text-zinc-900 dark:text-zinc-100 break-keep font-medium">{children}</p>,

  // 굵은 먹선 리스트
  ul: ({ children }) => <ul className="list-disc ml-5 sm:ml-6 my-5 space-y-2.5 text-[15.5px] sm:text-[16px] text-zinc-900 dark:text-zinc-100 marker:text-black dark:marker:text-white">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-5 sm:ml-6 my-5 space-y-2.5 text-[15.5px] sm:text-[16px] text-zinc-900 dark:text-zinc-100 marker:font-black marker:text-black dark:marker:text-white">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-[1.8] break-keep font-medium">{children}</li>,

  // 수묵화 농담(濃淡) 키워드 강조 (알록달록한 원색 대신 흑백 명도 하이라이트)
  strong: ({ children }) => {
    const text = extractTextFromNode(children).trim();
    const tone = getKeywordTone(text);
    const token = BLOG_TONE_TOKENS[tone] || BLOG_TONE_TOKENS.blue;
    return (
      <strong className={`${token.tailwind.highlightClass} font-black px-1.5 py-0.5 mx-0.5 rounded-none`}>
        {children}
      </strong>
    );
  },

  // 인용구 / 피드백 박스 (수묵화 2px 굵은 먹선 & 명도 그라데이션)
  blockquote: ({ children }: any) => {
    const tone: BlogTone = getToneColor(children);
    const token = BLOG_TONE_TOKENS[tone] || BLOG_TONE_TOKENS.blue;

    const childArray = React.Children.toArray(children);
    const firstChild = childArray[0];

    const isFirstChildHeading =
      React.isValidElement(firstChild) &&
      typeof firstChild.type === 'string' &&
      /^h[1-6]$/i.test(firstChild.type);

    if (isFirstChildHeading) {
      const headingElement = firstChild as React.ReactElement<any>;
      const headingChildren = headingElement.props.children;
      const bodyElements = childArray.slice(1);

      return (
        <div className={`my-8 bg-white dark:bg-[#181a1d] shadow-[4px_4px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] transition-all duration-200 relative overflow-hidden group border-2 ${token.tailwind.border} rounded-none`}>
          {/* 상단 수묵 명도 헤더 바 */}
          <div className={`px-5 sm:px-6 py-3 bg-gradient-to-r ${token.tailwind.headerGradient} relative z-10`}>
            <h3 className={`text-[15.5px] font-black flex items-center gap-2.5 tracking-tight !m-0 !p-0 border-0 bg-transparent ${token.tailwind.titleColor}`}>
              <AppIcon name="shield-alert" size={16} strokeWidth={2.5} className={token.tailwind.titleColor} />
              <span>{headingChildren}</span>
            </h3>
          </div>
          {/* 본문 영역 */}
          <div className="p-5 sm:p-6 text-[14.5px] sm:text-[15px] font-medium text-zinc-800 dark:text-zinc-200 leading-[1.75] tracking-tight [&>p]:mb-4 sm:[&>p]:mb-5 [&>p:last-child]:!mb-0 relative z-10 break-keep">
            {bodyElements}
          </div>
        </div>
      );
    }

    // 인라인 용어 사전 / 단순 인용구
    return (
      <div className={`my-8 bg-white dark:bg-[#181a1d] p-5 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] transition-all duration-200 relative overflow-hidden group border-2 ${token.tailwind.border} rounded-none`}>
        <div className="relative z-10 text-[14.5px] sm:text-[15px] font-medium text-zinc-800 dark:text-zinc-200 leading-[1.75] tracking-tight [&>p]:mb-4 sm:[&>p]:mb-5 [&>p:last-child]:!mb-0 break-keep">
          {children}
        </div>
      </div>
    );
  },

  // 굵은 2px 먹선 수묵 테이블 (Table)
  table: ({ children }: any) => (
    <div className="my-8">
      <PremiumCard hoverEffect={false} className="!p-0 overflow-x-auto shadow-[4px_4px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] rounded-none !border-2 !border-black dark:!border-white">
        <table className="w-full text-[13.5px] sm:text-[14px] border-collapse min-w-[500px] sm:min-w-full">{children}</table>
      </PremiumCard>
    </div>
  ),
  th: ({ children, style, ...props }: any) => (
    <th
      style={style}
      className="bg-zinc-100 dark:bg-zinc-850 p-3.5 font-black text-black dark:text-white border-b-2 border-black dark:border-white tracking-tight whitespace-nowrap text-center"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, style, ...props }: any) => (
    <td
      style={style}
      className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 align-middle text-zinc-900 dark:text-zinc-100 leading-relaxed text-left font-medium"
      {...props}
    >
      {children}
    </td>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors last:[&>td]:border-b-0">{children}</tr>
  ),

  a: ({ href = '', children }) => (
    <a
      href={href}
      className="text-black dark:text-white font-black underline underline-offset-4 decoration-2 decoration-black dark:decoration-white hover:opacity-75 transition-opacity mx-0.5 inline group"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      <span className="leading-snug">{children}</span>
      <AppIcon name="external-link" size={13} strokeWidth={2.5} className="inline-block align-baseline ml-1" />
    </a>
  ),

  hr: () => (
    <div className="my-14 flex justify-center">
      <div className="w-full h-0.5 bg-black dark:bg-white" />
    </div>
  ),

  pre: ({ children }) => (
    <pre className="whitespace-pre-wrap break-words bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-5 rounded-none border-2 border-black dark:border-white my-6 text-black dark:text-white font-sans text-[14.5px] sm:text-[15.5px] leading-relaxed shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] overflow-x-hidden">
      {children}
    </pre>
  ),

  code: ({ children, className }: any) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 mx-0.5 rounded-none bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-[0.9em] font-sans font-black border border-zinc-400 dark:border-zinc-600">
          {children}
        </code>
      );
    }
    return <code className="font-sans break-keep">{children}</code>;
  },

  // 커스텀 태그 지원 (수묵 명도 흑백 뱃지로 일괄 통일)
  calculator: () => null,
  red: ({ children }: { children?: React.ReactNode }) => <strong className="text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-black">{children}</strong>,
  orange: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-850 px-1.5 py-0.5 mx-0.5 rounded-none font-black">{children}</strong>,
  green: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-850 px-1.5 py-0.5 mx-0.5 rounded-none font-black">{children}</strong>,
  blue: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 mx-0.5 rounded-none font-bold">{children}</strong>,
  purple: ({ children }: { children?: React.ReactNode }) => <strong className="text-black dark:text-white bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-black">{children}</strong>,

  relatedbox: ({ children }: any) => (
    <PremiumCard borderColor="default" hoverEffect={true} className="my-10 group !border-2 !border-black dark:!border-white shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)]">
      <div className="relative z-10">
        <div className="border-b-2 border-black dark:border-white pb-3 mb-4">
          <PremiumHeading level={3} showLeftBorder className="!mb-0 !text-black dark:!text-white font-black">
            함께 읽으면 도움이 되는 글
          </PremiumHeading>
        </div>
        <ul className="space-y-3">
          {children}
        </ul>
      </div>
    </PremiumCard>
  ),

  calloutlink: ({ ...props }: any) => {
    const href = props.href || '';
    const text = props.text || '';
    return (
      <li className="flex items-start gap-2.5 group">
        <span className="text-black dark:text-white mt-0.5 font-black shrink-0">
          <AppIcon name="link" size={14} strokeWidth={2.5} />
        </span>
        <a
          href={href}
          className="flex-1 text-[14.5px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:underline underline-offset-4 leading-[1.7] break-keep transition-colors"
        >
          <span>{text}</span>
        </a>
      </li>
    );
  },
};

interface MarkdownRendererProps {
  content: string;
  inline?: boolean;
}

export default function MarkdownRenderer({ content, inline = false }: MarkdownRendererProps) {
  if (inline) {
    return (
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          p: ({ children }) => <>{children}</>,
          strong: sharedComponents.strong,
          a: sharedComponents.a,
          code: sharedComponents.code,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={sharedComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
