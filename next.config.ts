import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All imagery is local and downloaded under a licence that permits it. No remote
    // patterns are configured on purpose — nothing on this site is hotlinked.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/sold', destination: '/sold-vehicles', permanent: true },

      /*
       * Completed vehicles moved from /inventory/<slug> to /sold-vehicles/<slug> when
       * inventory and the sold archive became separate collections. The Temerario was
       * the only published vehicle at that URL, so it is redirected by name rather
       * than with a wildcard that would swallow future inventory slugs.
       */
      {
        source: '/inventory/lamborghini-temerario-giallo-inti',
        destination: '/sold-vehicles/lamborghini-temerario-giallo-inti',
        permanent: true,
      },

      // Model briefs that used to sit in inventory now live in the sourcing catalogue.
      ...[
        'porsche-911-gt3-touring',
        'ferrari-296-gtb',
        'mclaren-artura',
        'mercedes-amg-g-63',
        'bmw-m3-cs',
      ].map((slug) => ({
        source: `/inventory/${slug}`,
        destination: `/sourcing/${slug}`,
        permanent: true,
      })),

      // Two briefs were also renamed when they moved.
      {
        source: '/inventory/bentley-continental-gt-speed',
        destination: '/sourcing/bentley-continental-gt',
        permanent: true,
      },
      {
        source: '/inventory/land-rover-range-rover-sv',
        destination: '/sourcing/range-rover-sv',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
