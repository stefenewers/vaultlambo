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
    subhead: 'Independent sourcing for performance, luxury and collector vehicles.',
    primaryCta: { label: 'Start a search', href: '/contact' },
    /** Always available: the commission is proof whether or not contact is live. */
    workCta: { label: 'View our work', href: '/commissions' },
    secondaryCta: { label: 'How sourcing works', href: '/sourcing' },
  },
  commission: {
    eyebrow: 'Recent commission',
    cta: { label: 'View commission' },
    archive: { label: 'All commissions', href: '/commissions' },
  },
  statement: {
    title: 'Tell us the car you want and we will find it.',
    body:
      'We agree the brief with you in writing and check every candidate against it. ' +
      'You only see a car once we have read its paperwork.',
  },
  categories: {
    eyebrow: 'Sourcing categories',
    title: 'What kind of car?',
    intro: 'A few examples of what we look for. If yours is not here, ask anyway.',
  },
  process: {
    title: 'How a search runs',
    cta: { label: 'The full process', href: '/sourcing' },
  },
  closing: {
    title: 'What are you looking for?',
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
        'You tell us the car you are after: model, specification, colour, condition ' +
          'and timing. We go and look for it, show you each candidate with what we know ' +
          'about it, and keep going until something fits or the brief changes.',
        'If the car has not been built yet, we can place a factory order with the ' +
          'specification fixed at that point. The Temerario under Commissions was ' +
          'ordered that way.',
      ],
    },
    {
      title: 'How we approach a brief',
      body: [
        'The tighter the brief, the shorter the search. Tell us early which parts are ' +
          'fixed, such as the transmission, colour or a particular option, and which ' +
          'are negotiable. That usually decides how many cars are worth looking at.',
        'An independent inspection and a documentation review can be arranged before ' +
          'anything is agreed. The report is passed on as it was issued.',
      ],
    },
    {
      title: 'Independence',
      body: [
        'We do not represent a franchise or hold stock we need to sell, so the only ' +
          'car we recommend is the one that fits your brief.',
        'We publish completed work only with the client’s permission. Everything under ' +
          'Commissions is shown on that basis.',
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
          'No. Marlowe is an independent sourcing service. We are not a franchised or ' +
          'authorised dealer and are not affiliated with any manufacturer.',
      },
      {
        question: 'Do you only source the categories listed under Sourcing?',
        answer:
          'No. They are examples to show the kind of car we look for. If the one you ' +
          'want is not listed, ask.',
      },
      {
        question: 'Do you hold stock?',
        answer:
          'Most cars are found to a brief. When we have a specific car on offer, it is ' +
          'listed under Inventory with its own photographs and details.',
      },
      {
        question: 'Can I see previous work?',
        answer:
          'Yes. Commissions shows completed cars whose owners have agreed to be ' +
          'included.',
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
          'We use them to answer your enquiry. We do not sell them or share them for ' +
          'marketing. The privacy page explains what we keep and how to have it removed.',
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
      summary: 'Model, specification, colour, condition and timing, or just a rough idea.',
      body:
        'Model and specification if you know them, or the shape of what you want if ' +
        'you do not. Colour, transmission, condition, mileage tolerance, and how ' +
        'quickly it needs to happen.',
    },
    {
      title: 'We agree the brief',
      short: 'Agree',
      summary: 'We write down what is fixed, what can move and what rules a car out.',
      body:
        'The brief is written down before anything starts: what is firm, what can ' +
        'move, and what would rule a car out. That is what the search is measured ' +
        'against, so a near miss is never passed off as a match.',
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
      summary: 'We read the configuration, service and ownership records, and can arrange an inspection.',
      body:
        'Configuration records, service history and ownership records are read where ' +
        'they exist, and what is missing is reported as missing. An independent ' +
        'inspection can be arranged, and you see the report as it was issued.',
    },
    {
      title: 'Before you commit',
      short: 'Decide',
      summary: 'You get what we know and what we do not, in writing, before you commit.',
      body:
        'You get what is known about the car and what is not, in writing, while there ' +
        'is still time to walk away. Nothing is agreed on a phone call.',
    },
    {
      title: 'Handover',
      short: 'Handover',
      summary: 'We can arrange transport, paperwork and handover through to delivery.',
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
    'Model, specification, colour and timing. Anything that narrows the search helps.',
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
