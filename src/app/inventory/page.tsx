import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { InventoryBrowser } from '@/components/vehicles/InventoryBrowser';
import { inventoryCopy } from '@/content/copy';
import { getPublishedInventory } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Specific performance, luxury and collector vehicles currently offered by ' +
    'Marlowe Motorcars.',
  alternates: { canonical: '/inventory' },
};

/**
 * Inventory listing.
 *
 * The route stays live whether or not anything is listed. With nothing on offer it
 * says so and points at the two things that are actually useful — send a brief, or
 * look at the models we source — rather than showing a filter bar over an empty grid.
 */
export default function InventoryPage() {
  const inventory = getPublishedInventory();

  if (inventory.length === 0) {
    const { none } = inventoryCopy;

    return (
      <>
        <PageHeader title={inventoryCopy.headline} />
        <Container>
          <div className="rule max-w-2xl py-16 sm:py-20">
            <h2 className="display-3 text-bone">{none.title}</h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone-dim sm:text-base">
              {none.body}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={none.primaryCta.href} className="btn btn-primary">
                {none.primaryCta.label}
              </Link>
              <Link href={none.secondaryCta.href} className="btn btn-secondary">
                {none.secondaryCta.label}
              </Link>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader title={inventoryCopy.headline} intro={inventoryCopy.intro} />
      <Container>
        <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
          <InventoryBrowser vehicles={inventory} />
        </Suspense>
      </Container>
    </>
  );
}
