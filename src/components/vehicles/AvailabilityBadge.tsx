import type { Availability } from '@/lib/types';
import { AVAILABILITY_LABEL } from '@/lib/vehicles';

type Props = {
  availability: Availability;
  /** Short qualifier rendered beside the chip, e.g. "Custom order fulfilled". */
  note?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const CHIP: Record<Availability, string> = {
  available: 'border-line-strong text-bone bg-transparent',
  pending: 'border-giallo-deep text-giallo bg-transparent',
  // Sold is the loudest of the three: solid yellow on ink. Used sparingly.
  sold: 'border-giallo bg-giallo text-[#0a0a0b]',
};

const DOT: Record<Availability, string> = {
  available: 'bg-bone',
  pending: 'bg-giallo',
  sold: 'bg-[#0a0a0b]',
};

const SIZE = {
  sm: 'h-6 px-2.5 text-[0.625rem] tracking-[0.13em] gap-1.5',
  md: 'h-7 px-3 text-[0.6875rem] tracking-[0.14em] gap-2',
  lg: 'h-9 px-4 text-xs tracking-[0.16em] gap-2.5',
  xl: 'h-11 px-5 text-[0.8125rem] tracking-[0.18em] gap-3',
} as const;

export function AvailabilityBadge({
  availability,
  note,
  size = 'md',
  className = '',
}: Props) {
  const label = AVAILABILITY_LABEL[availability];

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      <span
        className={`inline-flex items-center border font-medium uppercase ${CHIP[availability]} ${SIZE[size]}`}
      >
        <span
          aria-hidden="true"
          className={`h-[5px] w-[5px] rounded-full ${DOT[availability]}`}
        />
        {label}
      </span>
      {note ? (
        <span className="text-xs tracking-[0.02em] text-steel">{note}</span>
      ) : null}
    </span>
  );
}
