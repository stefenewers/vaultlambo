/**
 * Site copy.
 *
 * Everything an editorial pass would touch lives here rather than inside a component.
 * Two rules hold across all of it: say what is true, and say it the way someone who
 * knows cars would say it out loud. No "a considered inventory of remarkable
 * vehicles", no explaining why a piece of information is absent.
 */

export const homeCopy = {
  hero: {
    eyebrow: 'MARLOWE MOTORCARS',
    headline: 'Cars worth finding.',
    subhead: 'Performance, luxury and collector vehicles, sourced to order.',
    primaryCta: { label: 'Start a search', href: '/contact' },
    /** The second CTA depends on whether there is real inventory — see the homepage. */
    inventoryCta: { label: 'View inventory', href: '/inventory' },
    soldCta: { label: 'View completed vehicles', href: '/sold-vehicles' },
  },
  inventory: {
    title: 'Available Now',
    intro: 'Specific cars currently being offered.',
  },
  sourcing: {
    title: 'Models We Source',
    intro:
      'Cars we know well and go looking for. Tell us which one and how you want it specified.',
  },
  process: {
    title: 'How Sourcing Works',
  },
  completed: {
    title: 'Recently Completed',
    intro: 'Cars delivered to a client’s specification.',
  },
  contactCta: {
    title: 'Tell us what you are after.',
    body:
      'Model, colour, transmission, options, timing — and how much room there is on ' +
      'each. The tighter the brief, the shorter the search.',
    cta: { label: 'Start a search', href: '/contact' },
  },
} as const;

export const aboutCopy = {
  headline: 'About Marlowe Motorcars',
  intro:
    'Marlowe Motorcars works with clients looking for well-specified performance, ' +
    'luxury and collector vehicles. Searches begin with the car itself: model, colour, ' +
    'equipment, condition and timing. Completed commissions remain documented ' +
    'privately, with selected vehicles retained in the public archive.',
  sections: [
    {
      title: 'Sourcing',
      body: ['We search against a defined brief and present suitable vehicles for review.'],
    },
    {
      title: 'Representation',
      body: [
        'Where a specific vehicle is offered, its listing is built from the records and ' +
          'photography available for that car.',
      ],
    },
    {
      title: 'Documentation',
      body: [
        'Configuration, ownership and service records are reviewed where available and ' +
          'shared with appropriate parties during a transaction.',
      ],
    },
  ],
} as const;

export const sourcingCopy = {
  headline: 'Sourcing',
  intro:
    'Models we know well and go looking for. Nothing on this page is a car we hold — ' +
    'these are briefs, and a search starts from one.',
  catalogueNote:
    'Photography on this page is representative of the model. It does not show a ' +
    'vehicle held by Marlowe Motorcars.',
  steps: [
    {
      title: 'The brief',
      body:
        'Model, specification, colour, transmission, and how much latitude there is on ' +
        'each. The tighter the brief, the shorter the search.',
    },
    {
      title: 'The search',
      body:
        'Trade contacts, private owners and, where the car has not been built yet, an ' +
        'order slot with the specification fixed at the point of order.',
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
        'Transport, paperwork and handover arranged and tracked through to the car ' +
        'arriving.',
    },
  ],
  cta: { label: 'Send a brief', href: '/contact' },
} as const;

export const contactCopy = {
  headline: 'Tell us what you are looking for.',
  intro:
    'Model, specification, colour, timing — anything that narrows the search is worth ' +
    'including.',
  helps: [
    'Model and specification, if you know it',
    'Colour and interior preferences',
    'Timing, and whether a factory order works',
    'Where the car needs to end up',
  ],
} as const;

export const inventoryCopy = {
  headline: 'Inventory',
  intro: 'Specific cars currently being offered.',
  /** Shown when nothing is listed. Says so plainly rather than filling the page. */
  none: {
    title: 'Nothing is listed at the moment.',
    body:
      'A car appears here once it is genuinely on offer, with its own photography and ' +
      'its own verified details. Most of what we handle is found to a brief and never ' +
      'reaches this page, so the quickest route is to tell us what you are after.',
    primaryCta: { label: 'Start a search', href: '/contact' },
    secondaryCta: { label: 'Models we source', href: '/sourcing' },
  },
  /** Shown when filters exclude everything, but stock does exist. */
  empty: {
    title: 'Nothing matches those filters.',
    body: 'Try widening the search, or clear the filters to see everything.',
  },
} as const;

export const soldCopy = {
  headline: 'Completed Vehicles',
  intro: 'Cars delivered to a client’s specification, documented individually.',
  empty: 'No completed vehicles are published yet.',
} as const;

export const creditsCopy = {
  headline: 'Image credits',
  intro:
    'Photography used on this site that was not supplied by a vehicle’s owner, with ' +
    'its source and licence. Cropped and re-encoded versions of ShareAlike images ' +
    'remain under the same licence as the original.',
  representativeNote:
    'Marque photography illustrates the model under discussion. It does not show a ' +
    'vehicle held by Marlowe Motorcars.',
} as const;
