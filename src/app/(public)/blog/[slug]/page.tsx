import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog/BlogPostClient';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';
import AiCommentBox from '@/components/blog/AiCommentBox';
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
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <AppIcon name="chevron-left" size={16} strokeWidth={2.5} />
          <span>전체 생활 소식 목록</span>
        </Link>
      </nav>

      <article className="bg-white dark:bg-[#181a1d] rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.9)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.9)] border-2 border-black dark:border-white overflow-hidden relative">
        <div className="px-5 py-8 sm:px-10 sm:py-12 space-y-8">
          {/* 아티클 헤더 (수묵 모노톤 굵은 선 룩) */}
          <header className="border-b-2 border-black dark:border-white pb-8">
            <div className="flex flex-wrap items-center gap-2.5 text-xs mb-4">
              {Array.isArray(post.category) ? (
                post.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-none bg-black text-white dark:bg-white dark:text-black font-black border border-black dark:border-white"
                  >
                    {cat.replace(/^[^\s]+\s/, '')}
                  </span>
                ))
              ) : post.category ? (
                <span className="px-2.5 py-1 rounded-none bg-black text-white dark:bg-white dark:text-black font-black border border-black dark:border-white">
                  {(post.category as string).replace(/^[^\s]+\s/, '')}
                </span>
              ) : null}
              <time dateTime={post.date} className="text-zinc-500 dark:text-zinc-400 font-bold tracking-wide flex items-center gap-1 ml-auto">
                <AppIcon name="calendar" size={14} strokeWidth={2.5} />
                <span>{post.date}</span>
              </time>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black dark:text-white leading-[1.3] break-keep">
              {post.title}
            </h1>
          </header>

          {/* AI 핵심 요약 노트 */}
          <div>
            <AiCommentBox sourceText={post.content} type="policy" />
          </div>

          {/* 블로그 본문 (TOC & Markdown & ShareButtons 일체화) */}
          <BlogPostClient content={post.content} title={post.title} sourceLink={sourceLink} />

          {/* 하단 추천 혜택 박스 (수묵 2px 굵은 먹선) */}
          <div className="pt-6 border-t-2 border-zinc-200 dark:border-zinc-800">
            <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-white rounded-none p-6 sm:p-7 mb-8 shadow-[2px_2px_0px_rgba(0,0,0,0.06)]">
              <h3 className="font-black text-base mb-3 flex items-center gap-2 text-black dark:text-white">
                <AppIcon name="shield-check" size={18} strokeWidth={2.5} />
                <span>의정부 시민들이 함께 확인한 지원 혜택</span>
              </h3>
              <ul className="space-y-2.5 text-sm font-bold">
                <li className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <span className="text-black dark:text-white">■</span>
                  <Link href="/services/emergency" className="hover:underline">
                    의정부 달빛어린이병원 & 심야약국 실시간 지도
                  </Link>
                </li>
                <li className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <span className="text-black dark:text-white">■</span>
                  <Link href="/services/local-currency" className="hover:underline">
                    의정부사랑카드(지역화폐) 가맹점 및 인센티브 혜택
                  </Link>
                </li>
                <li className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <span className="text-black dark:text-white">■</span>
                  <Link href="/blog" className="hover:underline">
                    의정부시 청년 및 신혼부부 복지 지원금 전체보기
                  </Link>
                </li>
              </ul>
            </div>

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
