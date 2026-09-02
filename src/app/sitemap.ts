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
 * Built from the published accessors, so an unpublished draft can never appear here.
 * `/inventory` itself is listed only when something is on offer — submitting an empty
 * listing page for indexing is not useful to anyone.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    ...(hasPublishedInventory() ? ['/inventory'] : []),
    '/sourcing',
    '/sold-vehicles',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/credits',
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const records = [
    ...getPublishedInventory(),
    ...getPublishedSoldVehicles(),
    ...getPublishedSourcingModels(),
  ].map((record) => ({
    url: `${siteConfig.url}${recordHref(record)}`,
    changeFrequency: 'monthly' as const,
    priority: record.kind === 'inventory' ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...records];
}
