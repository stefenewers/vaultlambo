import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vehicleJsonLd } from '@/lib/jsonld';
import {
  getPublishedInventory,
  getPublishedSoldVehicles,
  getSoldVehicleBySlug,
  recordHref,
} from '@/lib/vehicles';

/**
 * Structured data and generated routes are where an unsupported claim does the most
 * damage — a search engine will repeat it long after the page has been corrected.
 */

describe('vehicle structured data', () => {
  const temerario = getSoldVehicleBySlug('lamborghini-temerario-giallo-inti');
  if (!temerario) throw new Error('The documented Temerario record is missing.');

  it('describes a specific car as a Vehicle', () => {
    const data = vehicleJsonLd(temerario);
    expect(data['@type']).toBe('Vehicle');
    expect(data.name).toContain('Temerario');
    expect(data.color).toBe('Giallo Inti');
  });

  it('invents no offer, price, VIN, mileage, condition or seller', () => {
    const data = vehicleJsonLd(temerario);
    for (const field of [
      'offers',
      'price',
      'vehicleIdentificationNumber',
      'mileageFromOdometer',
      'itemCondition',
      'seller',
      'address',
      'location',
    ]) {
      expect(data[field], `${field} should not be emitted`).toBeUndefined();
    }
  });

  it('does not offer factory renderings as photographs of the car', () => {
    // The Temerario's gallery is entirely configuration renderings and its only
    // photograph is a cabin shot, so no `image` should be asserted from renderings.
    const data = vehicleJsonLd(temerario);
    const images = (data.image as string[] | undefined) ?? [];
    for (const src of images) {
      expect(src).toContain('delivery-photograph');
    }
  });

  it('emits no structured data at all for sourcing categories', async () => {
    // Sourcing categories have no page, no route and no markup. The old per-model
    // pages emitted a WebPage/ProductModel pair; nothing replaces it, because there is
    // nothing to describe that would not read as a product listing.
    const jsonld = await import('@/lib/jsonld');
    expect(Object.keys(jsonld)).not.toContain('sourcingModelJsonLd');
    expect(Object.keys(jsonld)).not.toContain('sourcingCategoryJsonLd');
  });
});

describe('organisation structured data', () => {
  const ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...ENV };
    vi.resetModules();
  });

  async function load(env: Record<string, string | undefined>) {
    process.env = { ...ENV, ...env };
    return import('@/lib/jsonld');
  }

  const CONFIGURED = {
    NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com',
    NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
    RESEND_API_KEY: 'test-key-not-used',
    INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
  };

  it('emits nothing while the business details are missing', async () => {
    const { organizationJsonLd } = await load({
      NEXT_PUBLIC_CONTACT_EMAIL: undefined,
      RESEND_API_KEY: undefined,
      INQUIRY_FROM_EMAIL: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });

    expect(organizationJsonLd()).toBeNull();
  });

  it('emits nothing while the classification is unconfirmed', async () => {
    const { organizationJsonLd } = await load({
      ...CONFIGURED,
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: undefined,
    });

    expect(organizationJsonLd()).toBeNull();
  });

  it('emits a conservative Organization for a sourcing agent', async () => {
    const { organizationJsonLd } = await load({
      ...CONFIGURED,
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'sourcing-agent',
    });

    const data = organizationJsonLd();
    expect(data?.['@type']).toBe('Organization');
    expect(data?.email).toBe('enquiries@marlowemotorcars.com');
  });

  it('does not claim AutoDealer without a licence on file', async () => {
    const { organizationJsonLd } = await load({
      ...CONFIGURED,
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'dealer',
      NEXT_PUBLIC_DEALER_LICENSE_NUMBER: undefined,
      NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION: undefined,
    });

    // The missing licence is itself a blocker, so nothing is emitted at all.
    expect(organizationJsonLd()).toBeNull();
  });

  it('emits AutoDealer only for a confirmed, licensed dealer', async () => {
    const { organizationJsonLd } = await load({
      ...CONFIGURED,
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'dealer',
      NEXT_PUBLIC_DEALER_LICENSE_NUMBER: 'DL-000000',
      NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION: 'California',
    });

    expect(organizationJsonLd()?.['@type']).toBe('AutoDealer');
  });
});

describe('generated routes and sitemap', () => {
  const ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ENV };
    vi.resetModules();
  });

  it('generates no inventory detail routes while nothing is listed', () => {
    expect(getPublishedInventory().map((v) => ({ slug: v.slug }))).toEqual([]);
  });

  it('generates one route per published record and nothing else', async () => {
    vi.resetModules();
    process.env = { ...ENV, NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com' };
    const { default: sitemap } = await import('@/app/sitemap');

    const urls = sitemap().map((entry) => entry.url);
    const published = [...getPublishedInventory(), ...getPublishedSoldVehicles()];

    for (const record of published) {
      expect(urls).toContain(`https://marlowemotorcars.com${recordHref(record)}`);
    }

    // Nothing unpublished, and no stale /inventory/<model> URLs from the old data set.
    expect(urls.some((u) => u.includes('/inventory/'))).toBe(false);

    // Per-model sourcing pages are gone and their routes redirect, so no /sourcing/<slug>
    // URL may be submitted for indexing.
    expect(urls.some((u) => /\/sourcing\/.+/.test(u))).toBe(false);

    // The credits page went with the external photography it existed to attribute.
    expect(urls.some((u) => u.endsWith('/credits'))).toBe(false);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it('omits the empty inventory listing from the sitemap', async () => {
    vi.resetModules();
    process.env = { ...ENV, NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com' };
    const { default: sitemap } = await import('@/app/sitemap');

    expect(sitemap().map((e) => e.url)).not.toContain(
      'https://marlowemotorcars.com/inventory',
    );
  });

  it('disallows crawling entirely while the site is not production ready', async () => {
    vi.resetModules();
    process.env = {
      ...ENV,
      NEXT_PUBLIC_CONTACT_EMAIL: undefined,
      RESEND_API_KEY: undefined,
      INQUIRY_FROM_EMAIL: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    };
    const { default: robots } = await import('@/app/robots');

    const rules = robots().rules as { disallow?: string };
    expect(rules.disallow).toBe('/');
    expect(robots().sitemap).toBeUndefined();
  });

  it('allows crawling once the site is production ready', async () => {
    vi.resetModules();
    process.env = {
      ...ENV,
      NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'sourcing-agent',
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
      NEXT_PUBLIC_ALLOW_INDEXING: undefined,
    };
    const { default: robots } = await import('@/app/robots');

    const rules = robots().rules as { allow?: string };
    expect(rules.allow).toBe('/');
    expect(robots().sitemap).toBe('https://marlowemotorcars.com/sitemap.xml');
  });
});
