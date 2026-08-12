import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';
import AiCommentBox from '@/components/blog/AiCommentBox';
import Link from 'next/link';

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
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white dark:bg-[#1a1c20] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
        <div className="px-5 py-8 sm:px-10 sm:py-12 space-y-8">
          
          <header className="border-b border-gray-100 dark:border-gray-800 pb-8 mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-5">
              {Array.isArray(post.category) ? post.category.map(cat => (
                <span key={cat} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-semibold">{cat}</span>
              )) : post.category && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-semibold">{post.category as string}</span>
              )}
              <time dateTime={post.date} className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center gap-1.5 ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {post.date}
              </time>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-snug">
              {post.title}
            </h1>

            {post.summary && (
              <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-5 sm:p-6 text-[15px] sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                <strong className="text-amber-600 dark:text-amber-500 mr-2">핵심 요약</strong> {post.summary}
              </div>
            )}
          </header>

          <div className="mb-10">
            <AiCommentBox sourceText={post.content} type="policy" />
          </div>

          <div className="prose prose-indigo dark:prose-invert max-w-none font-medium prose-p:font-medium prose-li:font-medium prose-a:font-medium prose-table:w-full prose-table:table-auto prose-th:whitespace-nowrap">
            <MarkdownRenderer content={post.content} />
          </div>
          
          <hr className="my-12 border-gray-100 dark:border-gray-800" />

          {sourceLink && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50">
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <span className="text-xl">🔗</span> 공식 원문 출처
              </span>
              <a 
                href={sourceLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline font-bold break-all text-[14px]"
              >
                {sourceLink}
              </a>
            </div>
          )}

          {/* 관련된 의정부 혜택 추천 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-900/50 rounded-2xl p-6 sm:p-8 mb-10">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <span>🌟</span> 의정부 시민들이 많이 찾는 다른 혜택
            </h3>
            <ul className="space-y-3 text-[15px] font-medium">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <Link href="/blog" className="text-purple-700 dark:text-purple-400 hover:underline">의정부시 청년 및 신혼부부 전세자금 대출 이자 지원 안내</Link>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <Link href="/blog" className="text-purple-700 dark:text-purple-400 hover:underline">의정부사랑카드(지역화폐) 인센티브 혜택 완벽 가이드</Link>
              </li>
            </ul>
          </div>

          <div className="my-8">
            <AdBanner slot="blog-bottom-ad" />
          </div>
          <CoupangBanner />

        </div>
      </article>
    </div>
  );
}
