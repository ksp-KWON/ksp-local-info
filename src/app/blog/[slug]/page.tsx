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
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <span>←</span> 목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xs">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4">{post.title}</h1>
          <div className="text-slate-400 text-xs font-semibold flex flex-wrap gap-x-4 gap-y-1">
            <span>📅 작성일: {post.date}</span>
            {post.category && <span>📂 분류: {post.category}</span>}
            <span>🔄 최종 업데이트: {post.date}</span>
          </div>
        </div>

        {/* 마크다운 본문 영역 스타일 가이드 적용 */}
        <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed prose-headings:font-extrabold prose-headings:text-slate-800 prose-p:my-4 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <hr className="my-10 border-slate-100" />

        {/* E-E-A-T 원문 출처 링크 영역 */}
        {sourceLink && (
          <div className="mb-6 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5">
            <span className="font-bold text-slate-700 block mb-2">🔗 공식 원문 출처</span>
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline break-all text-sm"
            >
              {sourceLink}
            </a>
          </div>
        )}

        {/* AI 작성 안내 문구 */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed mb-10 flex gap-2">
          <span>💡</span>
          <p>
            이 포스팅은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">data.go.kr</a>)의 공개 정보를 바탕으로 AI가 유익하고 이해하기 쉽게 정리한 글입니다. 정책 세부 조건 및 변경사항은 공식 출처 링크를 통해 다시 한번 확인해주시기 바랍니다.
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
