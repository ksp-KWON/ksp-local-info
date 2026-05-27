import { MetadataRoute } from 'next';
import { getSortedPostsData } from '../lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ksp-local-info-edg.pages.dev'; // Cloudflare Pages 배포 도메인

  // 1. 기본 페이지
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // 2. 블로그 상세 페이지들
  const posts = getSortedPostsData();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}
