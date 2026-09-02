/**
 * Central brand, contact and business configuration.
 *
 * Everything a real business has to supply lives here or in the environment. Nothing in
 * this file invents a value to make the site look finished: a field that has not been
 * supplied is `null`, the UI that would render it is hidden, and
 * `npm run verify:production` reports it as missing.
 *
 * Set values through environment variables (see `.env.example`) rather than editing
 * this file, so the same build can run against a staging and a production domain.
 */

export type NavItem = { label: string; href: string };

/**
 * How the business is actually classified. This drives the structured data: an
 * `AutoDealer` schema is a claim about being a dealer, and is only emitted when that
 * claim is true and the dealer information to back it is present.
 *
 *   'sourcing-agent' — sources and represents vehicles; not a licensed dealer
 *   'dealer'         — a licensed motor vehicle dealer
 *   'unconfirmed'    — not yet established; emits no organisation schema at all
 */
export type BusinessClassification = 'sourcing-agent' | 'dealer' | 'unconfirmed';

/** Reads an env var, treating blank strings as absent. */
function env(name: string): string | null {
  const value = process.env[name];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Resolve the origin used for canonical URLs, the sitemap and JSON-LD.
 *
 * Order: the branded domain, then the Vercel production domain, then the
 * per-deployment Vercel URL, then localhost. Getting this wrong on a live site points
 * every canonical at the wrong host, so it resolves rather than hard-codes.
 *
 * Until `NEXT_PUBLIC_SITE_URL` is set to the branded domain, canonicals resolve to
 * whatever Vercel is actually serving, which is correct but off-brand — see the README
 * section "Connecting the branded domain".
 */
function resolveSiteUrl(): string {
  const explicit = env('NEXT_PUBLIC_SITE_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel =
    env('VERCEL_PROJECT_PRODUCTION_URL') ?? env('VERCEL_URL');
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

/** Parses `NEXT_PUBLIC_SOCIAL_LINKS` — "Label|https://…,Label|https://…". */
function resolveSocial(): NavItem[] {
  const raw = env('NEXT_PUBLIC_SOCIAL_LINKS');
  if (!raw) return [];

  return raw
    .split(',')
    .map((entry) => entry.split('|').map((part) => part.trim()))
    .filter((parts): parts is [string, string] => parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]))
    .map(([label, href]) => ({ label, href }));
}

function resolveClassification(): BusinessClassification {
  const raw = env('NEXT_PUBLIC_BUSINESS_CLASSIFICATION');
  if (raw === 'dealer' || raw === 'sourcing-agent') return raw;
  return 'unconfirmed';
}

export const siteConfig = {
  /** Public brand name. Safe to display anywhere. */
  name: 'Marlowe Motorcars',

  /** Wordmark, set in two parts. */
  wordmark: { primary: 'MARLOWE', secondary: 'MOTORCARS' },

  /**
   * Registered legal entity, if there is one and the owner has supplied it. Rendered
   * only in the footer's legal line and in structured data. Null hides it entirely.
   */
  legalEntity: env('NEXT_PUBLIC_LEGAL_ENTITY'),

  /**
   * What the business does, in neutral language. This is deliberately not
   * "independent dealer" — that is a regulated description and is only used when
   * `classification` is 'dealer' and the licence details below are supplied.
   */
  descriptor: 'Independent automotive sourcing and vehicle representation',

  tagline: 'Cars worth finding',

  /** Canonical origin. Used for metadata, canonical URLs, sitemap and JSON-LD. */
  url: resolveSiteUrl(),

  description:
    'Marlowe Motorcars sources performance, luxury and collector vehicles to order, ' +
    'and represents individual cars where the records support it.',

  classification: resolveClassification(),

  contact: {
    /** Public enquiry address. Null until a real one is configured. */
    email: env('NEXT_PUBLIC_CONTACT_EMAIL'),
    /** Null hides the phone number across the site. */
    phone: env('NEXT_PUBLIC_CONTACT_PHONE'),
    /**
     * A truthful service area or city/state. Not a showroom address — there is no
     * showroom, and the site does not imply one.
     */
    serviceArea: env('NEXT_PUBLIC_SERVICE_AREA'),
    /** How viewings and meetings actually work. */
    appointmentPolicy: 'Viewings and inspections are arranged individually, by appointment.',
    /** Null hides the response line on the contact page. */
    responseTime: 'Enquiries are answered directly, usually within one business day.',
  },

  /**
   * Dealer licence details. Only meaningful when `classification` is 'dealer'; the
   * footer renders the number only when both are present, and no page claims dealer
   * status without it.
   */
  dealerLicense: {
    number: env('NEXT_PUBLIC_DEALER_LICENSE_NUMBER'),
    jurisdiction: env('NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION'),
  },

  /** Only links that exist. An empty array hides the row. */
  social: resolveSocial(),

  nav: [
    { label: 'Inventory', href: '/inventory' },
    { label: 'Sourcing', href: '/sourcing' },
    { label: 'Sold', href: '/sold-vehicles' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],

  legal: {
    /** One discreet line, rendered once in the footer. */
    affiliationDisclaimer:
      'Marlowe Motorcars is independent and is not affiliated with, endorsed by or ' +
      'authorised by any vehicle manufacturer. Marque and model names are the ' +
      'property of their respective owners.',
    /** Rendered once, in the documentation block on a vehicle page. */
    documentationNotice:
      'The factory configuration summary and relevant vehicle documentation are held ' +
      'privately and can be provided to appropriate parties on request.',
  },

  /** Where the enquiry form posts. */
  inquiryEndpoint: '/api/inquiries',
} as const;

export type SiteConfig = typeof siteConfig;

/** True when a public email address is configured and enquiries can actually reach it. */
export function hasPublicEmail(): boolean {
  return Boolean(siteConfig.contact.email);
}

/**
 * True when the business is confirmed as a licensed dealer *and* the licence details
 * are on file. Anything less and the site does not describe itself as a dealer.
 */
export function isLicensedDealer(): boolean {
  return (
    siteConfig.classification === 'dealer' &&
    Boolean(siteConfig.dealerLicense.number) &&
    Boolean(siteConfig.dealerLicense.jurisdiction)
  );
}
