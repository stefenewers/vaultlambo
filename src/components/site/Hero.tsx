import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { homeCopy } from '@/content/copy';

type HeroImage = {
  src: string;
  alt: string;
  /** Category label shown in the corner of the frame. */
  label: string;
  width: number;
  height: number;
};

/**
 * Hero composition.
 *
 * Four images across four categories, so the page says "multi-marque specialist"
 * before a word is read. Asymmetric on purpose: one tall frame carrying the
 * craftsmanship shot, two stacked beside it, and a panoramic band beneath the fold
 * line. No single car leads, and no marque is repeated.
 */
const TALL: HeroImage = {
  src: '/images/editorial/hero-craftsmanship.webp',
  alt: 'The cabin of an Aston Martin V12 Speedster, trimmed in tan and brown leather with visible stitching.',
  label: 'Craftsmanship',
  width: 1280,
  height: 1600,
};

const STACKED: HeroImage[] = [
  {
    src: '/images/editorial/hero-performance.webp',
    alt: 'The rear haunch and wheel of a dark green Porsche 911 GT3 Touring.',
    label: 'Performance',
    width: 1400,
    height: 1400,
  },
  {
    src: '/images/editorial/hero-grand-touring.webp',
    alt: 'A white Bentley Flying Spur photographed from the front three-quarter.',
    label: 'Grand touring',
    width: 1400,
    height: 1400,
  },
];

const BAND: HeroImage = {
  src: '/images/editorial/hero-luxury-suv.webp',
  alt: 'The flank of a white long-wheelbase Range Rover SV in a showroom.',
  label: 'Luxury SUV',
  width: 2400,
  height: 1029,
};

type Props = {
  /** Where the secondary action points, and what it says. */
  secondaryCta: { label: string; href: string };
};

export function Hero({ secondaryCta }: Props) {
  const { hero } = homeCopy;

  return (
    <section className="border-b border-line">
      <Container>
        <div className="grid items-center gap-12 pb-14 pt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:pb-20 lg:pt-20">
          {/* Copy */}
          <div className="lg:pr-8">
            <p className="label-xs">{hero.eyebrow}</p>

            <h1 className="display-1 mt-6 max-w-[11ch] text-bone">{hero.headline}</h1>

            <p className="mt-7 max-w-md text-base leading-relaxed text-bone-dim sm:text-lg">
              {hero.subhead}
            </p>

            {/*
              Full-width on the narrowest screens: two auto-width buttons wrapping onto
              separate lines at different widths reads as a layout accident.
            */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={hero.primaryCta.href}
                className="btn btn-primary w-full sm:w-auto"
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="btn btn-secondary w-full sm:w-auto"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Image mosaic */}
          <div className="grid grid-cols-5 grid-rows-2 gap-2.5 sm:gap-3 lg:aspect-[5/4]">
            <Frame
              image={TALL}
              priority
              sizes="(min-width: 1024px) 33vw, 55vw"
              className="col-span-3 row-span-2 aspect-[4/5] lg:aspect-auto"
            />
            {STACKED.map((image, i) => (
              <Frame
                key={image.src}
                image={image}
                priority={i === 0}
                sizes="(min-width: 1024px) 22vw, 38vw"
                className="col-span-2 aspect-square lg:aspect-auto"
              />
            ))}
          </div>
        </div>
      </Container>

      {/* Panoramic band */}
      <div className="relative w-full overflow-hidden border-t border-line bg-ink-panel">
        <div className="relative aspect-[3/2] w-full sm:aspect-[21/9] lg:aspect-[28/9]">
          <Image
            src={BAND.src}
            alt={BAND.alt}
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover"
          />
          {/*
            Captions sit over photography that may be light or dark, so each one
            carries its own scrim rather than relying on the image behind it.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/85 to-transparent"
          />
          <span className="absolute bottom-4 left-5 label-xs text-bone sm:bottom-5 sm:left-8 lg:left-12">
            {BAND.label}
          </span>
        </div>
      </div>
    </section>
  );
}

function Frame({
  image,
  priority,
  sizes,
  className,
}: {
  image: HeroImage;
  priority?: boolean;
  sizes: string;
  className: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden border border-line bg-ink-panel ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/85 to-transparent"
      />
      <figcaption className="absolute bottom-3 left-3 label-xs text-bone sm:bottom-4 sm:left-4">
        {image.label}
      </figcaption>
    </figure>
  );
}
