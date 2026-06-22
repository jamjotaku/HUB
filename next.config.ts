import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/HUB',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
