import type { Availability } from '@/lib/types';
import { AVAILABILITY_LABEL } from '@/lib/vehicles';

type Props = {
  availability: Availability;
  /** Short qualifier rendered beside the chip, e.g. "Custom order fulfilled". */
  note?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/**
 * Quiet status marker. Hairline border in every state — the only colour is the dot,
 * and only for Reserved. Sold reads as legible but settled rather than shouted.
 */
const CHIP: Record<Availability, string> = {
  available: 'border-line-strong text-bone',
  reserved: 'border-line-strong text-bone',
  sold: 'border-line text-steel',
};

const DOT: Record<Availability, string> = {
  available: 'bg-bone-dim',
  reserved: 'bg-giallo',
  sold: 'bg-steel-dim',
};

const SIZE = {
  sm: 'h-6 px-2.5 text-[0.625rem] tracking-[0.14em] gap-1.5',
  md: 'h-7 px-3 text-[0.6875rem] tracking-[0.15em] gap-2',
  lg: 'h-9 px-4 text-[0.75rem] tracking-[0.18em] gap-2.5',
} as const;

export function AvailabilityBadge({
  availability,
  note,
  size = 'md',
  className = '',
}: Props) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      <span
        className={`inline-flex items-center border bg-ink/70 font-medium uppercase backdrop-blur-[2px] ${CHIP[availability]} ${SIZE[size]}`}
      >
        <span
          aria-hidden="true"
          className={`h-[5px] w-[5px] rounded-full ${DOT[availability]}`}
        />
        {AVAILABILITY_LABEL[availability]}
      </span>
      {note ? <span className="text-xs text-steel">{note}</span> : null}
    </span>
  );
}
