import { getPostData, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | 의정부시 생활 정보`,
    description: post.summary || `${post.title}에 관한 상세 정보입니다.`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      url: `https://ksp-local-info-edg.pages.dev/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);
  
  if (!post) {
    notFound();
  }

  // local-info.json에서 매칭되는 원문 링크 찾기
  let sourceLink = '';
  try {
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    if (fs.existsSync(localInfoPath)) {
      const data = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
      const items = [...(data.events || []), ...(data.benefits || [])];
      const matched = items.find(item => item.title === post.title);
      if (matched && matched.link && matched.link !== '#') {
        sourceLink = matched.link;
      }
    }
  } catch (e) {
    // Ignore error
  }

  // 1. BlogPosting 구조화 데이터
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary || `${post.title}에 관한 상세 정보입니다.`,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "의정부시 생활 정보"
    },
    "publisher": {
      "@type": "Organization",
      "name": "의정부시 생활 정보",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ksp-local-info-edg.pages.dev/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ksp-local-info-edg.pages.dev/blog/${slug}`
    }
  };

  // 2. BreadcrumbList 구조화 데이터
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://ksp-local-info-edg.pages.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "블로그",
        "item": "https://ksp-local-info-edg.pages.dev/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://ksp-local-info-edg.pages.dev/blog/${slug}`
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* JSON-LD 삽입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5f6368] hover:text-[#0090D6] transition-colors">
          <span>←</span> 목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300 relative">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] leading-[1.35] font-black tracking-tight text-[#202124] dark:text-[#e8eaed] mb-5 break-keep">{post.title}</h1>
          <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold flex flex-wrap gap-x-4 gap-y-1">
            <span>📅 작성일: {post.date}</span>
            {post.category && <span>📂 분류: {post.category}</span>}
            <span>🔄 최종 업데이트: {post.date}</span>
          </div>
          
          {/* 핵심 요약 박스 (디자인 사양 반영) */}
          {post.summary && (
            <div className="mt-6 bg-white/50 dark:bg-black/20 p-5 rounded-2xl border-l-[6px] border-l-[#0090D6] text-[#3c4043] dark:text-[#bdc1c6] text-sm leading-relaxed font-bold shadow-sm backdrop-blur-md">
              📌 핵심 요약 : {post.summary}
            </div>
          )}
        </div>

        {/* 마크다운 본문 영역 - **볼드** 전처리 후 rehype-raw로 HTML 통과 */}
        <div className="prose prose-indigo dark:prose-invert max-w-none
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#202124] dark:prose-headings:text-[#e8eaed] prose-headings:break-keep
          prose-p:text-[#3c4043] dark:prose-p:text-[#bdc1c6] prose-p:leading-[1.8] prose-p:my-5 prose-p:font-medium prose-p:break-keep
          prose-li:text-[#3c4043] dark:prose-li:text-[#bdc1c6] prose-li:my-2 prose-li:font-medium prose-li:leading-[1.8]
          prose-strong:text-[#202124] dark:prose-strong:text-[#e8eaed] prose-strong:font-black
          prose-hr:border-slate-200 dark:prose-hr:border-slate-700 prose-hr:my-8
          prose-a:text-[#0090D6] dark:prose-a:text-[#8ab4f8] prose-a:no-underline hover:prose-a:underline
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // del(취소선) 태그는 일반 텍스트로 표시
              del: ({ children }) => <span>{children}</span>,
              // hr 구분선 깔끔한 스타일
              hr: () => <hr className="my-8 border-0 border-t border-slate-200" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <hr className="my-10 border-slate-100" />

        {/* E-E-A-T 원문 출처 링크 영역 */}
        {sourceLink && (
          <div className="mb-6 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">🔗 공식 원문 출처</span>
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0090D6] hover:text-blue-700 font-bold underline break-all text-sm"
            >
              {sourceLink}
            </a>
          </div>
        )}

        {/* AI 작성 안내 문구 */}
        <div className="bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-2xl p-5 text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed mb-10 flex gap-2 shadow-sm font-medium">
          <span>💡</span>
          <p>
            이 포스팅은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-[#0090D6] dark:text-[#8ab4f8] hover:underline font-bold">data.go.kr</a>)의 공개 정보를 바탕으로 AI가 유익하고 이해하기 쉽게 정리한 글입니다. 정책 세부 조건 및 변경사항은 공식 출처 링크를 통해 다시 한번 확인해주시기 바랍니다.
          </p>
        </div>

        {/* 블로그 상세 하단 애드센스 광고 배너 */}
        <div className="my-8">
          <AdBanner slot="blog-bottom-ad" />
        </div>

        {/* 쿠팡 파트너스 배너 */}
        <CoupangBanner />

      </article>
    </div>
  );
}
