import type { Vehicle } from '@/lib/types';
import { vehicleModelLine } from '@/lib/vehicles';

/**
 * Stand-in used while a listing has no photography. Typographic rather than
 * illustrative: marque, model and category set on a flat charcoal panel with a
 * hairline frame. Drop files into the vehicle's `images` array and this is replaced
 * with no other change.
 */
export function VehicleImagePanel({
  vehicle,
  size = 'card',
}: {
  vehicle: Vehicle;
  size?: 'card' | 'thumb' | 'stage';
}) {
  if (size === 'thumb') {
    return (
      <div className="image-panel flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
        <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-steel-dim">
          {vehicle.make}
        </span>
        <span className="line-clamp-2 text-[0.6875rem] leading-tight text-bone-dim">
          {vehicleModelLine(vehicle)}
        </span>
      </div>
    );
  }

  const isStage = size === 'stage';

  return (
    <div className="image-panel flex h-full w-full items-center justify-center p-6">
      <div
        className={`flex h-full w-full flex-col items-center justify-center border border-line text-center ${
          isStage ? 'gap-4 p-10' : 'gap-3 p-6'
        }`}
      >
        <p className="label-xs text-steel-dim">{vehicle.make}</p>
        <p
          className={`font-medium tracking-[-0.02em] text-bone-dim ${
            isStage ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {vehicleModelLine(vehicle)}
        </p>
        <span aria-hidden="true" className="block h-px w-8 bg-line-strong" />
        <p className="label-xs text-steel-dim">{vehicle.category}</p>
      </div>
    </div>
  );
}
