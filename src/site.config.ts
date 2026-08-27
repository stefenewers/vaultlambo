/**
 * Central brand + contact configuration.
 *
 * Everything needed to rebrand the site lives here. No component hard-codes a company
 * name, address, phone number or legal string.
 */

export type NavItem = { label: string; href: string };

export const siteConfig = {
  name: 'Marlowe Motorcars',
  /** Wordmark, set in two parts. */
  wordmark: { primary: 'MARLOWE', secondary: 'MOTORCARS' },
  tagline: 'Fine automobiles, properly represented',

  /** Canonical origin. Used for metadata, canonical URLs, sitemap and JSON-LD. */
  url: 'https://example.com',

  description:
    'An independent dealer of performance, luxury and collector automobiles. ' +
    'Inventory across modern performance cars, grand tourers, luxury SUVs and ' +
    'special-order vehicles, plus sourcing for specific models and configurations.',

  contact: {
    email: 'sales@example.com',
    /** Set to null to hide the phone number across the site. */
    phone: '+1 (000) 000-0000',
    /** Set to null to hide the line. Replace with a real address when there is one. */
    location: 'By appointment',
    /** Set to null to hide the response line on the contact page. */
    responseTime: 'Enquiries are answered directly, usually within one business day.',
  },

  /** Only add links that exist. An empty array hides the row. */
  social: [] as NavItem[],

  nav: [
    { label: 'Inventory', href: '/inventory' },
    { label: 'Sold Vehicles', href: '/sold-vehicles' },
    { label: 'Sourcing', href: '/sourcing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],

  legal: {
    /** One discreet line, rendered once in the footer. */
    affiliationDisclaimer:
      'Marlowe Motorcars is an independent dealer and is not affiliated with or ' +
      'authorised by any vehicle manufacturer. Marques and model names are the ' +
      'property of their respective owners.',
    /** Rendered in the documentation block on vehicle detail pages. */
    documentationNotice:
      'Configuration, import and service documentation is held on file and made ' +
      'available to buyers, inspectors and relevant authorities on request.',
  },

  /** Where the enquiry form posts. Swap for a provider endpoint when one is wired up. */
  inquiryEndpoint: '/api/inquiries',
} as const;

export type SiteConfig = typeof siteConfig;
