/**
 * Central brand + contact configuration.
 *
 * Everything a new owner needs to rebrand this site lives in this file. Nothing in
 * `src/components` hard-codes a company name, address, phone number or legal string.
 */

export type NavItem = { label: string; href: string };

export const siteConfig = {
  /** Displayed everywhere the company is named. */
  name: 'Apex Motor Collection',
  /** Short form used in the wordmark and in tight spaces. */
  shortName: 'Apex',
  /** Used after the page title in <title> and in the footer lockup. */
  tagline: 'Curated performance, collector and special-order vehicles',

  /**
   * Canonical origin, used for metadata, canonical URLs, sitemap and JSON-LD.
   * Replace before deploying.
   */
  url: 'https://example.com',

  description:
    'A small collection of carefully sourced performance, collector and special-order ' +
    'vehicles, with a documented archive of vehicles that have found their owners.',

  contact: {
    email: 'hello@example.com',
    /** Set to null to hide the phone number across the site. */
    phone: '+1 (000) 000-0000',
    /**
     * Free-form. Kept deliberately non-specific — replace with a real address only
     * when there is one. Set to null to hide the line entirely.
     */
    location: 'By appointment',
    /** Set to null to hide the response-time line on the contact page. */
    responseTime: 'Inquiries are answered by a person, usually within one business day.',
  },

  /**
   * Social/profile links. Remove entries or set the array to [] to hide the row.
   * Only add links that actually exist.
   */
  social: [] as NavItem[],

  nav: [
    { label: 'Inventory', href: '/inventory' },
    { label: 'Sold', href: '/sold' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],

  /**
   * Set to false once the sample listings in `src/data/vehicles.ts` have been replaced
   * with real inventory. Controls the site-wide demonstration notice.
   */
  showSampleInventoryNotice: true,

  legal: {
    /** Rendered in the footer on every page. */
    affiliationDisclaimer:
      'Independent vehicle broker. Not affiliated with, endorsed by, or authorised by ' +
      'any vehicle manufacturer, including Automobili Lamborghini S.p.A. All model ' +
      'names, marks and designations are the property of their respective owners and ' +
      'are used for identification purposes only.',
    /** Rendered alongside inventory when `showSampleInventoryNotice` is true. */
    sampleInventoryNotice:
      'Sample inventory shown for demonstration. Listings other than the documented ' +
      'archive entries are placeholder records, not vehicles held for sale.',
    /** Rendered on vehicle detail pages under the documentation block. */
    documentationNotice:
      'Original configuration and import documentation is retained on file and can be ' +
      'made available to relevant authorities and verified parties on request. It is ' +
      'not published here, and no personal information relating to any owner is held ' +
      'on this site.',
  },

  /** Where the inquiry form posts. Swap for a provider endpoint when one is wired up. */
  inquiryEndpoint: '/api/inquiries',
} as const;

export type SiteConfig = typeof siteConfig;
