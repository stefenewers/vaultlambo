import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { SampleInventoryNotice } from '@/components/site/SampleInventoryNotice';
import { InventoryBrowser } from '@/components/vehicles/InventoryBrowser';
import { inventoryCopy } from '@/content/copy';
import { getAllVehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Inventory',
  description:
    'Browse the current list of performance, collector and special-order vehicles. ' +
    'Filter by availability, make, body style and year.',
  alternates: { canonical: '/inventory' },
};

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        eyebrow={inventoryCopy.eyebrow}
        title={inventoryCopy.headline}
        intro={inventoryCopy.intro}
      >
        <SampleInventoryNotice className="mt-8" />
      </PageHeader>

      <Container>
        <InventoryBrowser vehicles={getAllVehicles()} />
      </Container>
    </>
  );
}
