import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  detectPlaceholder,
  isEphemeralVercelUrl,
  isLocalUrl,
} from '@/lib/production-readiness';

/**
 * The readiness checks gate indexing and structured data, so a false pass here means
 * a half-configured site advertising itself to search engines.
 *
 * `siteConfig` reads the environment once at module load, so tests that need a
 * different configuration re-import the modules under `vi.resetModules()`.
 */

describe('placeholder detection', () => {
  it('catches example.com addresses', () => {
    expect(detectPlaceholder('sales@example.com')).toBe('an example.com placeholder');
    expect(detectPlaceholder('https://example.org')).toBeTruthy();
  });

  it('catches zero-filled phone numbers in several formats', () => {
    expect(detectPlaceholder('+1 (000) 000-0000')).toBe('a zero-filled phone number');
    expect(detectPlaceholder('000-000-0000')).toBe('a zero-filled phone number');
    expect(detectPlaceholder('000 000 0000')).toBe('a zero-filled phone number');
  });

  it('catches unresolved TODO markers', () => {
    expect(detectPlaceholder('TODO: add real address')).toBe(
      'an unresolved TODO marker',
    );
    expect(detectPlaceholder('TBD')).toBeTruthy();
    expect(detectPlaceholder('CHANGEME')).toBeTruthy();
  });

  it('catches unedited template values', () => {
    expect(detectPlaceholder('hello@your-domain.com')).toBeTruthy();
    expect(detectPlaceholder('Placeholder text')).toBeTruthy();
  });

  it('passes real values through', () => {
    expect(detectPlaceholder('enquiries@marlowemotorcars.com')).toBeNull();
    expect(detectPlaceholder('+1 (415) 555-0142')).toBeNull();
    expect(detectPlaceholder('https://marlowemotorcars.com')).toBeNull();
    expect(detectPlaceholder(null)).toBeNull();
    expect(detectPlaceholder('')).toBeNull();
  });

  it('does not flag a legitimate number that merely contains zeros', () => {
    expect(detectPlaceholder('+1 (200) 300-4000')).toBeNull();
  });
});

describe('canonical origin checks', () => {
  it('recognises local origins', () => {
    expect(isLocalUrl('http://localhost:3000')).toBe(true);
    expect(isLocalUrl('http://127.0.0.1:3000')).toBe(true);
    expect(isLocalUrl('https://marlowemotorcars.com')).toBe(false);
  });

  it('recognises a Vercel deployment host as not yet branded', () => {
    expect(isEphemeralVercelUrl('https://vaultlambo.vercel.app')).toBe(true);
    expect(isEphemeralVercelUrl('https://marlowemotorcars.com')).toBe(false);
  });
});

describe('findings drive indexing', () => {
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
    return import('@/lib/production-readiness');
  }

  it('blocks indexing while contact and delivery are unconfigured', async () => {
    const { isProductionReady, shouldAllowIndexing, productionFindings } = await load({
      NEXT_PUBLIC_CONTACT_EMAIL: undefined,
      RESEND_API_KEY: undefined,
      INQUIRY_FROM_EMAIL: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });

    expect(isProductionReady()).toBe(false);
    expect(shouldAllowIndexing()).toBe(false);

    const fields = productionFindings().map((f) => f.field);
    expect(fields).toContain('NEXT_PUBLIC_CONTACT_EMAIL');
    expect(fields).toContain('RESEND_API_KEY');
    expect(fields).toContain('INQUIRY_FROM_EMAIL');
    expect(fields).toContain('NEXT_PUBLIC_SITE_URL');
  });

  it('reports a placeholder email as blocking rather than accepting it', async () => {
    const { productionFindings } = await load({
      NEXT_PUBLIC_CONTACT_EMAIL: 'sales@example.com',
    });

    const finding = productionFindings().find(
      (f) => f.field === 'NEXT_PUBLIC_CONTACT_EMAIL',
    );
    expect(finding?.severity).toBe('blocker');
    expect(finding?.problem).toContain('example.com');
  });

  it('allows indexing once everything blocking is supplied', async () => {
    const { isProductionReady, shouldAllowIndexing, productionFindings } = await load({
      NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'sourcing-agent',
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
      NEXT_PUBLIC_ALLOW_INDEXING: undefined,
    });

    expect(productionFindings().filter((f) => f.severity === 'blocker')).toHaveLength(0);
    expect(isProductionReady()).toBe(true);
    expect(shouldAllowIndexing()).toBe(true);
  });

  it('lets a complete staging deployment force noindex', async () => {
    const { isProductionReady, shouldAllowIndexing } = await load({
      NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'sourcing-agent',
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
    });

    expect(isProductionReady()).toBe(true);
    expect(shouldAllowIndexing()).toBe(false);
  });

  it('blocks a dealer claim that has no licence behind it', async () => {
    const { productionFindings } = await load({
      NEXT_PUBLIC_SITE_URL: 'https://marlowemotorcars.com',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'dealer',
      NEXT_PUBLIC_DEALER_LICENSE_NUMBER: undefined,
      NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION: undefined,
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
    });

    const finding = productionFindings().find(
      (f) => f.field === 'NEXT_PUBLIC_DEALER_LICENSE_NUMBER',
    );
    expect(finding?.severity).toBe('blocker');
  });

  it('treats a bare Vercel host as a warning, not a blocker', async () => {
    const { productionFindings, isProductionReady } = await load({
      NEXT_PUBLIC_SITE_URL: 'https://vaultlambo.vercel.app',
      NEXT_PUBLIC_CONTACT_EMAIL: 'enquiries@marlowemotorcars.com',
      NEXT_PUBLIC_BUSINESS_CLASSIFICATION: 'sourcing-agent',
      RESEND_API_KEY: 'test-key-not-used',
      INQUIRY_FROM_EMAIL: 'site@marlowemotorcars.com',
    });

    const finding = productionFindings().find((f) => f.field === 'NEXT_PUBLIC_SITE_URL');
    expect(finding?.severity).toBe('warning');
    expect(isProductionReady()).toBe(true);
  });
});
