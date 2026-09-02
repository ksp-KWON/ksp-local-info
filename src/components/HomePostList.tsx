'use client';

import React from 'react';
import PostCard from '@/components/ui/PostCard';
import SectionLayout, { type SectionTheme } from '@/components/ui/SectionLayout';
import AppIcon, { type AppIconName } from '@/components/ui/AppIcon';
import { PostData } from '@/lib/types';

interface HomePostListProps {
  initialPosts: PostData[];
}

interface MasterChapter {
  id: string;
  title: string;
  desc: string;
  icon: AppIconName;
  watermarkIcon: AppIconName;
  categoryLink: string;
  theme: SectionTheme;
  keywords: string[];
}

const MASTER_CHAPTERS: MasterChapter[] = [
  {
    id: 'benefits-welfare',
    title: '맞춤 지원금 & 복지 혜택',
    desc: '의정부시 청년, 임산부, 주거, 취업 및 생활안정 지원금 소식입니다.',
    icon: 'bank',
    watermarkIcon: 'bank',
    categoryLink: '맞춤 지원금 찾기',
    theme: 'sky',
    keywords: ['지원금', '혜택', '복지', '장려금', '수당', '기본소득', '청년지원', '영아', '출산', '아이', '취업', '창업', '주거', '월세'],
  },
  {
    id: 'health-medical',
    title: '건강 & 안심 응급의료',
    desc: '달빛어린이병원, 공공심야약국 및 생애 무료 건강검진 정보입니다.',
    icon: 'hospital',
    watermarkIcon: 'hospital',
    categoryLink: '아플 때 든든하게',
    theme: 'emerald',
    keywords: ['건강', '의료', '병원', '보건', '진료', '약국', '검진', '응급', '달빛어린이병원', '심야약국'],
  },
  {
    id: 'culture-events',
    title: '문화 행사 & 축제 나들이',
    desc: '의정부 예술의전당 공연, 도서관 강좌, 버스킹 및 지역 축제 소식입니다.',
    icon: 'party-popper',
    watermarkIcon: 'compass',
    categoryLink: '이번 주 뭐하지?',
    theme: 'amber',
    keywords: ['행사', '축제', '문화', '공연', '콘서트', '전시', '도서관', '극장', '버스킹'],
  },
  {
    id: 'living-tips',
    title: '슬기로운 의정부 생활 백과',
    desc: '의정부사랑카드 가맹점 혜택, 경전철 교통 환승 및 행정복지센터 민원 꿀팁입니다.',
    icon: 'shield-check',
    watermarkIcon: 'shield-check',
    categoryLink: '알아두면 돈이되는 팁',
    theme: 'indigo',
    keywords: ['교통', '환경', '버스', '경전철', '환승', '민원', '생활', '팁', '시청', '주민센터', '사랑카드'],
  },
];

export default function HomePostList({ initialPosts }: HomePostListProps) {
  if (!initialPosts || initialPosts.length === 0) return null;

  // 1. 최신 발행 소식 (카테고리 불문 상위 3개)
  const latestPosts = initialPosts.slice(0, 3);

  // 2. 4대 마스터 챕터별 매핑
  const chaptersWithPosts = MASTER_CHAPTERS.map((chapter) => {
    const matched = initialPosts.filter((post) => {
      if (!post.category) return false;
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      const tags = Array.isArray(post.tags) ? post.tags : [];
      const allText = [...cats, ...tags, post.title].join(' ');

      return chapter.keywords.some((kw) => allText.includes(kw));
    });

    return {
      ...chapter,
      posts: matched.slice(0, 3),
    };
  }).filter((ch) => ch.posts.length > 0);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 🚀 [구역 B] 🌟 최신 의정부 생활 브리핑 🌟 */}
      {latestPosts.length > 0 && (
        <SectionLayout
          title="최신 의정부 생활 브리핑"
          description="오늘과 이번 주 의정부시에서 새로 발표된 지원금 및 시정 소식입니다."
          icon={<AppIcon name="sparkles" size={20} strokeWidth={2.5} />}
          watermarkIcon="sparkles"
          theme="blue"
          viewAllLink={{
            href: '/blog',
            text: '전체 소식 보기',
          }}
        >
          <div className="grid gap-3 sm:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} variant="grid" />
            ))}
          </div>
        </SectionLayout>
      )}

      {/* 🏛️ [구역 C] 4대 테마 핵심 마스터 챕터 섹션 🏛️ */}
      {chaptersWithPosts.map((chapter) => (
        <SectionLayout
          key={chapter.id}
          title={chapter.title}
          description={chapter.desc}
          icon={<AppIcon name={chapter.icon} size={20} strokeWidth={2.5} />}
          watermarkIcon={chapter.watermarkIcon}
          theme={chapter.theme}
          viewAllLink={{
            href: '/blog?category=' + encodeURIComponent(chapter.categoryLink),
            text: '더보기',
          }}
        >
          <div className="grid gap-3 sm:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chapter.posts.map((post) => (
              <PostCard key={post.slug} post={post} variant="grid" />
            ))}
          </div>
        </SectionLayout>
      ))}
    </div>
  );
}
