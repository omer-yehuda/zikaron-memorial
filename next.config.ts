import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // required for Amplify SSR deployment
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  turbopack: {},
};

export default nextConfig;
