/**
 * Site copy.
 *
 * Everything an editorial pass would touch lives here rather than inside a component.
 * Three rules hold across all of it:
 *
 *   - Say what is true. Nothing here asserts experience, reach, relationships or
 *     volume that the configuration does not carry.
 *   - Say it the way someone who knows cars would say it out loud.
 *   - Do not describe the absence of information. A page that keeps explaining what it
 *     cannot tell you reads as though it is defending itself.
 */

export const homeCopy = {
  hero: {
    eyebrow: 'Marlowe Motorcars',
    headline: 'Cars worth finding.',
    /** The closing word of the headline, set in the accent. Must end `headline`. */
    headlineAccent: 'finding.',
    subhead: 'Independent sourcing for performance, luxury and collector vehicles.',
    primaryCta: { label: 'Start a search', href: '/contact' },
    /** Always available: the commission is proof whether or not contact is live. */
    workCta: { label: 'View our work', href: '/commissions' },
    secondaryCta: { label: 'How sourcing works', href: '/sourcing' },
  },
  commission: {
    index: '01',
    eyebrow: 'Recent commission',
    cta: { label: 'View commission' },
    archive: { label: 'All commissions', href: '/commissions' },
  },
  statement: {
    /** Two lines; the second ends in the accent word. */
    lines: ['You tell us the car.', 'We go find it.'],
    accent: 'find it.',
    body:
      'A search starts from the car you want rather than the cars someone has to sell. ' +
      'The brief is agreed in writing, candidates are measured against it, and nothing ' +
      'is presented until its paperwork has been read.',
  },
  categories: {
    eyebrow: 'Sourcing categories',
    title: 'What kind of car?',
    intro: 'Example briefs a search can cover. If yours is not here, ask anyway.',
  },
  process: {
    eyebrow: 'The process',
    title: 'How a search runs',
    cta: { label: 'The full process', href: '/sourcing' },
  },
  principles: {
    eyebrow: 'How we work',
    items: [
      {
        term: 'Independent',
        body: 'The search starts with the brief, not stock.',
      },
      {
        term: 'Brief-led',
        body: 'Model, specification, condition and timing are defined first.',
      },
      {
        term: 'Documented',
        body: 'Configuration and history are reviewed before a decision.',
      },
      {
        term: 'Verified',
        body: 'If something has not been established, it is not presented as fact.',
      },
    ],
  },
  closing: {
    lines: ['What are you', 'looking for?'],
    cta: { label: 'Start a search', href: '/contact' },
    /** Used when there is no contact route: the frame still leads somewhere real. */
    fallback: { label: 'How sourcing works', href: '/sourcing' },
  },
} as const;

export const aboutCopy = {
  headline: 'About',
  intro:
    'Marlowe Motorcars finds specific cars for people who already know roughly what ' +
    'they want. Performance, luxury and collector vehicles, sourced to an agreed brief.',

  sections: [
    {
      title: 'What we do',
      body: [
        'A client describes the car they are after — model, specification, colour, ' +
          'condition, timing — and we go and look for it. Candidates are presented for ' +
          'review with what is known about each one, and the search continues until ' +
          'something fits or the brief changes.',
        'Where a car has not been built yet, that can mean a factory order with the ' +
          'specification fixed at the point of order, as with the Temerario in the ' +
          'commission archive.',
      ],
    },
    {
      title: 'How we approach a brief',
      body: [
        'The tighter the brief, the shorter the search. It helps to know early which ' +
          'parts are firm — transmission, colour, a particular option — and which are ' +
          'negotiable, because that is usually what decides how many cars are worth ' +
          'looking at.',
        'An independent inspection and a documentation review can be arranged before ' +
          'anything is agreed. The report is passed on as it was issued.',
      ],
    },
    {
      title: 'Independence',
      body: [
        'There is no franchise to represent and no allocation to clear, so the ' +
          'recommendation follows the brief rather than a stock position.',
        'Completed work is published with the client’s permission. What appears under ' +
          'Commissions is shown on that basis, with the specification and ' +
          'documentation behind it.',
      ],
    },
  ],

  /*
   * Questions a buyer actually asks before making contact.
   *
   * Two obvious ones are deliberately missing because nobody has supplied the answer:
   * what Marlowe charges, and who operates it. Both are in CONTENT_NEEDED.md. An
   * invented fee structure or a fictional founder biography would be the single most
   * damaging thing on this page.
   */
  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'Are you a dealer?',
        answer:
          'Marlowe is an independent sourcing service rather than a franchised or ' +
          'authorised dealer, and is not affiliated with any manufacturer.',
      },
      {
        question: 'Do you only source the categories listed under Sourcing?',
        answer:
          'Those are examples of scope, not a menu. They are there to show the kind of ' +
          'brief a search covers. If the car you want is not among them, say so.',
      },
      {
        question: 'Do you hold stock?',
        answer:
          'Cars are found to a brief rather than held in stock. When a specific car is ' +
          'on offer it appears under Inventory, with its own photography and verified ' +
          'details.',
      },
      {
        question: 'Can I see previous work?',
        answer:
          'Completed commissions are published with the client’s permission, and those ' +
          'that are appear under Commissions with their specification.',
      },
      {
        question: 'How are inspections and documents handled?',
        answer:
          'An independent inspection and a documentation review can be arranged before ' +
          'anything is agreed, and you see the inspector’s report as it was issued. ' +
          'Configuration and service records are reviewed where they exist.',
      },
      {
        question: 'What happens to the details I send?',
        answer:
          'They are used to answer your enquiry and nothing else. They are not sold or ' +
          'shared for marketing. The privacy page sets out what is collected and how to ' +
          'have it removed.',
      },
    ],
  },
} as const;

export const sourcingCopy = {
  headline: 'Sourcing',
  intro:
    'How a search runs, from the first conversation to the car arriving.',

  /**
   * The service, in the order it actually happens. `short` and `summary` are the
   * homepage's condensed form of the same step; `title` and `body` are the full text.
   */
  steps: [
    {
      title: 'You describe the car',
      short: 'Describe',
      summary: 'Model, specification, colour, condition and timing — or just the shape of what you want.',
      body:
        'Model and specification if you know them, or the shape of what you want if ' +
        'you do not. Colour, transmission, condition, mileage tolerance, and how ' +
        'quickly it needs to happen.',
    },
    {
      title: 'We agree the brief',
      short: 'Agree',
      summary: 'Written down first: what is firm, what can move, and what rules a car out.',
      body:
        'The brief is written down before anything starts: what is firm, what can ' +
        'move, and what would rule a car out. That is what the search is measured ' +
        'against, and it is what stops a near-miss being presented as a match.',
    },
    {
      title: 'Candidates are identified',
      short: 'Search',
      summary: 'Cars for sale, cars available to order, and cars found privately.',
      body:
        'Cars publicly for sale, cars available to order, and anything that can be ' +
        'found privately. Where the car has not been built yet, that can mean a ' +
        'factory order with the specification fixed at the point of order.',
    },
    {
      title: 'History and documents are reviewed',
      short: 'Review',
      summary: 'Configuration, service and ownership records read. An independent inspection can be arranged.',
      body:
        'Configuration records, service history and ownership records are read where ' +
        'they exist, and what is missing is reported as missing. An independent ' +
        'inspection can be arranged, and you see the report as it was issued.',
    },
    {
      title: 'Before you commit',
      short: 'Decide',
      summary: 'What is known and what is not, in writing, while you can still walk away.',
      body:
        'You get what is known about the car and what is not, in writing, while there ' +
        'is still time to walk away. Nothing is agreed on a phone call.',
    },
    {
      title: 'Handover',
      short: 'Handover',
      summary: 'Transport, paperwork and handover arranged and tracked through to arrival.',
      body:
        'Transport, paperwork and handover can be arranged and tracked through to the ' +
        'car arriving.',
    },
  ],

  briefs: {
    title: 'Representative briefs',
    intro:
      'Examples of the categories and vehicles a search may cover. Availability is ' +
      'established once a brief is agreed.',
  },

  cta: {
    title: 'Send a brief',
    body:
      'Include the model, the specification you want, and how firm each part of it is. ' +
      'If timing matters, say when.',
    label: 'Start a search',
    href: '/contact',
  },
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
    secondaryCta: { label: 'How sourcing works', href: '/sourcing' },
  },
  /** Shown when filters exclude everything, but stock does exist. */
  empty: {
    title: 'Nothing matches those filters.',
    body: 'Try widening the search, or clear the filters to see everything.',
  },
} as const;

export const soldCopy = {
  headline: 'Commissions',
  intro:
    'Selected completed work. Client and vehicle details are published only with ' +
    'permission.',
  empty: 'No commissions are published yet.',
} as const;
