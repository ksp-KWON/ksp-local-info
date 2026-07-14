import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import AuthorBioCard from '@/components/blog/AuthorBioCard';
import AiCommentBox from '@/components/blog/AiCommentBox';

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
      const matched = items.find((item: {title: string, link: string}) => item.title === post.title);
      if (matched && matched.link && matched.link !== '#') {
        sourceLink = matched.link;
      }
    }
  } catch {
    // Ignore error
  }

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

  // FAQ 파싱 (Q: 질문 A: 답변 형식)
  const faqRegex = /Q:\s*([\s\S]*?)\n+A:\s*([\s\S]*?)(?=\n+Q:|$)/gi;
  const faqMatches = [...post.content.matchAll(faqRegex)];
  let faqSchema = null;

  if (faqMatches.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqMatches.map(match => ({
        "@type": "Question",
        "name": match[1].trim().replace(/\*\*/g, ''),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": match[2].trim().replace(/\*\*/g, '')
        }
      }))
    };
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mb-6">
        <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#5f6368] hover:text-[var(--google-blue)] transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white dark:bg-[#202124] border-2 border-black dark:border-white shadow-marker-blue transition-all duration-300 overflow-hidden relative">
        <div className="px-5 py-8 sm:px-10 sm:py-12 space-y-8">
          
          <header className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-5">
              {post.category && (
                <span className="px-2.5 py-1 font-bold rounded-none bg-gray-100 text-[#5f6368] dark:bg-[#303134] dark:text-[#9aa0a6] border border-transparent">
                  {post.category}
                </span>
              )}
              <time dateTime={post.date} className="text-[#5f6368] dark:text-[#9aa0a6] font-medium tracking-wide flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                작성일 {post.date}
              </time>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-dohyeon font-normal tracking-wide text-[#202124] dark:text-[#e8eaed] leading-snug break-keep">
              <span className="highlighter-blue px-1">{post.title}</span>
            </h1>

            {post.summary && (
              <div className="mt-8 bg-gray-50 dark:bg-[#303134] p-5 border-2 border-black dark:border-white shadow-marker-yellow text-black dark:text-white text-[14px] leading-relaxed font-bold">
                <span className="highlighter-yellow px-1">핵심 요약</span> : {post.summary}
              </div>
            )}
          </header>

          <div className="mb-10">
            <AiCommentBox sourceText={post.content} type="policy" />
          </div>

          <div className="prose prose-indigo dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
          
          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {sourceLink && (
            <div className="mb-6 bg-gray-50 dark:bg-[#303134] border-2 border-black dark:border-white p-5 shadow-marker-green">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-2"><span className="highlighter-green px-1">🔗 공식 원문 출처</span></span>
              <a 
                href={sourceLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1a73e8] hover:text-blue-700 font-bold underline break-all text-[14px]"
              >
                {sourceLink}
              </a>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-[#303134] border-2 border-black dark:border-white p-5 text-[13.5px] text-gray-700 dark:text-gray-300 leading-relaxed mb-10 flex gap-3 shadow-marker-pink font-medium">
            <span className="text-lg leading-none">💡</span>
            <p>
              이 포스팅은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-bold">data.go.kr</a>)의 공개 정보를 바탕으로 AI가 유익하고 이해하기 쉽게 정리한 글입니다. 정책 세부 조건 및 변경사항은 공식 출처 링크를 통해 다시 한번 확인해주시기 바랍니다.
            </p>
          </div>

          <AuthorBioCard />

          <div className="my-8">
            <AdBanner slot="blog-bottom-ad" />
          </div>
          <CoupangBanner />

        </div>
      </article>
    </div>
  );
}
