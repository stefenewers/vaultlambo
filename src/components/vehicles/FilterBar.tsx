'use client';

import { useId, useState } from 'react';
import type { Availability } from '@/lib/types';
import { AVAILABILITY_LABEL, AVAILABILITY_ORDER } from '@/lib/vehicles';

export type Filters = {
  query: string;
  availability: Availability | 'all';
  make: string;
  category: string;
  year: string;
};

export const EMPTY_FILTERS: Filters = {
  query: '',
  availability: 'all',
  make: 'all',
  category: 'all',
  year: 'all',
};

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
  makes: string[];
  categories: string[];
  years: string[];
  resultCount: number;
  totalCount: number;
};

export function FilterBar({
  filters,
  onChange,
  makes,
  categories,
  years,
  resultCount,
  totalCount,
}: Props) {
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const searchId = useId();
  const panelId = useId();

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const activeCount = (
    ['availability', 'make', 'category', 'year'] as const
  ).filter((k) => filters[k] !== 'all').length;

  const isFiltered = activeCount > 0 || filters.query.trim() !== '';

  return (
    <div className="border-y border-line bg-ink">
      {/* Row 1: search + mobile disclosure + count */}
      <div className="flex items-center gap-3 py-3">
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Search inventory by make or model
          </label>
          <input
            id={searchId}
            type="search"
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="Search make or model"
            autoComplete="off"
            className="h-11 w-full border border-line bg-ink-raised pl-10 pr-3 text-[0.9375rem] text-bone placeholder:text-steel-dim transition-colors focus:border-line-strong"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-dim"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="4.6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpenOnMobile((v) => !v)}
          aria-expanded={openOnMobile}
          aria-controls={panelId}
          className="inline-flex h-11 shrink-0 items-center gap-2 border border-line px-4 text-[0.8125rem] text-bone transition-colors hover:border-line-strong lg:hidden"
        >
          Filters
          {activeCount > 0 ? (
            <span className="inline-flex h-4 min-w-4 items-center justify-center border border-line-strong px-1 text-[0.625rem] font-medium tabular-nums text-bone">
              {activeCount}
            </span>
          ) : null}
        </button>

        <p className="hidden shrink-0 text-[0.8125rem] tabular-nums text-steel lg:block">
          {resultCount} of {totalCount}
        </p>
      </div>

      {/* Row 2: selects. Always visible on desktop, disclosure on mobile. */}
      <div
        id={panelId}
        className={`${openOnMobile ? 'grid' : 'hidden'} grid-cols-1 gap-3 border-t border-line py-4 sm:grid-cols-2 lg:!grid lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-center lg:border-t-0 lg:pb-4 lg:pt-0`}
      >
        <Select
          label="Availability"
          value={filters.availability}
          onChange={(v) => set('availability', v as Availability | 'all')}
          options={[
            { value: 'all', label: 'Any availability' },
            ...AVAILABILITY_ORDER.map((a) => ({ value: a, label: AVAILABILITY_LABEL[a] })),
          ]}
        />
        <Select
          label="Make"
          value={filters.make}
          onChange={(v) => set('make', v)}
          options={[
            { value: 'all', label: 'Any make' },
            ...makes.map((m) => ({ value: m, label: m })),
          ]}
        />
        <Select
          label="Category"
          value={filters.category}
          onChange={(v) => set('category', v)}
          options={[
            { value: 'all', label: 'Any category' },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Select
          label="Year"
          value={filters.year}
          onChange={(v) => set('year', v)}
          options={[
            { value: 'all', label: 'Any year' },
            ...years.map((y) => ({ value: y, label: y })),
          ]}
        />

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p className="text-[0.8125rem] tabular-nums text-steel lg:hidden">
            {resultCount} of {totalCount}
          </p>
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={!isFiltered}
            className="h-11 shrink-0 text-[0.8125rem] text-steel underline-offset-4 transition-colors enabled:hover:text-bone enabled:hover:underline disabled:cursor-default disabled:opacity-40 lg:h-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  const isSet = value !== 'all';

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full cursor-pointer appearance-none border bg-ink-raised pl-3.5 pr-9 text-[0.9375rem] transition-colors focus:border-line-strong ${
          isSet
            ? 'border-line-strong text-bone'
            : 'border-line text-bone-dim hover:border-line-strong'
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#101012] text-[#f3f0ea]">
            {o.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-steel-dim"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </div>
  );
}
