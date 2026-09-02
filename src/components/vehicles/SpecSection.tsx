import type { SpecGroup, SpecItem } from '@/lib/types';

/**
 * Horizontal metadata strip used directly under a vehicle heading.
 *
 * The column count follows the number of facts rather than being fixed at four, so a
 * record with three verified facts fills its row instead of leaving an empty cell that
 * reads as a missing value.
 */
const ROW_COLUMNS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
};

export function SpecRow({ items }: { items: SpecItem[] }) {
  if (items.length === 0) return null;

  const columns = ROW_COLUMNS[items.length] ?? 'lg:grid-cols-4';

  return (
    <dl
      className={`rule grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-2 ${columns}`}
    >
      {items.map((item) => (
        <div key={item.label} className="bg-ink px-0 py-5 sm:px-5 lg:py-6">
          <dt className="label-xs">{item.label}</dt>
          <dd className="mt-2 text-[0.9375rem] leading-snug text-bone">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type SpecSectionProps = {
  title: string;
  intro?: string;
  groups: SpecGroup[];
  /** Optional note rendered under the columns in muted type. */
  footnote?: string;
};

/**
 * Two-column grouped option list. Groups flow into two balanced columns on desktop
 * and stack on mobile — no single long bullet wall.
 */
export function SpecSection({ title, intro, groups, footnote }: SpecSectionProps) {
  if (groups.length === 0) return null;

  return (
    <section aria-labelledby="configuration" className="rule pt-8 sm:pt-10">
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <div>
          <h2 id="configuration" className="display-3 text-bone">
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="columns-1 gap-x-14 md:columns-2">
          {groups.map((group) => (
            <div key={group.title} className="mb-9 break-inside-avoid last:mb-0">
              <h3 className="label-xs border-b border-line pb-3 text-bone-dim">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-bone-dim"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-px w-3 shrink-0 bg-steel-dim"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {footnote ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <div aria-hidden="true" className="hidden lg:block" />
          <p className="max-w-xl text-xs leading-relaxed text-steel-dim">
            {footnote}
          </p>
        </div>
      ) : null}
    </section>
  );
}
