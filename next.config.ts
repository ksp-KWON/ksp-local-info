import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
