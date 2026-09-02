import type { MetadataRoute } from 'next';
import { shouldAllowIndexing } from '@/lib/production-readiness';
import { siteConfig } from '@/site.config';

/**
 * Robots policy, tied to production readiness.
 *
 * A deployment with placeholder contact details, no working enquiry delivery or a
 * local canonical is disallowed outright. Getting an obviously unfinished site into
 * the index is harder to undo than waiting until it is finished.
 */
export default function robots(): MetadataRoute.Robots {
  if (!shouldAllowIndexing()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
