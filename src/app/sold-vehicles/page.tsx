import type { Metadata } from 'next';
import { Container } from '@/components/site/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { soldCopy } from '@/content/copy';
import { getPublishedSoldVehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Completed Vehicles',
  description: soldCopy.intro,
  alternates: { canonical: '/sold-vehicles' },
};

/**
 * Completed vehicles.
 *
 * Only individually documented cars appear here. A model with no vehicle-specific
 * evidence is not a completed sale, and belongs in the sourcing catalogue instead.
 */
export default function SoldVehiclesPage() {
  const sold = getPublishedSoldVehicles();

  return (
    <>
      <PageHeader title={soldCopy.headline} intro={soldCopy.intro} />

      <Container>
        {sold.length === 0 ? (
          <p className="rule py-16 text-sm text-steel">{soldCopy.empty}</p>
        ) : (
          <ul className="rule grid grid-cols-1 gap-x-8 gap-y-16 pt-14 sm:grid-cols-2 xl:grid-cols-3">
            {sold.map((vehicle, i) => (
              <li key={vehicle.slug} className="h-full">
                <VehicleCard vehicle={vehicle} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
