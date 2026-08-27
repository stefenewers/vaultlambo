import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { InventoryBrowser } from '@/components/vehicles/InventoryBrowser';
import { inventoryCopy } from '@/content/copy';
import { getAllVehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Performance, luxury and collector vehicles currently available. Filter by make, ' +
    'category, year and availability.',
  alternates: { canonical: '/inventory' },
};

export default function InventoryPage() {
  return (
    <>
      <PageHeader title={inventoryCopy.headline} intro={inventoryCopy.intro} />

      <Container>
        <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
          <InventoryBrowser vehicles={getAllVehicles()} />
        </Suspense>
      </Container>
    </>
  );
}
