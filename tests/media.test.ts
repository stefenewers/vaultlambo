/**
 * Media configuration rules.
 *
 * The hero and brand film take whatever `src/content/media.ts` points at. These tests
 * are what stop that file from quietly publishing a rendering as a photograph, a file
 * that is not there, footage from somewhere else, or a video host the CSP was not
 * opened for.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { imageSources } from '@/data/image-sources';
import { brandFilm, heroMedia, type MediaStill } from '@/content/media';
import { brandFilmEmbed, embedFrameOrigins } from '@/content/media-embed';
import nextConfig from '../next.config';

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));

function stills(): MediaStill[] {
  const out: MediaStill[] = [];
  if (heroMedia) {
    out.push(heroMedia.still);
    if (heroMedia.mobileStill) out.push(heroMedia.mobileStill);
    if (heroMedia.video) out.push(heroMedia.video.poster);
  }
  if (brandFilm?.video) out.push(brandFilm.video.poster);
  return out;
}

function videoFiles(): string[] {
  return [heroMedia?.video, brandFilm?.video]
    .filter((v) => v != null)
    .flatMap((v) => [...v.sources, ...(v.mobileSources ?? [])].map((s) => s.src));
}

describe('media configuration', () => {
  it('captions every factory rendering as a rendering', () => {
    for (const still of stills()) {
      if (still.kind !== 'factory-render') continue;
      expect(still.caption?.toLowerCase(), still.src).toContain('rendering');
      expect(still.alt.toLowerCase(), still.src).toContain('rendering');
    }
  });

  it('points only at files that exist under /public', () => {
    for (const path of [...stills().map((s) => s.src), ...videoFiles()]) {
      expect(path.startsWith('/'), path).toBe(true);
      expect(existsSync(`${PUBLIC}${path}`), `${path} is missing from public/`).toBe(true);
    }
  });

  it('uses no image that is not recorded as owner-supplied in the ledger', () => {
    const owned = new Set(
      imageSources
        .filter((s) => s.license === 'Owner supplied — all rights reserved')
        .map((s) => s.path),
    );
    for (const still of stills()) {
      // New owner media under /media/ is recorded in MEDIA_NEEDED.md's asset table;
      // anything under /images/ must already be in the ledger.
      if (still.src.startsWith('/images/')) {
        expect(owned.has(still.src), `${still.src} is not in the ledger`).toBe(true);
      }
    }
  });

  it('never hotlinks media from another site', () => {
    for (const path of [...stills().map((s) => s.src), ...videoFiles()]) {
      expect(path).not.toMatch(/^https?:/);
    }
  });
});

describe('content security policy', () => {
  async function csp(): Promise<string> {
    const routes = await nextConfig.headers!();
    const header = routes[0]!.headers.find((h) => h.key === 'Content-Security-Policy');
    return header!.value;
  }

  it('keeps frame-src closed unless an embed is deliberately configured', async () => {
    const policy = await csp();
    if (brandFilmEmbed) {
      for (const origin of embedFrameOrigins()) expect(policy).toContain(origin);
    } else {
      expect(policy).toContain("frame-src 'none'");
    }
  });

  it('serves media from this origin only', async () => {
    expect(await csp()).toContain("media-src 'self'");
  });
});
