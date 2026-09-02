import { ImageResponse } from 'next/og';
import { siteConfig } from '@/site.config';

/**
 * Default social card.
 *
 * Typographic and generated at build time — the brand mark, the tagline and the
 * descriptor, on the site's own charcoal. Individual vehicle and model pages override
 * this with their own photography through `openGraph.images` in their metadata.
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0b',
          color: '#f3f0ea',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 10,
              fontWeight: 500,
              color: '#f3f0ea',
            }}
          >
            {siteConfig.wordmark.primary}
          </div>
          <div
            style={{
              fontSize: 15,
              letterSpacing: 12,
              marginTop: 10,
              color: '#8b8b91',
            }}
          >
            {siteConfig.wordmark.secondary}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/*
            Satori requires an explicit display on any element with more than one
            child, so text nodes are composed into a single string rather than
            interpolated alongside a literal.
          */}
          <div style={{ fontSize: 76, fontWeight: 500, letterSpacing: -2 }}>
            {`${siteConfig.tagline}.`}
          </div>
          <div style={{ fontSize: 28, marginTop: 22, color: '#cfccc6' }}>
            Performance, luxury and collector vehicles, sourced to order.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: '1px solid rgba(243,240,234,0.18)',
            paddingTop: 22,
            fontSize: 20,
            color: '#8b8b91',
          }}
        >
          {siteConfig.descriptor}
        </div>
      </div>
    ),
    size,
  );
}
