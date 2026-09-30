import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { homeCopy } from '@/content/copy';
import type { SourcingCategory } from '@/lib/types';
import { sourcingBriefValue } from '@/lib/vehicles';

type Props = {
  categories: SourcingCategory[];
  canContact: boolean;
};

/**
 * Sourcing categories as a browsing index: one large row per category.
 *
 * Type is the visual asset until there is approved imagery for each category. Each
 * row is a way to *start a brief*, never a way into stock: with contact live it opens
 * the enquiry form with that category preselected; without it, it goes to the
 * category on the Sourcing page. The section is labelled as sourcing categories and
 * the model names as examples, so nothing reads as a car on the books.
 */
export function CategoryIndex({ categories, canContact }: Props) {
  if (categories.length === 0) return null;
  const { categories: copy } = homeCopy;

  return (
    <section aria-labelledby="categories" className="bg-ink">
      <Container size="wide" className="py-20 sm:py-28 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-20">
          <div>
            <p className="label-xs">{copy.eyebrow}</p>
            <h2 id="categories" className="display-1 mt-6 max-w-[14ch] text-bone">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-steel lg:justify-self-end">
            {copy.intro}
          </p>
        </div>

        <ol className="mt-14 border-t border-line-strong sm:mt-20">
          {categories.map((entry) => {
            const href = canContact
              ? `/contact?vehicle=${encodeURIComponent(sourcingBriefValue(entry.category))}`
              : `/sourcing#${entry.id}`;

            return (
              <li key={entry.id} className="border-b border-line-strong">
                <Link
                  href={href}
                  className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-7 sm:gap-x-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)_auto] lg:gap-x-10"
                >
                  {/* Background wash on hover and focus. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-5 -right-5 -z-0 origin-bottom scale-y-0 bg-ink-raised transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none sm:-left-8 sm:-right-8"
                  />

                  <span className="relative min-w-0">
                    <span className="block text-[clamp(2rem,6.5vw,5.75rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em] text-bone transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-2 motion-reduce:transition-none">
                      {entry.category}
                    </span>
                    {/* Examples, on phones, under the name. */}
                    <span className="mt-3 block text-sm leading-relaxed text-steel lg:hidden">
                      <span className="sr-only">Example briefs: </span>
                      {entry.examples.join(' · ')}
                    </span>
                  </span>

                  {/* Examples, on desktop, in their own column. Only one of the two
                      renders at any width, so each is announced once. */}
                  <span className="relative hidden text-sm leading-relaxed text-steel transition-colors group-hover:text-bone-dim lg:block">
                    <span className="sr-only">Example briefs: </span>
                    {entry.examples.join(' · ')}
                  </span>

                  <span
                    aria-hidden="true"
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-bone transition-colors duration-300 group-hover:border-giallo group-hover:bg-giallo group-hover:text-ink sm:h-14 sm:w-14"
                  >
                    <span className="arrow-nudge">→</span>
                  </span>

                  <span className="sr-only">
                    {canContact ? ': start a search in this category' : ': sourcing details'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
