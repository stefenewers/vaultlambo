import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All imagery is local. No remote patterns are configured on purpose.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [{ source: '/sold', destination: '/sold-vehicles', permanent: true }];
  },
};

export default nextConfig;
