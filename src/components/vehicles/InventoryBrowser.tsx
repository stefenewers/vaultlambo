'use client';

import { useMemo, useState } from 'react';
import {
  EMPTY_FILTERS,
  FilterBar,
  type Filters,
} from '@/components/vehicles/FilterBar';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import type { Vehicle } from '@/lib/types';
import { uniqueSorted, vehicleTitle } from '@/lib/vehicles';
import { inventoryCopy } from '@/content/copy';

export function InventoryBrowser({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const makes = useMemo(() => uniqueSorted(vehicles.map((v) => v.make)), [vehicles]);
  const bodyStyles = useMemo(
    () => uniqueSorted(vehicles.map((v) => v.bodyStyle)),
    [vehicles],
  );
  const years = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((v) => v.year).filter((y): y is number => y != null)),
      )
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
      if (filters.bodyStyle !== 'all' && v.bodyStyle !== filters.bodyStyle) return false;
      if (filters.year !== 'all' && String(v.year ?? '') !== filters.year) return false;
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
        bodyStyles={bodyStyles}
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
            className="mt-8 inline-flex h-11 items-center border border-line-strong px-6 text-[0.8125rem] text-bone transition-colors hover:border-giallo hover:text-giallo"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 py-12 sm:grid-cols-2 sm:py-16 xl:grid-cols-3">
          {results.map((vehicle, i) => (
            <li key={vehicle.slug}>
              <VehicleCard vehicle={vehicle} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
