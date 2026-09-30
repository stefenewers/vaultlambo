import { brandFilmEmbed, type EmbedProvider } from './media-embed';

/**
 * SITE MEDIA — the one place hero and brand-film media are configured.
 *
 * The components that render this (`Hero`, `MediaFeature`) never need editing to swap
 * footage. Drop approved files into `public/media/` (see MEDIA_NEEDED.md for sizes and
 * formats), then point the entries below at them.
 *
 * Provenance is part of the type, not a comment. A still is either a photograph the
 * owner has the right to publish, or a factory configuration rendering — and a
 * rendering must carry a caption that says so, which the hero always displays. A test
 * enforces that. Nothing from a third party, and nothing from any other dealer's or
 * reference site, belongs here.
 */

export type MediaStill = {
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  alt: string;
  kind: 'owner-photograph' | 'factory-render';
  /**
   * Visible caption. Required in practice for `factory-render` (and asserted in
   * tests), so a rendering can never be shown as though it were a photograph.
   */
  caption?: string;
  /** CSS object-position for art direction, e.g. '60% 50%'. */
  position?: string;
  /** Object-position on phones, where the frame is portrait and crops much harder. */
  mobilePosition?: string;
};

export type MediaVideo = {
  /** Local files, best format first. WebM (VP9/AV1) then MP4 (H.264) is ideal. */
  sources: { src: string; type: 'video/webm' | 'video/mp4' }[];
  /**
   * Optional lighter or portrait cut for small screens. Served with a
   * `media="(max-width: 767px)"` source ahead of the desktop sources.
   */
  mobileSources?: { src: string; type: 'video/webm' | 'video/mp4' }[];
  /** Shown before the video starts, to reduced-motion users, and if it fails. */
  poster: MediaStill;
};

export type HeroMedia = {
  /** Owner-supplied footage. When absent, `still` carries the hero on its own. */
  video?: MediaVideo;
  /** Required: the frame the hero stands on without video. */
  still: MediaStill;
  /** Optional portrait crop for phones. Falls back to `still` with `position`. */
  mobileStill?: MediaStill;
};

export type BrandFilm = {
  /** Accessible title, also shown as the section heading. */
  title: string;
  caption?: string;
  /** Local footage. Takes precedence over an embed. */
  video?: MediaVideo;
  /** Third-party player, only if deliberately configured in media-embed.ts. */
  embed?: { provider: EmbedProvider; id: string };
  /** Show native controls. Defaults to true for the brand film. */
  controls?: boolean;
};

const TEMERARIO = '/images/vehicles/lamborghini-temerario-giallo-inti';

/**
 * Hero media.
 *
 * There is no owner-supplied hero footage or photography yet. Until there is, the hero
 * stands on the strongest real asset the business has: the Temerario commission's own
 * factory configuration rendering — this exact specification, supplied by the owner —
 * captioned on screen as a rendering.
 *
 * It is 1123px wide, which is the ceiling of what was supplied, so it softens at full
 * bleed on large, high-density screens. Real footage is the single biggest upgrade
 * available; see MEDIA_NEEDED.md.
 *
 * To use footage, add for example:
 *
 *   video: {
 *     sources: [
 *       { src: '/media/hero/hero-1080p.webm', type: 'video/webm' },
 *       { src: '/media/hero/hero-1080p.mp4', type: 'video/mp4' },
 *     ],
 *     mobileSources: [{ src: '/media/hero/hero-mobile.mp4', type: 'video/mp4' }],
 *     poster: { src: '/media/hero/hero-poster.jpg', width: 2560, height: 1440,
 *               alt: '…', kind: 'owner-photograph' },
 *   },
 *
 * Setting `heroMedia` to `null` gives a typographic hero with no image at all.
 */
export const heroMedia: HeroMedia | null = {
  still: {
    src: `${TEMERARIO}/01-front-three-quarter.jpg`,
    width: 1123,
    height: 794,
    kind: 'factory-render',
    alt:
      'Factory configuration rendering of the Lamborghini Temerario commission in ' +
      'Giallo Inti, front three-quarter view.',
    caption: 'Factory configuration rendering of the Lamborghini Temerario commission',
    position: '58% 55%',
    /* Keeps the nose and headlight in a portrait crop. */
    mobilePosition: '30% 60%',
  },
};

/**
 * Brand film. `null` until original footage exists, and the section does not render
 * at all while it is — no empty frame, no "coming soon".
 *
 * Local example:
 *   export const brandFilm: BrandFilm | null = {
 *     title: 'Collecting the Temerario',
 *     caption: 'Filmed on delivery.',
 *     video: { sources: [...], poster: {...} },
 *   };
 */
export const brandFilm: BrandFilm | null = brandFilmEmbed
  ? { title: 'Marlowe Motorcars', embed: brandFilmEmbed }
  : null;
