import Image from 'next/image';
import Link from 'next/link';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import type { SpecificVehicle } from '@/lib/types';
import { recordHref, vehicleTitle } from '@/lib/vehicles';

type Props = {
  vehicle: SpecificVehicle;
  priority?: boolean;
  /** Image `sizes` for the grid this card sits in. */
  sizes?: string;
};

/**
 * Listing card for one specific car — inventory or completed.
 *
 * Only takes a `SpecificVehicle`, so a sourcing model cannot be rendered through it
 * and pick up an availability badge or a price line by accident.
 */
export function VehicleCard({
  vehicle,
  priority = false,
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw',
}: Props) {
  const lead = vehicle.images[0];
  const meta = vehicle.specs.slice(0, 2);
  const href = recordHref(vehicle);
  const availability = vehicle.kind === 'sold' ? 'sold' : vehicle.availability;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink-panel">
        <Image
          src={lead.src}
          alt={lead.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute left-4 top-4">
          <AvailabilityBadge availability={availability} size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-bone">
          <Link href={href} className="before:absolute before:inset-0">
            {vehicleTitle(vehicle)}
          </Link>
        </h3>

        {vehicle.subtitle ? (
          <p className="mt-1 text-sm text-steel">{vehicle.subtitle}</p>
        ) : null}

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-steel">
          {vehicle.summary}
        </p>

        <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5">
          {meta.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="label-xs">{item.label}</dt>
              <dd className="mt-1 truncate text-[0.8125rem] text-bone-dim">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="rule mt-5 flex items-center justify-between gap-4 pt-4">
          {/* A completed car's price is not published. */}
          <span className="text-[0.8125rem] text-steel">
            {vehicle.kind === 'inventory' ? vehicle.priceDisplay : ''}
          </span>
          <span className="link-underline text-[0.8125rem] text-bone-dim transition-colors group-hover:text-bone">
            View details
            <span aria-hidden="true"> →</span>
          </span>
        </div>
      </div>
    </article>
  );
}
