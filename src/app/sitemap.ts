import type { MetadataRoute } from 'next';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getPublishedSourcingModels,
  hasPublishedInventory,
  recordHref,
} from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

/**
 * Sitemap.
 *
 * Built entirely from the published accessors, so an unpublished draft can never
 * appear here. `/inventory` is submitted only when something is actually on offer —
 * asking a crawler to index an empty listing page is not useful to anyone.
 *
 * Priorities are genuinely graded rather than a flat 0.8 across the site. The value is
 * only a relative hint to a crawler, but claiming the terms page matters as much as
 * the homepage is noise.
 */

/** Priority per static route. Anything absent falls back to 0.5. */
const STATIC_PRIORITY: Record<string, number> = {
  '': 1.0,
  '/inventory': 0.9,
  '/sourcing': 0.8,
  '/commissions': 0.7,
  '/about': 0.6,
  '/contact': 0.6,
  '/privacy': 0.3,
  '/terms': 0.3,
  '/credits': 0.3,
};

/** How often each route genuinely changes. */
const STATIC_FREQUENCY: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  '': 'weekly',
  '/inventory': 'weekly',
  '/sourcing': 'monthly',
  '/commissions': 'monthly',
  '/about': 'yearly',
  '/contact': 'yearly',
  '/privacy': 'yearly',
  '/terms': 'yearly',
  '/credits': 'monthly',
};

/** Priority per record kind. Cars on offer outrank a model brief. */
const RECORD_PRIORITY = {
  inventory: 0.9,
  sourcing: 0.7,
  sold: 0.6,
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    ...(hasPublishedInventory() ? ['/inventory'] : []),
    '/sourcing',
    '/commissions',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/credits',
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: STATIC_FREQUENCY[path] ?? ('monthly' as const),
    priority: STATIC_PRIORITY[path] ?? 0.5,
  }));

  const records = [
    ...getPublishedInventory(),
    ...getPublishedSoldVehicles(),
    ...getPublishedSourcingModels(),
  ].map((record) => ({
    url: `${siteConfig.url}${recordHref(record)}`,
    changeFrequency:
      record.kind === 'inventory' ? ('weekly' as const) : ('monthly' as const),
    priority: RECORD_PRIORITY[record.kind],
    // Emitted only where a real verification date is on the record. See `updated`
    // in lib/types.ts — nothing here invents one.
    ...(record.updated ? { lastModified: new Date(record.updated) } : {}),
  }));

  return [...staticRoutes, ...records];
}
