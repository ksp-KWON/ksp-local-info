'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';
import PremiumHeading from '@/components/ui/PremiumHeading';
import PremiumCard from '@/components/ui/PremiumCard';
import CommonBox from '@/components/blog/CommonBox';
import AppIcon from '@/components/ui/AppIcon';

const SCROLL_OFFSET = 140;

const extractTextFromNode = (n: any): string => {
  if (typeof n === 'string') return n;
  if (Array.isArray(n)) return n.map(extractTextFromNode).join('');
  if (n?.props?.children) return extractTextFromNode(n.props.children);
  return '';
};

const UnifiedHeadingRenderer = ({ level, children, id }: { level: 1|2|3|4|5|6, children?: React.ReactNode, id?: string }) => {
  return (
    <PremiumHeading 
      level={level} 
      id={id} 
      style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
    >
      {children}
    </PremiumHeading>
  );
};

export const sharedComponents: Components & Record<string, any> = {
  h1: ({ children, id }) => (
    <PremiumHeading level={1} id={id} style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}>
      {children}
    </PremiumHeading>
  ),
  h2: (props) => <UnifiedHeadingRenderer level={2} {...props} />,
  h3: (props) => <UnifiedHeadingRenderer level={3} {...props} />,
  h4: (props) => <UnifiedHeadingRenderer level={4} {...props} />,
  h5: (props) => <UnifiedHeadingRenderer level={5} {...props} />,
  h6: (props) => <UnifiedHeadingRenderer level={6} {...props} />,

  p: ({ children }) => (
    <p className="mb-4 leading-[1.85] text-zinc-800 dark:text-zinc-200 break-keep font-normal text-[15px] sm:text-[15.5px]">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="list-disc ml-5 sm:ml-6 my-5 space-y-2 text-[14.5px] sm:text-[15px] text-zinc-800 dark:text-zinc-200 marker:text-zinc-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-5 sm:ml-6 my-5 space-y-2 text-[14.5px] sm:text-[15px] text-zinc-800 dark:text-zinc-200 marker:font-bold marker:text-zinc-600 dark:marker:text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-[1.8] break-keep font-normal">{children}</li>,

  strong: ({ children }) => (
    <strong className="text-zinc-950 dark:text-white font-extrabold bg-zinc-100/90 dark:bg-zinc-800/80 px-1.5 py-0.5 mx-0.5 border-b-2 border-zinc-900 dark:border-zinc-100">
      {children}
    </strong>
  ),

  blockquote: ({ children }: any) => {
    const childArray = React.Children.toArray(children);

    const firstChild = childArray[0];

    const isFirstChildHeading =
      React.isValidElement(firstChild) &&
      typeof firstChild.type === 'string' &&
      /^h[1-6]$/i.test(firstChild.type);

    if (isFirstChildHeading) {
      const headingElement = firstChild as React.ReactElement<any>;
      const headingText = extractTextFromNode(headingElement.props.children);
      const bodyElements = childArray.slice(1);

      return (
        <CommonBox
          title={headingText}
          className="my-6"
        >
          {bodyElements}
        </CommonBox>
      );
    }

    return (
      <blockquote className="my-6 border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-2 bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 italic text-sm sm:text-base leading-relaxed">
        {children}
      </blockquote>
    );
  },

  table: ({ children }: any) => (
    <div className="not-prose my-8 overflow-x-auto border border-gray-200/90 dark:border-zinc-800 bg-white dark:bg-[#181a1d] shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)]">
      <table className="w-full text-[13.5px] sm:text-[14px] border-collapse min-w-[500px] sm:min-w-full m-0">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-gray-200/90 dark:border-zinc-800">{children}</thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">{children}</tbody>
  ),
  th: ({ children, style, ...props }: any) => (
    <th
      style={style}
      className="p-3 sm:p-3.5 font-bold text-zinc-900 dark:text-zinc-100 tracking-tight whitespace-nowrap text-center"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, style, ...props }: any) => (
    <td
      style={style}
      className="p-3 sm:p-3.5 align-middle text-zinc-700 dark:text-zinc-300 leading-relaxed text-left font-normal"
      {...props}
    >
      {children}
    </td>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">{children}</tr>
  ),

  a: ({ href = '', children }) => (
    <a
      href={href}
      className="text-sky-700 dark:text-sky-300 font-bold underline underline-offset-4 decoration-sky-300 dark:decoration-sky-700 hover:text-sky-900 dark:hover:text-sky-200 transition-colors mx-0.5 inline group"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      <span className="leading-snug">{children}</span>
      <AppIcon name="external-link" size={13} strokeWidth={2} className="inline-block align-baseline ml-1" />
    </a>
  ),

  hr: () => (
    <div className="my-12 flex justify-center">
      <div className="w-full h-px bg-gray-200 dark:bg-zinc-800" />
    </div>
  ),

  pre: ({ children }) => (
    <pre className="whitespace-pre-wrap break-words bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-5 rounded-none border border-gray-200/90 dark:border-zinc-800 my-6 text-zinc-800 dark:text-zinc-200 font-sans text-[14px] leading-relaxed overflow-x-hidden">
      {children}
    </pre>
  ),

  code: ({ children, className }: any) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 mx-0.5 rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[0.9em] font-sans font-bold border border-zinc-200 dark:border-zinc-700">
          {children}
        </code>
      );
    }
    return <code className="font-sans break-keep">{children}</code>;
  },

  calculator: () => null,
  red: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-bold border border-zinc-200 dark:border-zinc-700">{children}</strong>,
  orange: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-bold border border-zinc-200 dark:border-zinc-700">{children}</strong>,
  green: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-bold border border-zinc-200 dark:border-zinc-700">{children}</strong>,
  blue: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-bold border border-zinc-200 dark:border-zinc-700">{children}</strong>,
  purple: ({ children }: { children?: React.ReactNode }) => <strong className="text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 mx-0.5 rounded-none font-bold border border-zinc-200 dark:border-zinc-700">{children}</strong>,

  relatedbox: ({ children }: any) => (
    <PremiumCard borderColor="charcoal" hoverEffect={true} className="my-10 group">
      <div className="relative z-10">
        <div className="border-b border-gray-200/80 dark:border-zinc-800 pb-3 mb-4">
          <PremiumHeading level={3} showLeftBorder className="!mb-0 !text-zinc-900 dark:!text-zinc-100 font-bold !bg-transparent !p-0 !border-0 !shadow-none">
            함께 읽으면 유익한 글
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
        <span className="text-zinc-900 dark:text-zinc-100 mt-0.5 font-bold shrink-0">
          <AppIcon name="link" size={14} strokeWidth={2} />
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
