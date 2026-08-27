import type { MetadataRoute } from 'next';
import { getAllVehicles } from '@/lib/vehicles';
import { siteConfig } from '@/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/inventory', '/sold', '/about', '/contact'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Sample listings are excluded — they are demonstration records, not inventory.
  const vehicleRoutes = getAllVehicles()
    .filter((v) => !v.isSample)
    .map((v) => ({
      url: `${siteConfig.url}/inventory/${v.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...vehicleRoutes];
}
