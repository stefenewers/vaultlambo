/**
 * Site copy. Everything a marketing edit would touch lives here rather than inside a
 * component, so the pages can be rewritten without opening JSX.
 */

export const homeCopy = {
  hero: {
    eyebrow: 'Collection',
    headline: 'Exceptional vehicles, thoughtfully sourced.',
    subhead:
      'A small, deliberately narrow selection of performance, collector and ' +
      'special-order cars — found on request, documented properly, and never ' +
      'listed in volume.',
    primaryCta: { label: 'View inventory', href: '/inventory' },
    secondaryCta: { label: 'Start an inquiry', href: '/contact' },
  },
  featured: {
    eyebrow: 'Featured',
    title: 'From the archive',
    intro:
      'A vehicle configured to order and delivered to its commissioning owner. It is ' +
      'no longer available, and is kept here as a record of the work.',
  },
  inventory: {
    eyebrow: 'Current',
    title: 'Inventory',
    intro:
      'What is on the books now. Availability is stated plainly and updated as it ' +
      'changes.',
  },
  sold: {
    eyebrow: 'Archive',
    title: 'Recently sold',
    intro: 'Vehicles that have found their owners.',
  },
  sourcing: {
    eyebrow: 'Sourcing',
    title: 'If it is not here, it can usually be found.',
    body:
      'Most of what passes through the collection is found for a specific person ' +
      'rather than bought on speculation. That includes factory commissions, where ' +
      'the specification is set at the point of order rather than chosen from what ' +
      'happens to exist.',
    cta: { label: 'Describe what you are looking for', href: '/contact' },
  },
} as const;

export const aboutCopy = {
  eyebrow: 'About',
  headline: 'A short list, kept short on purpose.',
  intro:
    'Apex Motor Collection is an independent broker of performance, collector and ' +
    'special-order vehicles. The list is small because everything on it has been ' +
    'looked at properly.',
  sections: [
    {
      title: 'How the collection works',
      body: [
        'Vehicles reach the collection one of two ways: they are sourced for a client ' +
        'who has described what they want, or they are taken on because they are ' +
        'genuinely worth taking on. There is no target for how many cars should be ' +
        'listed at any one time, and no interest in filling the page.',
        'Each listing states what is known and stops there. Where a figure is not ' +
        'verified, it is not printed — including price, which is quoted directly ' +
        'rather than advertised.',
      ],
    },
    {
      title: 'Special orders and commissions',
      body: [
        'Some of the most interesting work is not a purchase at all but a ' +
        'configuration: an order specified from the ground up, tracked through build ' +
        'and delivery, and documented so the specification survives the first owner.',
        'The Temerario in the archive is one of these. It was configured to a ' +
        'customer’s brief rather than selected from existing stock.',
      ],
    },
    {
      title: 'Documentation',
      body: [
        'Configuration summaries, import paperwork and service records are retained ' +
        'for the vehicles that pass through the collection. They are made available ' +
        'to buyers, inspectors and relevant authorities on request, and are not ' +
        'published on this site.',
      ],
    },
  ],
} as const;

export const contactCopy = {
  eyebrow: 'Contact',
  headline: 'Tell us what you are looking for.',
  intro:
    'The more specific the brief, the more useful the answer. Model, specification, ' +
    'colour, timing — anything that narrows the search is worth including.',
} as const;

export const inventoryCopy = {
  eyebrow: 'Inventory',
  headline: 'The current list.',
  intro:
    'Filter by availability, make, body style and year. Everything is updated as ' +
    'status changes.',
  empty: {
    title: 'Nothing matches those filters.',
    body: 'Try widening the search, or clear the filters to see the full list.',
  },
} as const;

export const soldCopy = {
  eyebrow: 'Archive',
  headline: 'Vehicles no longer available.',
  intro:
    'A record of what has passed through the collection. These entries stay online so ' +
    'the specifications remain documented.',
} as const;
