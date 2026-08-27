import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All imagery is local. No remote patterns are configured on purpose.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
