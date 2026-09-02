import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { creditsCopy } from '@/content/copy';
import { attributableSources } from '@/data/image-sources';

export const metadata: Metadata = {
  title: 'Image credits',
  description: creditsCopy.intro,
  alternates: { canonical: '/credits' },
};

/**
 * Image credits.
 *
 * Renders the attribution-required entries from the ledger in
 * `src/data/image-sources.ts`. Adding an image to the ledger is what puts it here;
 * there is no second list to keep in step.
 */
export default function CreditsPage() {
  const sources = attributableSources();

  return (
    <>
      <PageHeader title={creditsCopy.headline} intro={creditsCopy.intro} />

      <Container>
        <p className="rule max-w-2xl pt-8 text-sm leading-relaxed text-steel">
          {creditsCopy.representativeNote}
        </p>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {sources.map((source) => (
            <li key={source.path} className="grid gap-2 py-6 lg:grid-cols-[1fr_1fr_auto] lg:gap-10">
              <div className="min-w-0">
                <p className="break-all text-[0.8125rem] text-bone-dim">{source.path}</p>
                {source.modifications ? (
                  <p className="mt-1 text-xs text-steel-dim">{source.modifications}</p>
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-[0.9375rem] text-bone">{source.creator}</p>
                {source.sourceUrl ? (
                  <a
                    href={source.sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="link-underline mt-1 block break-all text-xs text-steel transition-colors hover:text-bone"
                  >
                    Original file
                  </a>
                ) : null}
              </div>

              <div className="shrink-0 lg:text-right">
                {source.licenseUrl ? (
                  <a
                    href={source.licenseUrl}
                    rel="noopener noreferrer license"
                    target="_blank"
                    className="link-underline text-[0.8125rem] text-bone-dim transition-colors hover:text-bone"
                  >
                    {source.license}
                  </a>
                ) : (
                  <span className="text-[0.8125rem] text-bone-dim">{source.license}</span>
                )}
                <p className="mt-1 text-xs text-steel-dim">
                  Accessed {source.accessed}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
