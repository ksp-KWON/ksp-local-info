'use client';

import PostCard from '@/components/ui/PostCard';
import SectionLayout from '@/components/ui/SectionLayout';
import AppIcon from '@/components/ui/AppIcon';
import { PostData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

export default function HomePostList({ initialPosts }: { initialPosts: PostData[] }) {
  const categoriesWithPosts = CATEGORIES.map((cat) => {
    const posts = initialPosts.filter((post) => {
      if (!post.category) return false;
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      return (
        cats.some((c) => c.includes(cat.name) || cat.keywords.some((keyword) => c.includes(keyword))) ||
        cats.some((c) => cat.keywords.some((kw) => kw === c))
      );
    });
    return { ...cat, posts };
  }).filter((item) => item.posts.length > 0);

  if (categoriesWithPosts.length === 0) return null;

  return (
    <div className="space-y-8 sm:space-y-10">
      {categoriesWithPosts.map((cat) => {
        const displayPosts = cat.posts.slice(0, 3);

        return (
          <SectionLayout
            key={cat.id}
            title={cat.name}
            description={cat.desc}
            icon={<AppIcon name={cat.iconName} size={22} strokeWidth={2.5} className="shrink-0" />}
            watermarkIcon={cat.watermarkIcon}
            viewAllLink={{
              href: `/blog?category=${encodeURIComponent(cat.name)}`,
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
