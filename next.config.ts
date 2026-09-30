import type { NextConfig } from 'next';
import { embedFrameOrigins } from './src/content/media-embed';

/**
 * Content Security Policy.
 *
 * Kept deliberately tight because this site loads nothing from anywhere else: all
 * imagery is local, there is no analytics, no embeds, no third-party fonts at runtime
 * (next/font self-hosts them at build time) and no external scripts.
 *
 * `'unsafe-inline'` on style-src is required by Next.js, which injects inline styles
 * for streaming and for next/image. `'unsafe-inline'` on script-src is required for
 * the framework's inline bootstrap; a nonce-based policy needs middleware on every
 * request, which is not worth the cost on a fully static site with no user content
 * rendered as markup.
 *
 * `frame-ancestors 'none'` is what actually prevents framing — it supersedes
 * X-Frame-Options and covers the same attack.
 *
 * `next dev` alone gets two relaxations, and the production header is unchanged:
 * `'unsafe-eval'`, because the dev runtime evaluates modules for fast refresh; and no
 * `upgrade-insecure-requests`, because the dev server is plain http and some browsers
 * (Safari on localhost, any browser on a LAN address) would otherwise rewrite every
 * stylesheet, script and image request to an https origin that does not exist.
 */
const IS_DEV = process.env.NODE_ENV === 'development';

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  IS_DEV ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "media-src 'self'",
  /*
   * Closed unless a brand film is deliberately configured as a YouTube or Vimeo embed
   * in src/content/media-embed.ts, and then open to that one player origin only.
   */
  `frame-src ${embedFrameOrigins().length > 0 ? embedFrameOrigins().join(' ') : "'none'"}`,
  ...(IS_DEV ? [] : ['upgrade-insecure-requests']),
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  /* Nothing here needs a camera, a microphone or a location. Turn them all off. */
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  /* Belt and braces alongside frame-ancestors, for anything that predates CSP 2. */
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All imagery is local and downloaded under a licence that permits it. No remote
    // patterns are configured on purpose — nothing on this site is hotlinked.
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      /*
       * The enquiry endpoint must never be cached: a cached 200 would show a success
       * state for a message that was delivered once, to somebody else.
       */
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },

  async redirects() {
    /*
     * The completed-vehicle archive has moved twice. Both previous paths are kept
     * alive rather than broken, because the Temerario page is the one URL on this site
     * likely to have been shared.
     *
     *   /sold           →  /sold-vehicles  →  /commissions
     *   /inventory/<sold slug>              →  /commissions/<slug>
     */
    const soldSlugs = ['lamborghini-temerario-giallo-inti'];

    return [
      { source: '/sold', destination: '/commissions', permanent: true },
      { source: '/sold-vehicles', destination: '/commissions', permanent: true },
      {
        source: '/sold-vehicles/:slug',
        destination: '/commissions/:slug',
        permanent: true,
      },

      // Completed cars used to live under /inventory. Redirected by name rather than
      // with a wildcard, which would swallow future inventory slugs.
      ...soldSlugs.map((slug) => ({
        source: `/inventory/${slug}`,
        destination: `/commissions/${slug}`,
        permanent: true,
      })),

      /*
       * Per-model sourcing pages are gone.
       *
       * They carried third-party photography and manufacturer specifications, which
       * read as generic automotive articles rather than evidence that this firm can
       * find a car. One Sourcing page explaining the service replaced all seven, so
       * every old model URL — and the /inventory URLs that previously redirected to
       * them — now lands there.
       */
      { source: '/sourcing/:slug', destination: '/sourcing', permanent: true },
      ...[
        'porsche-911-gt3-touring',
        'ferrari-296-gtb',
        'mclaren-artura',
        'mercedes-amg-g-63',
        'bmw-m3-cs',
        'bentley-continental-gt-speed',
        'land-rover-range-rover-sv',
      ].map((slug) => ({
        source: `/inventory/${slug}`,
        destination: '/sourcing',
        permanent: true,
      })),

      /*
       * The image-credits page existed to attribute Creative Commons photography.
       * With all of it removed, nothing needs attributing and the page has gone; the
       * URL points at the terms page, which carries what is left of the legal notes.
       */
      { source: '/credits', destination: '/terms', permanent: true },
    ];
  },
};

export default nextConfig;
