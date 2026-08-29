import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog/BlogPostClient';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';
import AppIcon from '@/components/ui/AppIcon';
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
    return {
      title: '페이지를 찾을 수 없습니다 | 의정부 건강·생활 정보 포털',
    };
  }

  return {
    title: `${post.title} | 의정부 건강·생활 정보 포털`,
    description: post.summary || `${post.title}에 관한 상세 안내입니다.`,
    alternates: {
      canonical: `https://ksp-local-info-edg.pages.dev/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  const sourceLink = post.sourceLink || '';

  // 1. Google E-E-A-T BlogPosting & GovernmentService 스키마
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || `${post.title}에 관한 상세 안내입니다.`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: '의정부 건강·생활 정보 포털',
      url: 'https://ksp-local-info-edg.pages.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: '의정부 건강·생활 정보 포털',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ksp-local-info-edg.pages.dev/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ksp-local-info-edg.pages.dev/blog/${slug}`,
    },
  };

  // 2. BreadcrumbList 스키마
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://ksp-local-info-edg.pages.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '생활 소식 및 혜택',
        item: 'https://ksp-local-info-edg.pages.dev/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://ksp-local-info-edg.pages.dev/blog/${slug}`,
      },
    ],
  };

  // 3. FAQPage 스키마 (구글 검색결과 FAQ 리치 스니펫)
  const faqRegex = /(?:###\s*(?:[💡❓\s]*)?Q[.:]|\*\*Q[.:]\*\*|Q\s*[:：])\s*([\s\S]*?)\n+(?:A\s*[:：]|\*\*A[.:]\*\*|\s*[-*])\s*([\s\S]*?)(?=\n+(?:###\s*Q|Q\s*[:：]|\*\*Q)|$)/gi;
  const faqMatches = [...post.content.matchAll(faqRegex)];
  let faqSchema = null;

  if (faqMatches.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqMatches.map((match) => ({
        '@type': 'Question',
        name: match[1].trim().replace(/\*\*/g, ''),
        acceptedAnswer: {
          '@type': 'Answer',
          text: match[2].trim().replace(/\*\*/g, ''),
        },
      })),
    };
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* 상단 네비게이션 브레드크럼 */}
      <nav className="mb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <AppIcon name="chevron-left" size={16} strokeWidth={2} />
          <span>전체 생활 소식 목록</span>
        </Link>
      </nav>

      <article className="bg-white dark:bg-[#181a1d] rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45)] border border-gray-200/90 dark:border-zinc-800 overflow-hidden relative">
        <div className="px-5 py-8 sm:px-10 sm:py-12 space-y-8">
          {/* 아티클 헤더 */}
          <header className="border-b border-gray-100 dark:border-zinc-800 pb-8">
            <div className="flex flex-wrap items-center gap-2.5 text-xs mb-4">
              {Array.isArray(post.category) ? (
                post.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-none bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-2xs"
                  >
                    {cat.replace(/^[^\s]+\s/, '')}
                  </span>
                ))
              ) : post.category ? (
                <span className="px-2.5 py-1 rounded-none bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-2xs">
                  {(post.category as string).replace(/^[^\s]+\s/, '')}
                </span>
              ) : null}
              <time dateTime={post.date} className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide flex items-center gap-1 ml-auto">
                <AppIcon name="calendar" size={14} strokeWidth={2} />
                <span>{post.date}</span>
              </time>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.3] break-keep">
              {post.title}
            </h1>
          </header>

          {/* 블로그 본문 (TOC & Markdown & ShareButtons 일체화) */}
          <BlogPostClient content={post.content} title={post.title} sourceLink={sourceLink} />

          {/* 하단 광고 배너 */}
          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
            <div className="my-6">
              <AdBanner slot="blog-bottom-ad" />
            </div>
            <CoupangBanner />
          </div>
        </div>
      </article>
    </div>
  );
}
