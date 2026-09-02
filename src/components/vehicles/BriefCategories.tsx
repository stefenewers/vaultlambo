import type { SourcingCategory } from '@/lib/types';

type Props = {
  categories: SourcingCategory[];
  /** Heading level to render each category name at, so page hierarchy stays correct. */
  headingLevel?: 'h3' | 'h4';
};

/**
 * Representative briefs, as text.
 *
 * This replaced a grid of photo cards, each linking to a per-model page. The pictures
 * were third-party photographs of cars nobody here has touched, and the pages behind
 * them were manufacturer facts dressed up as expertise.
 *
 * What is left is the part that was actually true and actually useful: the categories a
 * search can cover, and some model names to make the scope concrete. Nothing links
 * anywhere, because there is nothing further to say that would be worth a visitor's
 * time — the model names are illustrations, not records.
 *
 * The structure carries the design: a number, a rule, a name, a sentence, a list.
 */
export function BriefCategories({ categories, headingLevel = 'h3' }: Props) {
  if (categories.length === 0) return null;

  const Heading = headingLevel;

  return (
    <ol className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
      {categories.map((entry, i) => (
        <li
          key={entry.id}
          /*
           * Borders rather than gaps, so the grid reads as a single ruled table.
           * The right-hand rule is dropped on the last column at each breakpoint.
           */
          className="border-b border-line py-9 sm:py-11 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
        >
          <div className="flex items-baseline gap-4">
            <span className="label-xs tabular-nums text-steel-dim" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <Heading className="text-xl font-medium tracking-[-0.02em] text-bone sm:text-2xl">
              {entry.category}
            </Heading>
          </div>

          <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-steel">
            {entry.summary}
          </p>

          <ul className="mt-6 space-y-2">
            {entry.examples.map((example) => (
              <li
                key={example}
                className="flex gap-3 text-[0.9375rem] leading-relaxed text-bone-dim"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-px w-3 shrink-0 bg-steel-dim"
                />
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
