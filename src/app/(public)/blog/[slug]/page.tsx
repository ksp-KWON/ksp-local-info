import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog/BlogPostClient';
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
      title: '페이지를 찾을 수 없습니다',
    };
  }

  return {
    title: post.title,
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
    <div className="w-full space-y-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* 상단 네비게이션 브레드크럼 */}
      <nav className="mb-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <AppIcon name="chevron-left" size={16} strokeWidth={2} />
          <span>전체 생활 소식 목록</span>
        </Link>
      </nav>

      {/* 메인 칼럼 아티클 (부모 SmartStickyLayout 73% 본문 폭에 100% 핏, 보상스쿨 동기화) */}
      <article className="w-full bg-white dark:bg-[#181a1d] rounded-none shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.50)] border border-gray-200/90 dark:border-zinc-800 overflow-hidden relative">
        <div className="px-3.5 py-6 sm:px-8 sm:py-9 space-y-7">
          {/* 아티클 헤더 (구역 1: 카테고리/날짜 메타, 구역 2: H1 타이틀, 구역 3: 포스트 요약 리드문) */}
          <header className="border-b border-gray-100 dark:border-zinc-800 pb-7">
            <div className="flex flex-wrap items-center gap-2.5 text-xs mb-3.5">
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

            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-extrabold tracking-tight text-zinc-950 dark:text-white leading-snug break-keep">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-[14.5px] sm:text-[15.5px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-3.5 pt-3.5 border-t border-gray-100/80 dark:border-zinc-800/80 break-keep">
                {post.summary}
              </p>
            )}
          </header>

          {/* 블로그 본문 (TOC & Markdown & ShareButtons & Tags 일체화) */}
          <BlogPostClient content={post.content} title={post.title} sourceLink={sourceLink} tags={post.tags} />
        </div>
      </article>
    </div>
  );
}
