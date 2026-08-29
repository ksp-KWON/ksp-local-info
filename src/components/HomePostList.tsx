'use client';

import PostCard from '@/components/ui/PostCard';
import SectionLayout from '@/components/ui/SectionLayout';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface CategoryConfig {
  id: string;
  label: string;
  iconName: AppIconName;
  watermarkIcon: AppIconName;
  desc: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  benefits: {
    id: 'benefits',
    label: '💸 숨은 지원금 찾기',
    iconName: 'bank',
    watermarkIcon: 'bank',
    desc: '의정부시와 경기도에서 지원하는 청년·주거·생활 안정 지원금 소식입니다.',
  },
  jobs: {
    id: 'jobs',
    label: '💼 취업과 창업',
    iconName: 'trending-up',
    watermarkIcon: 'trending-up',
    desc: '의정부 일자리 박람회, 청년 면접 지원, 창업 인큐베이팅 공고를 모았습니다.',
  },
  family: {
    id: 'family',
    label: '👨‍👩‍👧 아이와 임산부',
    iconName: 'heart',
    watermarkIcon: 'heart',
    desc: '출산축하금, 첫만남이용권, 육아 돌봄 서비스 등 가족을 위한 혜택입니다.',
  },
  health: {
    id: 'health',
    label: '🏥 아플 때 & 병원',
    iconName: 'hospital',
    watermarkIcon: 'hospital',
    desc: '달빛어린이병원, 심야약국, 무료 건강검진 등 필수 응급의료 안내입니다.',
  },
  life: {
    id: 'life',
    label: '☕ 생활 & 즐길거리',
    iconName: 'leaf',
    watermarkIcon: 'leaf',
    desc: '의정부 행복로 버스킹, 도서관 북콘서트, 시립극장 문화예술 행사입니다.',
  },
};

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {
  const categoriesWithPosts = CATEGORIES.map((cat) => {
    const posts = initialPosts.filter((post) => {
      if (!post.category || !Array.isArray(post.category)) return false;
      const cats = post.category as string[];
      return cat.keywords.some((keyword) => cats.some((c) => c.includes(keyword)));
    });
    return { categoryId: cat.id, categoryLabel: cat.label, posts };
  }).filter((item) => item.posts.length > 0);

  if (categoriesWithPosts.length === 0) return null;

  return (
    <div className="space-y-8 sm:space-y-10">
      {categoriesWithPosts.map(({ categoryId, categoryLabel, posts }) => {
        const config = CATEGORY_CONFIGS[categoryId] || {
          id: categoryId,
          label: categoryLabel,
          iconName: 'list' as AppIconName,
          watermarkIcon: 'list' as AppIconName,
          desc: '의정부시와 관련된 유용한 실생활 혜택 안내입니다.',
        };

        const displayPosts = posts.slice(0, 3);

        return (
          <SectionLayout
            key={categoryId}
            title={categoryLabel.replace(/^[^\s]+\s/, '')}
            description={config.desc}
            icon={<AppIcon name={config.iconName} size={22} strokeWidth={2.5} className="shrink-0" />}
            watermarkIcon={config.watermarkIcon}
            viewAllLink={{
              href: `/blog?category=${encodeURIComponent(categoryLabel)}`,
              text: '전체보기',
            }}
          >
            {/* 게시물 그리드 (모던 수묵 & 굵은 라인 피니시) */}
            <div className="grid gap-3 sm:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="grid" />
              ))}
            </div>
          </SectionLayout>
        );
      })}
    </div>
  );
}
