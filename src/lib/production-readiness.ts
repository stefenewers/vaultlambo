/**
 * Production-readiness checks.
 *
 * One source of truth for "is this site safe to publish as a real business", used by
 * three callers that must never disagree:
 *
 *   - `npm run verify:production`, which lists what is still missing
 *   - `robots.ts` and the root metadata, which refuse to let an incomplete site be
 *     indexed rather than shipping placeholder details to search engines
 *   - `lib/jsonld.ts`, which declines to emit organisation structured data that would
 *     assert facts nobody has supplied
 *
 * Nothing here invents a value to make a check pass. A failing check means the owner
 * still has to supply something.
 */

import { siteConfig, isLicensedDealer } from '@/site.config';

export type Severity = 'blocker' | 'warning';

export type Finding = {
  severity: Severity;
  /** The env var or config field that needs a value. */
  field: string;
  /** What is wrong, in one line. */
  problem: string;
  /** What the owner has to do about it. */
  remedy: string;
};

/** Values that mean "nobody has filled this in yet". */
const PLACEHOLDER_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /example\.(com|org|net)/i, label: 'an example.com placeholder' },
  { pattern: /(^|\D)0{3}[)\s.-]*0{3}[\s.-]*0{4}(\D|$)/, label: 'a zero-filled phone number' },
  { pattern: /\b(TODO|TBD|FIXME|CHANGEME|XXX)\b/i, label: 'an unresolved TODO marker' },
  { pattern: /\byour-?(domain|company|email)\b/i, label: 'an unedited template value' },
  { pattern: /\b(placeholder|lorem ipsum)\b/i, label: 'placeholder text' },
];

/** Returns the placeholder description if `value` looks unfilled, else null. */
export function detectPlaceholder(value: string | null | undefined): string | null {
  if (!value) return null;
  for (const { pattern, label } of PLACEHOLDER_PATTERNS) {
    if (pattern.test(value)) return label;
  }
  return null;
}

const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i;

/** A canonical URL pointing at a developer's own machine must never ship. */
export function isLocalUrl(url: string): boolean {
  return LOCAL_HOST.test(url);
}

/** A per-deployment Vercel preview host is not a stable canonical origin. */
export function isEphemeralVercelUrl(url: string): boolean {
  return /\.vercel\.app$/i.test(new URL(url).hostname);
}

/**
 * Every readiness finding, most severe first.
 *
 * `blocker` means the site would publish something untrue or unusable, and gates
 * indexing. `warning` means the site is honest but incomplete.
 */
export function productionFindings(): Finding[] {
  const findings: Finding[] = [];
  const { contact, url, classification, legalEntity } = siteConfig;

  // --- Contact -------------------------------------------------------------
  if (!contact.email) {
    findings.push({
      severity: 'blocker',
      field: 'NEXT_PUBLIC_CONTACT_EMAIL',
      problem: 'No public enquiry address is configured.',
      remedy:
        'Set NEXT_PUBLIC_CONTACT_EMAIL to the address enquiries should be answered from.',
    });
  } else {
    const placeholder = detectPlaceholder(contact.email);
    if (placeholder) {
      findings.push({
        severity: 'blocker',
        field: 'NEXT_PUBLIC_CONTACT_EMAIL',
        problem: `The contact email is ${placeholder} (${contact.email}).`,
        remedy: 'Replace it with a real, monitored address.',
      });
    }
  }

  const phonePlaceholder = detectPlaceholder(contact.phone);
  if (phonePlaceholder) {
    findings.push({
      severity: 'blocker',
      field: 'NEXT_PUBLIC_CONTACT_PHONE',
      problem: `The contact phone number is ${phonePlaceholder} (${contact.phone}).`,
      remedy: 'Set a real number, or leave NEXT_PUBLIC_CONTACT_PHONE unset to hide it.',
    });
  }

  // --- Canonical origin ----------------------------------------------------
  if (isLocalUrl(url)) {
    findings.push({
      severity: 'blocker',
      field: 'NEXT_PUBLIC_SITE_URL',
      problem: `Canonical URLs resolve to a local address (${url}).`,
      remedy:
        'Set NEXT_PUBLIC_SITE_URL to the deployed origin, or deploy where VERCEL_URL is set.',
    });
  } else if (detectPlaceholder(url)) {
    findings.push({
      severity: 'blocker',
      field: 'NEXT_PUBLIC_SITE_URL',
      problem: `The canonical origin is ${detectPlaceholder(url)} (${url}).`,
      remedy: 'Set NEXT_PUBLIC_SITE_URL to the real domain.',
    });
  } else if (isEphemeralVercelUrl(url)) {
    findings.push({
      severity: 'warning',
      field: 'NEXT_PUBLIC_SITE_URL',
      problem: `Canonicals point at a Vercel deployment host (${url}), not a branded domain.`,
      remedy:
        'Attach the Marlowe Motorcars domain in Vercel and set NEXT_PUBLIC_SITE_URL to it. ' +
        'The site stays correct and indexable in the meantime.',
    });
  }

  // --- Email delivery ------------------------------------------------------
  if (!process.env.RESEND_API_KEY) {
    findings.push({
      severity: 'blocker',
      field: 'RESEND_API_KEY',
      problem: 'No email provider key is set, so enquiries cannot be delivered.',
      remedy: 'Create a Resend API key and set RESEND_API_KEY.',
    });
  }

  if (!process.env.INQUIRY_FROM_EMAIL) {
    findings.push({
      severity: 'blocker',
      field: 'INQUIRY_FROM_EMAIL',
      problem: 'No verified sender address is configured for outgoing enquiry email.',
      remedy:
        'Verify a sending domain in Resend and set INQUIRY_FROM_EMAIL to an address on it.',
    });
  } else if (detectPlaceholder(process.env.INQUIRY_FROM_EMAIL)) {
    findings.push({
      severity: 'blocker',
      field: 'INQUIRY_FROM_EMAIL',
      problem: `The sender address is ${detectPlaceholder(process.env.INQUIRY_FROM_EMAIL)}.`,
      remedy: 'Set it to an address on your verified sending domain.',
    });
  }

  const destination = process.env.INQUIRY_TO_EMAIL ?? siteConfig.contact.email;
  if (destination && detectPlaceholder(destination)) {
    findings.push({
      severity: 'blocker',
      field: 'INQUIRY_TO_EMAIL',
      problem: `The enquiry destination is ${detectPlaceholder(destination)}.`,
      remedy: 'Set INQUIRY_TO_EMAIL to the inbox that should receive enquiries.',
    });
  }

  // --- Business identity ---------------------------------------------------
  if (classification === 'unconfirmed') {
    findings.push({
      severity: 'warning',
      field: 'NEXT_PUBLIC_BUSINESS_CLASSIFICATION',
      problem:
        'The business classification has not been confirmed, so no organisation ' +
        'structured data is emitted.',
      remedy:
        "Set it to 'sourcing-agent' or 'dealer' once the operating model is settled. " +
        "'dealer' additionally requires the licence fields below.",
    });
  }

  if (classification === 'dealer' && !isLicensedDealer()) {
    findings.push({
      severity: 'blocker',
      field: 'NEXT_PUBLIC_DEALER_LICENSE_NUMBER',
      problem:
        'The site is configured as a dealer but no licence number and jurisdiction ' +
        'are on file, so the claim is unsupported.',
      remedy:
        'Supply NEXT_PUBLIC_DEALER_LICENSE_NUMBER and NEXT_PUBLIC_DEALER_LICENSE_JURISDICTION, ' +
        "or set the classification back to 'sourcing-agent'.",
    });
  }

  if (!contact.serviceArea) {
    findings.push({
      severity: 'warning',
      field: 'NEXT_PUBLIC_SERVICE_AREA',
      problem: 'No service area is stated, so the site says nothing about where it operates.',
      remedy:
        'Set NEXT_PUBLIC_SERVICE_AREA to a truthful city/state or region. Leave it unset ' +
        'rather than naming somewhere you do not operate.',
    });
  }

  if (!legalEntity) {
    findings.push({
      severity: 'warning',
      field: 'NEXT_PUBLIC_LEGAL_ENTITY',
      problem: 'No registered legal entity name is configured.',
      remedy:
        'Set NEXT_PUBLIC_LEGAL_ENTITY once the trading entity is registered. Omitting it ' +
        'is correct until then.',
    });
  }

  if (siteConfig.social.length === 0) {
    findings.push({
      severity: 'warning',
      field: 'NEXT_PUBLIC_SOCIAL_LINKS',
      problem: 'No social links are configured.',
      remedy:
        'Add real profiles as "Label|https://…" pairs, comma-separated. Leave unset if ' +
        'there are none — the row hides itself.',
    });
  }

  return [
    ...findings.filter((f) => f.severity === 'blocker'),
    ...findings.filter((f) => f.severity === 'warning'),
  ];
}

/**
 * Whether the site may present itself as a live business: no blocking findings.
 * Drives `robots` and the `noindex` decision.
 */
export function isProductionReady(): boolean {
  return productionFindings().every((f) => f.severity !== 'blocker');
}

/**
 * Whether search engines should be allowed to index this deployment.
 *
 * Anything incomplete is kept out of the index deliberately: a half-configured site
 * ranking for the brand name is worse than no result at all. `NEXT_PUBLIC_ALLOW_INDEXING`
 * set to 'false' forces it off for staging deployments that are otherwise complete.
 */
export function shouldAllowIndexing(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'false') return false;
  return isProductionReady();
}
