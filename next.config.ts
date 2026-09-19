import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // 정적 사이트로 빌드 (Cloudflare Pages 배포용)
  // 로컬 개발(isDev) 환경에서는 일반 서버 모드로 유연하게 구동
  output: isDev ? undefined : 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
