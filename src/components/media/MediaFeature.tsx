import { AmbientVideo } from '@/components/media/AmbientVideo';
import { Container } from '@/components/site/Container';
import type { BrandFilm } from '@/content/media';

type Props = {
  film: BrandFilm | null;
  eyebrow?: string;
};

const EMBED_URL = {
  youtube: (id: string) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`,
  vimeo: (id: string) => `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1`,
} as const;

/**
 * Brand film / media feature.
 *
 * Renders nothing unless a film is configured in `src/content/media.ts` — no empty
 * frame, no placeholder, no "coming soon". Local footage is preferred and takes
 * precedence; a YouTube or Vimeo embed is used only if one has been deliberately
 * configured, which is also what opens the CSP's `frame-src` to that player.
 *
 * Local footage loads with `preload="none"`: nothing is downloaded until the viewer
 * presses play, so a film below the fold costs the page nothing.
 */
export function MediaFeature({ film, eyebrow = 'Film' }: Props) {
  if (!film || (!film.video && !film.embed)) return null;

  return (
    <section aria-labelledby="brand-film" className="bg-black">
      <Container size="wide" className="py-16 sm:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-xs">{eyebrow}</p>
            <h2 id="brand-film" className="display-2 mt-4 text-bone">
              {film.title}
            </h2>
          </div>
          {film.caption ? (
            <p className="max-w-sm text-sm leading-relaxed text-steel">{film.caption}</p>
          ) : null}
        </div>

        <div className="relative mt-10 aspect-video w-full overflow-hidden border border-line bg-ink-panel">
          {film.video ? (
            <AmbientVideo
              video={film.video}
              mode={film.controls === false ? 'ambient' : 'film'}
              title={film.title}
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : film.embed ? (
            <iframe
              src={EMBED_URL[film.embed.provider](film.embed.id)}
              title={film.title}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
