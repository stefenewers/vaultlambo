import Image from 'next/image';
import type { Vehicle } from '@/lib/types';

type Props = {
  vehicle: Vehicle;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Lead image for a vehicle, with a neutral fallback for listings that have no
 * photography yet. Add files to `public/images/vehicles/<slug>/` and list them in the
 * vehicle's `images` array to replace the fallback.
 */
export function VehicleThumb({ vehicle, sizes, priority = false, className = '' }: Props) {
  const lead = vehicle.images[0];

  if (!lead) {
    return (
      <div
        className={`photo-pending flex h-full w-full items-end justify-start p-5 ${className}`}
      >
        <span className="label-xs text-steel-dim">Photography pending</span>
      </div>
    );
  }

  return (
    <Image
      src={lead.src}
      alt={lead.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${className}`}
    />
  );
}
