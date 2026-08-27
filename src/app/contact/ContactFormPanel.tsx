'use client';

import { useSearchParams } from 'next/navigation';
import { InquiryForm } from '@/components/forms/InquiryForm';

/**
 * Reads the `?vehicle=` parameter set by the "Inquire" buttons on detail pages and
 * preselects it. Kept in its own client component so the contact page itself stays a
 * server component.
 */
export function ContactFormPanel({
  vehicleOptions,
}: {
  vehicleOptions: { value: string; label: string }[];
}) {
  const params = useSearchParams();
  const requested = params.get('vehicle');
  const match = vehicleOptions.find((o) => o.value === requested);

  return (
    <InquiryForm
      vehicleOptions={vehicleOptions}
      defaultVehicle={match?.value}
      defaultMessage={
        match
          ? `I'm interested in the ${match.value}.\n\n`
          : undefined
      }
    />
  );
}
