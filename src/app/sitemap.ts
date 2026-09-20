import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { EMERGENCY_PLACES } from '@/lib/data/emergency-places';

export const dynamic = 'force-static';

// 사이트 론칭 기준일 (정적 페이지용 안정적인 lastModified)
const SITE_LAUNCH_DATE = '2026-01-01';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ksp-local-info-edg.pages.dev';

  // 1. 핵심 서비스 및 공공 안내 정적 라우트
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/services/emergency`,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/services/local-currency`,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/services/health-check`,
      lastModified: SITE_LAUNCH_DATE,
    },
    // Google E-E-A-T 신뢰도 & 투명성 필수 페이지
    {
      url: `${baseUrl}/about`,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: SITE_LAUNCH_DATE,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: SITE_LAUNCH_DATE,
    },
  ];

  // 2. 의정부 응급의료기관 및 심야약국 상세 페이지
  const emergencyPlaceRoutes: MetadataRoute.Sitemap = EMERGENCY_PLACES.map((place) => ({
    url: `${baseUrl}/services/emergency/${place.slug}`,
    lastModified: SITE_LAUNCH_DATE,
  }));

  // 3. 블로그 상세 페이지들 (실제 포스트 발행일 및 수정일 반영)
  const posts = getSortedPostsData();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.date || SITE_LAUNCH_DATE,
  }));

  return [...routes, ...emergencyPlaceRoutes, ...postRoutes];
}
