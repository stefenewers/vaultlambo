/**
 * Site copy. Everything an editorial pass would touch lives here rather than inside a
 * component, so pages can be rewritten without opening JSX.
 */

export const homeCopy = {
  hero: {
    headline: 'Performance. Luxury. Collector.',
    subhead:
      'A considered inventory of remarkable vehicles, from modern performance cars ' +
      'to properly specified luxury SUVs.',
    primaryCta: { label: 'Browse inventory', href: '/inventory' },
    secondaryCta: { label: 'Discuss sourcing', href: '/sourcing' },
    marques: [
      'Porsche',
      'Ferrari',
      'McLaren',
      'Mercedes-AMG',
      'Land Rover',
      'Lamborghini',
    ],
  },
  featured: {
    title: 'Featured Inventory',
    intro: 'A selection of what is on the books now.',
  },
  categories: {
    title: 'Browse by Category',
  },
  sold: {
    title: 'Recently Sold',
    intro: 'Completed sales. Specifications stay on record.',
  },
  sourcing: {
    title: 'Vehicle Sourcing',
    body: [
      'A good deal of what we handle never reaches this page. If you are after a ' +
      'particular model, colour or configuration, we will look for it — including ' +
      'factory orders, where the specification is set before the car is built.',
      'Tell us what you want and how soon you want it. If we cannot find it, we will ' +
      'say so.',
    ],
    cta: { label: 'Start a search', href: '/sourcing' },
  },
} as const;

export const aboutCopy = {
  headline: 'About Marlowe Motorcars',
  intro:
    'Marlowe Motorcars represents a small, considered selection of performance, ' +
    'luxury and collector vehicles. We also assist clients seeking a particular ' +
    'model, colour or configuration.',
  sections: [
    {
      title: 'How we list',
      body: [
        'Each listing states what is known about the car and stops there. Where a ' +
        'figure has not been verified it is left out rather than estimated, and ' +
        'prices are quoted directly rather than advertised.',
      ],
    },
    {
      title: 'Documentation',
      body: [
        'Configuration summaries, import paperwork and service records are held on ' +
        'file for the cars that pass through us, and are made available to buyers, ' +
        'inspectors and relevant authorities on request.',
      ],
    },
  ],
} as const;

export const sourcingCopy = {
  headline: 'Sourcing',
  intro:
    'Not every car we handle is listed. If you know what you are looking for, we ' +
    'will go and find it.',
  steps: [
    {
      title: 'The brief',
      body:
        'Model, specification, colour, transmission, and how much latitude there is ' +
        'on each. The tighter the brief, the shorter the search.',
    },
    {
      title: 'The search',
      body:
        'Trade contacts, private owners and, where the car has not been built yet, ' +
        'an order slot with the specification fixed at the point of order.',
    },
    {
      title: 'Inspection',
      body:
        'Independent inspection and documentation review before anything is agreed. ' +
        'You see the report, not a summary of it.',
    },
    {
      title: 'Delivery',
      body:
        'Transport, import paperwork and handover arranged and tracked through to ' +
        'the car arriving.',
    },
  ],
  cta: { label: 'Send a brief', href: '/contact' },
} as const;

export const contactCopy = {
  headline: 'Tell us what you are looking for.',
  intro:
    'Model, specification, colour, timing — anything that narrows the search is ' +
    'worth including.',
  helps: [
    'Model and specification, if you know it',
    'Colour and interior preferences',
    'Timing, and whether a factory order works',
    'Where the car needs to end up',
  ],
} as const;

export const inventoryCopy = {
  headline: 'Inventory',
  intro: 'Filter by make, category, year and availability.',
  empty: {
    title: 'Nothing matches those filters.',
    body: 'Try widening the search, or clear the filters to see everything.',
  },
} as const;

export const soldCopy = {
  headline: 'Sold Vehicles',
  intro:
    'Cars we have sold. Listings stay up so the specifications remain on record.',
} as const;
