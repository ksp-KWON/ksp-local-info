import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const alt = '의정부 생활정보 포털';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
              fontSize: '64px',
              fontWeight: '900',
              color: '#1a73e8',
              marginBottom: '40px',
            }}
          >
            의정부 생활정보
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#111827',
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            시민들을 위한 혜택 및 공공데이터 가이드
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
