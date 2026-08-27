import Link from 'next/link';
import { AvailabilityBadge } from '@/components/vehicles/AvailabilityBadge';
import { VehicleThumb } from '@/components/vehicles/VehicleThumb';
import type { Vehicle } from '@/lib/types';
import { vehicleTitle } from '@/lib/vehicles';

type Props = {
  vehicle: Vehicle;
  priority?: boolean;
  /** Image `sizes` for the grid this card is placed in. */
  sizes?: string;
};

export function VehicleCard({
  vehicle,
  priority = false,
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw',
}: Props) {
  const title = vehicleTitle(vehicle);
  const meta = vehicle.specs.slice(0, 2);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink-panel">
        <VehicleThumb
          vehicle={vehicle}
          sizes={sizes}
          priority={priority}
          className="group-hover:scale-[1.035]"
        />
        {vehicle.availability === 'sold' ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink/35"
          />
        ) : null}
        <div className="absolute left-4 top-4">
          <AvailabilityBadge availability={vehicle.availability} size="sm" />
        </div>
        {vehicle.isSample ? (
          <span className="label-xs absolute right-4 top-4 text-steel-dim">
            Sample listing
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-bone">
          <Link href={`/inventory/${vehicle.slug}`} className="before:absolute before:inset-0">
            {title}
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
              <dd className="mt-1 truncate text-[0.8125rem] text-bone-dim">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rule mt-5 flex items-center justify-between gap-4 pt-4">
          <span className="text-[0.8125rem] text-steel">
            {vehicle.priceDisplay}
          </span>
          <span className="link-underline text-[0.8125rem] text-bone-dim transition-colors group-hover:text-giallo">
            View vehicle
            <span aria-hidden="true"> →</span>
          </span>
        </div>
      </div>
    </article>
  );
}
