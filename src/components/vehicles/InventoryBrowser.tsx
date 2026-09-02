'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EMPTY_FILTERS, FilterBar, type Filters } from '@/components/vehicles/FilterBar';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { inventoryCopy } from '@/content/copy';
import type { InventoryVehicle } from '@/lib/types';
import { CATEGORY_ORDER, uniqueSorted, vehicleTitle } from '@/lib/vehicles';

/**
 * Filter and search over active inventory.
 *
 * Only ever receives `InventoryVehicle[]` — specific cars actually on offer. Sold cars
 * and sourcing models cannot reach it, so the availability filter no longer offers
 * "Sold" as a way to browse model briefs.
 */
export function InventoryBrowser({ vehicles }: { vehicles: InventoryVehicle[] }) {
  const params = useSearchParams();

  // Category and availability can be deep-linked, e.g. from the footer.
  const [filters, setFilters] = useState<Filters>(() => {
    const category = params.get('category');
    const availability = params.get('availability');
    return {
      ...EMPTY_FILTERS,
      category:
        category && CATEGORY_ORDER.some((c) => c === category) ? category : 'all',
      availability:
        availability === 'available' || availability === 'reserved' ? availability : 'all',
    };
  });

  const makes = useMemo(() => uniqueSorted(vehicles.map((v) => v.make)), [vehicles]);

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => vehicles.some((v) => v.category === c)),
    [vehicles],
  );

  const years = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.year)))
        .sort((a, b) => b - a)
        .map(String),
    [vehicles],
  );

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return vehicles.filter((v) => {
      if (filters.availability !== 'all' && v.availability !== filters.availability) {
        return false;
      }
      if (filters.make !== 'all' && v.make !== filters.make) return false;
      if (filters.category !== 'all' && v.category !== filters.category) return false;
      if (filters.year !== 'all' && String(v.year) !== filters.year) return false;
      if (q) {
        const haystack = [vehicleTitle(v), v.category, v.bodyStyle, v.subtitle ?? '']
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  return (
    <div>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        makes={makes}
        categories={categories}
        years={years}
        resultCount={results.length}
        totalCount={vehicles.length}
      />

      {/* Announce result changes to screen readers without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {results.length} {results.length === 1 ? 'vehicle' : 'vehicles'} matching the
        current filters.
      </p>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="display-3 text-bone">{inventoryCopy.empty.title}</p>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-steel">
            {inventoryCopy.empty.body}
          </p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="btn btn-primary mt-8"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-16 py-14 sm:grid-cols-2 sm:py-20 xl:grid-cols-3">
          {results.map((vehicle, i) => (
            <li key={vehicle.slug} className="h-full">
              <VehicleCard vehicle={vehicle} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
