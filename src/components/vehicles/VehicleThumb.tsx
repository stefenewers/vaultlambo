import Image from 'next/image';
import { VehicleImagePanel } from '@/components/vehicles/VehicleImagePanel';
import type { Vehicle } from '@/lib/types';

type Props = {
  vehicle: Vehicle;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Controls the typographic panel shown when the vehicle has no photography. */
  panelSize?: 'card' | 'thumb' | 'stage';
};

/** Lead image for a vehicle, falling back to the typographic panel. */
export function VehicleThumb({
  vehicle,
  sizes,
  priority = false,
  className = '',
  panelSize = 'card',
}: Props) {
  const lead = vehicle.images[0];

  if (!lead) return <VehicleImagePanel vehicle={vehicle} size={panelSize} />;

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
