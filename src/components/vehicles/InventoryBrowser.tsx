'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EMPTY_FILTERS, FilterBar, type Filters } from '@/components/vehicles/FilterBar';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { inventoryCopy } from '@/content/copy';
import type { InventoryVehicle } from '@/lib/types';
import { CATEGORY_ORDER, uniqueSorted, vehicleTitle } from '@/lib/vehicles';

/**
 * Filter and search over active inventory.
 *
 * Only ever receives `InventoryVehicle[]` — specific cars actually on offer. Sold cars
 * and sourcing models cannot reach it, so the availability filter cannot be used to
 * browse model briefs.
 *
 * Filter state lives in the URL rather than in component state. That makes a filtered
 * view shareable, makes browser back and forward step through filter changes, and
 * survives a refresh. The query box is the one exception to pushing history: typing
 * replaces the current entry instead of adding one per keystroke.
 */

/**
 * Below this many cars, the filter bar is not rendered at all. Filtering three cars is
 * theatre — it makes a small, honest inventory look like a system pretending to be
 * bigger than it is.
 */
const MIN_VEHICLES_FOR_FILTERS = 4;

/** How long to wait after the last keystroke before writing the query to the URL. */
const QUERY_DEBOUNCE_MS = 300;

function parseFilters(params: URLSearchParams, vehicles: InventoryVehicle[]): Filters {
  const category = params.get('category');
  const availability = params.get('availability');
  const make = params.get('make');
  const year = params.get('year');

  return {
    query: params.get('q') ?? '',
    category: category && CATEGORY_ORDER.some((c) => c === category) ? category : 'all',
    availability:
      availability === 'available' || availability === 'reserved' ? availability : 'all',
    // Only accept a make or year that something in the data actually has, so a
    // hand-edited URL cannot produce a filter with no way back.
    make: make && vehicles.some((v) => v.make === make) ? make : 'all',
    year: year && vehicles.some((v) => String(v.year) === year) ? year : 'all',
  };
}

/** Filters → query string. Defaults are omitted so a clean view has a clean URL. */
function toQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.availability !== 'all') params.set('availability', filters.availability);
  if (filters.make !== 'all') params.set('make', filters.make);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.year !== 'all') params.set('year', filters.year);
  return params.toString();
}

export function InventoryBrowser({ vehicles }: { vehicles: InventoryVehicle[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showFilters = vehicles.length >= MIN_VEHICLES_FOR_FILTERS;

  // The URL is the source of truth, so back/forward re-render with the right filters.
  const urlFilters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString()), vehicles),
    [searchParams, vehicles],
  );

  /*
   * The query box is held locally as well so typing stays responsive, then written to
   * the URL once the user pauses. Everything else writes through immediately.
   */
  const [draftQuery, setDraftQuery] = useState(urlFilters.query);
  const lastPushedQuery = useRef(urlFilters.query);

  // Keep the box in step when the URL changes from outside — back, forward, or Clear.
  useEffect(() => {
    if (urlFilters.query !== lastPushedQuery.current) {
      lastPushedQuery.current = urlFilters.query;
      setDraftQuery(urlFilters.query);
    }
  }, [urlFilters.query]);

  const navigate = useCallback(
    (next: Filters, mode: 'push' | 'replace') => {
      const qs = toQueryString(next);
      const href = qs ? `${pathname}?${qs}` : pathname;
      router[mode](href, { scroll: false });
    },
    [pathname, router],
  );

  // Debounce query writes so a search does not add one history entry per character.
  useEffect(() => {
    if (draftQuery === urlFilters.query) return;

    const timer = setTimeout(() => {
      lastPushedQuery.current = draftQuery;
      navigate({ ...urlFilters, query: draftQuery }, 'replace');
    }, QUERY_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [draftQuery, urlFilters, navigate]);

  const onFiltersChange = useCallback(
    (next: Filters) => {
      if (next.query !== urlFilters.query) {
        // Came from the search box: update the draft and let the debounce handle it.
        setDraftQuery(next.query);
        return;
      }
      // A select changed. Discrete choices are worth a history entry.
      navigate(next, 'push');
    },
    [urlFilters, navigate],
  );

  const clearFilters = useCallback(() => {
    lastPushedQuery.current = '';
    setDraftQuery('');
    navigate(EMPTY_FILTERS, 'push');
  }, [navigate]);

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

  /*
   * Results follow the URL, not the draft, except for the query — matching on the
   * draft keeps the grid live while typing instead of lagging the debounce.
   */
  const activeFilters: Filters = useMemo(
    () => (showFilters ? { ...urlFilters, query: draftQuery } : EMPTY_FILTERS),
    [showFilters, urlFilters, draftQuery],
  );

  const results = useMemo(() => {
    const q = activeFilters.query.trim().toLowerCase();

    return vehicles.filter((v) => {
      if (
        activeFilters.availability !== 'all' &&
        v.availability !== activeFilters.availability
      ) {
        return false;
      }
      if (activeFilters.make !== 'all' && v.make !== activeFilters.make) return false;
      if (activeFilters.category !== 'all' && v.category !== activeFilters.category) {
        return false;
      }
      if (activeFilters.year !== 'all' && String(v.year) !== activeFilters.year) {
        return false;
      }
      if (q) {
        const haystack = [vehicleTitle(v), v.category, v.bodyStyle, v.subtitle ?? '']
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [vehicles, activeFilters]);

  return (
    <div>
      {showFilters ? (
        <FilterBar
          filters={activeFilters}
          onChange={onFiltersChange}
          onClear={clearFilters}
          makes={makes}
          categories={categories}
          years={years}
          resultCount={results.length}
          totalCount={vehicles.length}
        />
      ) : null}

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
          <button type="button" onClick={clearFilters} className="btn btn-primary mt-8">
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
