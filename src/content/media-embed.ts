/**
 * Third-party video embeds, and the CSP origins they need.
 *
 * Kept free of imports so `next.config.ts` can read it directly: the Content Security
 * Policy only opens `frame-src` to a video host when a film on this site is actually
 * configured to be embedded from it. With nothing configured — the default — the
 * policy is exactly as tight as before.
 */

export type EmbedProvider = 'youtube' | 'vimeo';

/** Origins each provider's player is served from. */
export const EMBED_ORIGINS: Record<EmbedProvider, string[]> = {
  youtube: ['https://www.youtube-nocookie.com'],
  vimeo: ['https://player.vimeo.com'],
};

/**
 * The brand film's embed, if the owner has deliberately chosen to host it on YouTube
 * or Vimeo rather than serve a local file. `null` means local files only.
 *
 * Example:
 *   export const brandFilmEmbed = { provider: 'vimeo', id: '123456789' } as const;
 */
export const brandFilmEmbed: { provider: EmbedProvider; id: string } | null = null;

/** Extra `frame-src` origins for the CSP. Empty unless an embed is configured. */
export function embedFrameOrigins(): string[] {
  return brandFilmEmbed ? EMBED_ORIGINS[brandFilmEmbed.provider] : [];
}
