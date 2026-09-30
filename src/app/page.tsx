import Link from 'next/link';
import { CategoryIndex } from '@/components/home/CategoryIndex';
import { CommissionFeature } from '@/components/home/CommissionFeature';
import { MediaFeature } from '@/components/media/MediaFeature';
import { Container } from '@/components/site/Container';
import { Hero } from '@/components/site/Hero';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { homeCopy, sourcingCopy } from '@/content/copy';
import { brandFilm, heroMedia } from '@/content/media';
import { contactAvailability } from '@/lib/contact';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingCategories,
} from '@/lib/vehicles';

/**
 * Homepage.
 *
 * Desire first, documentation second: full-height hero media, the most recent
 * commission as proof at scale, a one-line statement of the service, the categories a
 * search covers, an optional brand film, the process, how we work, and a closing frame.
 *
 * Earlier versions were typography-only, a reaction to borrowed third-party car
 * photography. That removed the problem and the energy with it. The rule now is the
 * one that mattered all along: show real media at scale, and say what it is. Every
 * image here is owner-supplied material for the one documented car, captioned by kind,
 * and the hero and film take owner footage from src/content/media.ts when it exists.
 *
 * Sections that have nothing true to show do not render: no inventory block without
 * inventory, no film without footage, no "Start a search" without a contact route.
 */
export default function HomePage() {
  const inventory = getPublishedInventory();
  const commissions = getPublishedSoldVehicles();
  const categories = getPublishedSourcingCategories();
  const { reachable: canContact, email } = contactAvailability();

  /** The single most recent commission carries the feature. */
  const feature = commissions[0];
  const { statement, process, principles, closing } = homeCopy;
  const accentStart = statement.lines[1].length - statement.accent.length;
  const closingAction = canContact ? closing.cta : closing.fallback;

  return (
    <>
      <Hero
        canContact={canContact}
        media={heroMedia}
        workHref={feature ? homeCopy.hero.workCta.href : undefined}
      />

      {feature ? (
        <CommissionFeature
          vehicle={feature}
          avoidSrc={heroMedia?.video?.poster.src ?? heroMedia?.still.src}
        />
      ) : null}

      {/* Available inventory — rendered only when real records exist. */}
      {inventory.length > 0 ? (
        <section aria-labelledby="available" className="border-t border-line bg-ink">
          <Container size="wide" className="py-20 sm:py-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="available" className="display-1 text-bone">
                Available now
              </h2>
              <Link
                href="/inventory"
                className="link-underline text-sm text-bone-dim transition-colors hover:text-bone"
              >
                All inventory<span aria-hidden="true"> →</span>
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {inventory.slice(0, 6).map((vehicle) => (
                <li key={vehicle.slug} className="h-full">
                  <VehicleCard vehicle={vehicle} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Statement — the change of register. Large type, one explanation. */}
      <section aria-labelledby="statement" className="surface-paper">
        <Container size="wide" className="py-24 sm:py-36 lg:py-44">
          <h2 id="statement" className="display-1 reveal max-w-[16ch] text-ink">
            <span className="block">{statement.lines[0]}</span>{' '}
            <span className="block">
              {statement.lines[1].slice(0, accentStart)}
              <span className="accent-serif">{statement.accent}</span>
            </span>
          </h2>
          <div className="mt-12 grid sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
            <p className="reveal text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed lg:col-start-2">
              {statement.body}
            </p>
          </div>
        </Container>
      </section>

      <CategoryIndex categories={categories} canContact={canContact} />

      {/* Renders nothing until owner footage is configured. */}
      <MediaFeature film={brandFilm} />

      {/* Process — every step, condensed. The full text lives on /sourcing. */}
      <section aria-labelledby="process" className="surface-paper">
        <Container size="wide" className="py-24 sm:py-32 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="label-xs">{process.eyebrow}</p>
              <h2 id="process" className="display-1 mt-6 max-w-[10ch] text-ink">
                {process.title}
              </h2>
              <Link
                href={process.cta.href}
                className="group mt-10 inline-flex items-center text-sm font-medium text-ink"
              >
                <span className="link-underline">{process.cta.label}</span>
                <span aria-hidden="true" className="arrow-nudge ml-2">
                  →
                </span>
              </Link>
            </div>

            <ol className="border-t border-line-strong">
              {sourcingCopy.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="reveal grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 border-b border-line-strong py-8 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-8 sm:py-10"
                >
                  <span
                    aria-hidden="true"
                    className="text-[3.25rem] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums text-ink/25 sm:text-[5.5rem]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.short}
                    </h3>
                    <p className="mt-2 max-w-md text-base leading-relaxed text-ink-soft">
                      {step.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* How we work */}
      <section aria-labelledby="principles" className="bg-ink">
        <Container size="wide" className="py-24 sm:py-32">
          <h2 id="principles" className="label-xs">
            {principles.eyebrow}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {principles.items.map((item, i) => (
              <li key={item.term} className="reveal bg-ink py-8 sm:px-8 sm:py-10">
                <p aria-hidden="true" className="text-sm tabular-nums text-giallo">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-3xl font-semibold uppercase tracking-[-0.04em] text-bone sm:text-4xl">
                  {item.term}
                </h3>
                <p className="mt-4 max-w-[26ch] text-base leading-relaxed text-steel">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Closing frame. Leads to the enquiry form only when it can deliver. */}
      <section
        aria-labelledby="closing"
        className="relative -mb-28 flex min-h-[85svh] items-center overflow-hidden border-t border-line bg-black sm:-mb-36"
      >
        <Container size="wide" className="py-24">
          <h2
            id="closing"
            className="display-mega reveal text-[clamp(3rem,11vw,12rem)] text-bone"
          >
            <span className="block">{closing.lines[0]}</span>{' '}
            <span className="block text-giallo">{closing.lines[1]}</span>
          </h2>
          <div className="mt-12 flex flex-col gap-5 sm:mt-16 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href={closingAction.href}
              className="group btn btn-primary btn-xl w-full sm:w-auto"
            >
              {closingAction.label}
              <span aria-hidden="true" className="arrow-nudge ml-4">
                →
              </span>
            </Link>
            {canContact && email ? (
              <a
                href={`mailto:${email}`}
                className="link-underline self-start text-sm text-bone-dim transition-colors hover:text-bone sm:self-center"
              >
                {email}
              </a>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
