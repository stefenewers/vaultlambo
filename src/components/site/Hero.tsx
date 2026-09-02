import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { homeCopy } from '@/content/copy';

type Props = {
  /**
   * Whether a contact route exists. The primary action is withheld entirely when it
   * does not — an "Enquire" button leading to a page with no form and no address is
   * worse than no button.
   */
  canContact: boolean;
};

/**
 * Homepage hero.
 *
 * Typography only. This replaced a four-image mosaic and a full-width panoramic band,
 * all of it third-party photography of other people's cars: different photographers,
 * locations, light and crops, assembled into something that read as a collage rather
 * than an identity.
 *
 * A sourcing firm with one public commission has nothing to gain from borrowed
 * pictures of cars it has never touched. What it can be is precise. So the hero holds
 * a rule, a headline, one supporting sentence and three short statements about how the
 * service works — and the only image on the homepage is the one car the owner actually
 * supplied, well below the fold.
 */
export function Hero({ canContact }: Props) {
  const { hero } = homeCopy;

  return (
    <section className="border-b border-line">
      <Container>
        <div className="pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pb-28 lg:pt-32">
          {/* Eyebrow, sitting on a hairline that runs the full measure. */}
          <div className="flex items-center gap-5">
            <p className="label-xs shrink-0 text-bone-dim">{hero.eyebrow}</p>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-x-16 gap-y-10 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:pt-14">
            <h1 className="display-hero max-w-[9ch] text-bone">{hero.headline}</h1>

            <div className="lg:pb-2">
              <p className="max-w-md text-base leading-relaxed text-bone-dim sm:text-lg">
                {hero.subhead}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {canContact ? (
                  <Link
                    href={hero.primaryCta.href}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    {hero.primaryCta.label}
                  </Link>
                ) : null}
                <Link
                  href={hero.secondaryCta.href}
                  className={`btn w-full sm:w-auto ${
                    canContact ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/*
        Three statements about the service, on a rule. This is where a stock-photo band
        used to be: it occupies the same position in the composition and says something
        true instead.
      */}
      <div className="border-t border-line">
        <Container>
          <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {hero.marks.map((mark, i) => (
              <div
                key={mark.term}
                className={`py-8 sm:py-10 ${i === 0 ? 'sm:pr-8' : 'sm:px-8'} ${
                  i === hero.marks.length - 1 ? 'sm:pr-0' : ''
                }`}
              >
                <dt className="label-xs text-bone-dim">{mark.term}</dt>
                <dd className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-steel">
                  {mark.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
