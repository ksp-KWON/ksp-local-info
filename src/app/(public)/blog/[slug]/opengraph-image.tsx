import { ImageResponse } from 'next/og';
import { getSortedPostsData, getPostData } from '@/lib/posts';

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({ slug: post.slug }));
}

export const alt = '의정부 혜택 & 생활정보';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);
  const title = post?.title || '의정부 시민들을 위한 맞춤 혜택 가이드';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a73e8',
          backgroundImage: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            width: '100%',
            height: '100%',
            borderRadius: '40px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1a73e8',
              marginBottom: '40px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            의정부 정책 및 혜택 알리미
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#111827',
              textAlign: 'center',
              lineHeight: 1.3,
              wordBreak: 'keep-all',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
