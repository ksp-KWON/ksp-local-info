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
    title: `${post.title} | 성남시 생활 정보`,
    description: post.summary || `${post.title}에 관한 상세 정보입니다.`,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      url: `https://ksp-local-info.pages.dev/blog/${slug}`,
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
      "name": "성남시 생활 정보"
    },
    "publisher": {
      "@type": "Organization",
      "name": "성남시 생활 정보",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ksp-local-info.pages.dev/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ksp-local-info.pages.dev/blog/${slug}`
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
        "item": "https://ksp-local-info.pages.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "블로그",
        "item": "https://ksp-local-info.pages.dev/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://ksp-local-info.pages.dev/blog/${slug}`
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
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
        <Link href="/blog" className="text-sky-600 hover:underline">← 목록으로 돌아가기</Link>
      </div>
      <article className="prose prose-sky lg:prose-lg max-w-none">
        <h1>{post.title}</h1>
        <div className="text-gray-500 mb-8 flex flex-wrap gap-x-4">
          <span>작성일: {post.date}</span>
          {post.category && <span>| 분류: {post.category}</span>}
          <span>| 최종 업데이트: {post.date}</span>
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>

        <hr className="my-8" />

        {/* E-E-A-T 원문 출처 링크 영역 */}
        {sourceLink && (
          <div className="mb-4 bg-sky-50 border border-sky-100 rounded-lg p-4">
            <span className="font-semibold text-gray-700 block mb-1">🔗 원문 출처</span>
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 hover:underline break-all"
            >
              {sourceLink}
            </a>
          </div>
        )}

        {/* AI 작성 안내 문구 */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-gray-600 mb-8">
          💡 이 글은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
        </div>

        {/* 블로그 상세 하단 애드센스 광고 배너 */}
        <AdBanner slot="blog-bottom-ad" />

        {/* 쿠팡 파트너스 배너 */}
        <CoupangBanner />

      </article>
    </div>
  );
}
