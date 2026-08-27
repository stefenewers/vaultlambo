import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { SampleInventoryNotice } from '@/components/site/SampleInventoryNotice';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { soldCopy } from '@/content/copy';
import { getSoldVehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Sold archive',
  description:
    'A record of vehicles that have passed through the collection and are no longer ' +
    'available.',
  alternates: { canonical: '/sold' },
};

export default function SoldPage() {
  const sold = getSoldVehicles();

  return (
    <>
      <PageHeader
        eyebrow={soldCopy.eyebrow}
        title={soldCopy.headline}
        intro={soldCopy.intro}
      >
        <SampleInventoryNotice className="mt-8" />
      </PageHeader>

      <Container>
        {sold.length === 0 ? (
          <p className="rule py-16 text-sm text-steel">
            No archive entries yet.
          </p>
        ) : (
          <ul className="rule grid grid-cols-1 gap-x-8 gap-y-14 pt-12 sm:grid-cols-2 xl:grid-cols-3">
            {sold.map((vehicle, i) => (
              <li key={vehicle.slug}>
                <VehicleCard vehicle={vehicle} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
