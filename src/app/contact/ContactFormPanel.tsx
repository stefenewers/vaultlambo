'use client';

import { useSearchParams } from 'next/navigation';
import { InquiryForm, type OptionGroup } from '@/components/forms/InquiryForm';

/**
 * Reads the `?vehicle=` parameter set by the enquiry buttons on detail and model
 * pages and preselects it. Kept in its own client component so the contact page
 * itself stays a server component.
 */
export function ContactFormPanel({ groups }: { groups: OptionGroup[] }) {
  const params = useSearchParams();
  const requested = params.get('vehicle');

  const match = groups
    .flatMap((group) => group.options)
    .find((option) => option.value === requested);

  return (
    <InquiryForm
      groups={groups}
      defaultVehicle={match?.value}
      defaultMessage={match ? `I'm interested in the ${match.value}.\n\n` : undefined}
    />
  );
}
