import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { AmbientVideo } from '@/components/media/AmbientVideo';
import { Container } from '@/components/site/Container';
import { homeCopy } from '@/content/copy';
import type { HeroMedia, MediaStill } from '@/content/media';

type Props = {
  /**
   * Whether a contact route exists. "Start a search" is withheld entirely when it does
   * not — a button leading to a page with no form and no address is worse than none.
   */
  canContact: boolean;
  /** Configured in src/content/media.ts. `null` gives the typographic hero. */
  media: HeroMedia | null;
  /** Where "View our work" goes. Absent when no commission is published. */
  workHref?: string;
};

/**
 * Homepage hero.
 *
 * Full-height media with the headline set over it, sitting under a header that starts
 * transparent. The media is whatever `src/content/media.ts` supplies — owner footage,
 * an owner photograph, or (today) the Temerario commission's own configuration
 * rendering — and the component does not change when that does.
 *
 * Provenance travels with the media: a factory rendering is captioned as one, on
 * screen, in the corner of the hero. With no media configured the hero falls back to
 * type alone and the header stays solid.
 */
export function Hero({ canContact, media, workHref }: Props) {
  const { hero } = homeCopy;
  const lead = hero.headline.slice(0, hero.headline.length - hero.headlineAccent.length);
  const frame = media ? (media.video?.poster ?? media.still) : null;
  const provenance = frame?.kind === 'factory-render' ? frame.caption : undefined;

  /*
   * Actions. "Start a search" leads only when contact is live. "View our work" is
   * offered whenever there is a commission to show. "How sourcing works" fills in so
   * the hero always has two ways forward.
   */
  type Action = { label: string; href: string };
  const candidates: (Action | null)[] = [
    canContact ? hero.primaryCta : null,
    workHref ? { label: hero.workCta.label, href: workHref } : null,
    !canContact || !workHref ? hero.secondaryCta : null,
  ];
  const actions = candidates.filter((a): a is Action => a != null);

  return (
    <section
      aria-labelledby="hero-heading"
      className={`relative isolate flex flex-col overflow-hidden ${
        media
          ? /* Pulled up under the sticky header, which starts transparent over it. */
            '-mt-[4.5rem] min-h-[100svh] sm:-mt-20'
          : 'min-h-[80svh] border-b border-line'
      }`}
    >
      {media && frame ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-panel">
          <div className="hero-settle absolute inset-0">
            <HeroStill still={frame} mobile={media.mobileStill} />
          </div>
          {media.video ? (
            <AmbientVideo
              video={media.video}
              mode="ambient"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {/*
            Legibility, not mood lighting: darkening from the top for the header, and
            heavier from the bottom-left where the headline sits.
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/0" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/15 to-transparent" />
        </div>
      ) : null}

      <Container className="relative flex flex-1 flex-col justify-end pb-10 pt-36 sm:pb-14 lg:pb-16">
        <div className="rise flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 shrink-0 bg-giallo" />
          <p className="label-xs shrink-0 text-bone">{hero.eyebrow}</p>
        </div>

        <h1
          id="hero-heading"
          className="display-hero rise rise-1 mt-7 max-w-[10ch] text-bone sm:mt-9"
        >
          {lead}
          <span className="accent-serif text-giallo">{hero.headlineAccent}</span>
        </h1>

        <div className="rise rise-2 mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className="max-w-[30rem] text-lg leading-snug text-bone sm:text-2xl sm:leading-snug">
            {hero.subhead}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {actions.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group btn btn-lg w-full sm:w-auto ${
                  i === 0 ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {action.label}
                {i === 0 ? (
                  <span aria-hidden="true" className="arrow-nudge ml-3">
                    →
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        {provenance ? (
          <p className="rise rise-3 mt-10 text-xs leading-relaxed text-bone-dim sm:mt-12 lg:text-right">
            {provenance}
          </p>
        ) : null}
      </Container>
    </section>
  );
}

/**
 * The hero frame. One `priority` image — the page's LCP candidate. With a portrait
 * crop configured for phones it becomes a <picture>, so each device downloads only
 * the crop it shows.
 */
function HeroStill({ still, mobile }: { still: MediaStill; mobile?: MediaStill }) {
  /*
   * Focal point per breakpoint, through custom properties so the server-rendered
   * markup needs no media-query logic of its own.
   */
  const style = {
    '--hero-pos': still.position ?? '50% 50%',
    '--hero-pos-mobile': still.mobilePosition ?? still.position ?? '50% 50%',
  } as React.CSSProperties;

  if (!mobile) {
    return (
      <Image
        src={still.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover [object-position:var(--hero-pos-mobile)] md:[object-position:var(--hero-pos)]"
        style={style}
      />
    );
  }

  const common = { alt: '', fill: true, priority: true, sizes: '100vw' } as const;
  const desktop = getImageProps({ ...common, src: still.src }).props;
  const phone = getImageProps({ ...common, src: mobile.src }).props;

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={phone.srcSet} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        {...desktop}
        className="h-full w-full object-cover [object-position:var(--hero-pos-mobile)] md:[object-position:var(--hero-pos)]"
        style={style}
      />
    </picture>
  );
}
