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
    eyebrow: 'MARLOWE MOTORCARS',
    headline: 'Cars worth finding.',
    subhead:
      'An independent sourcing service for performance, luxury and collector vehicles. ' +
      'We work to an agreed brief and search until the right car turns up.',
    primaryCta: { label: 'Start a search', href: '/contact' },
    secondaryCta: { label: 'How sourcing works', href: '/sourcing' },
    /** Three short statements set beneath the headline as a rule-separated row. */
    marks: [
      { term: 'Brief-led', detail: 'The search starts from your specification, not from stock.' },
      { term: 'Independent', detail: 'No franchise, no allocation to clear, no house car to push.' },
      { term: 'Documented', detail: 'Configuration and history reviewed before anything is agreed.' },
    ],
  },
  briefs: {
    title: 'Representative briefs',
    intro:
      'Examples of the categories and vehicles a search may cover. Availability is ' +
      'established only after a brief is agreed.',
  },
  process: {
    title: 'How it works',
    cta: { label: 'The full process', href: '/sourcing' },
  },
  commission: {
    eyebrow: 'Recent commission',
    cta: { label: 'All commissions', href: '/commissions' },
  },
  principles: {
    title: 'How we work',
    items: [
      {
        title: 'One brief at a time',
        body:
          'A search is defined before it starts: model, specification, condition, ' +
          'timing, and where each of those can move.',
      },
      {
        title: 'Nothing stated that is not known',
        body:
          'Where a fact about a car has not been verified, it is left out rather than ' +
          'estimated. That applies to this site as much as to a listing.',
      },
      {
        title: 'The client sees the same paperwork',
        body:
          'Inspection reports and configuration records are passed on as issued, not ' +
          'summarised.',
      },
    ],
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
      title: 'What we do not claim',
      body: [
        'We are not a franchised or authorised dealer for any manufacturer, and we are ' +
          'not affiliated with one. We hold no standing allocation and no stock beyond ' +
          'what is published under Inventory — which, at the moment, is nothing.',
        'This site publishes one completed commission because one client has agreed to ' +
          'it being shown. It is not a summary of everything that has been done, and it ' +
          'is not presented as a track record.',
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
          'No. We are an independent sourcing service, not a franchised or authorised ' +
          'dealer, and we are not affiliated with any manufacturer.',
      },
      {
        question: 'Do you only source the categories listed under Sourcing?',
        answer:
          'Those are examples of scope, not a menu. They are there to show the kind of ' +
          'brief a search covers. If the car you want is not among them, say so.',
      },
      {
        question: 'Why is nothing listed under Inventory?',
        answer:
          'Because nothing is currently being offered. A car appears there only when it ' +
          'is genuinely on offer, with its own photography and verified details.',
      },
      {
        question: 'Why is only one commission shown?',
        answer:
          'Because only one client has agreed to have their car published. Completed ' +
          'work is shown with permission and not otherwise.',
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
    'How a search runs, from the first conversation to the car arriving. Nothing on ' +
    'this page is a car for sale.',

  /** The service, in the order it actually happens. */
  steps: [
    {
      title: 'You describe the car',
      body:
        'Model and specification if you know them, or the shape of what you want if ' +
        'you do not. Colour, transmission, condition, mileage tolerance, and how ' +
        'quickly it needs to happen.',
    },
    {
      title: 'We agree the brief',
      body:
        'The brief is written down before anything starts: what is firm, what can ' +
        'move, and what would rule a car out. That is what the search is measured ' +
        'against, and it is what stops a near-miss being presented as a match.',
    },
    {
      title: 'Candidates are identified',
      body:
        'Cars publicly for sale, cars available to order, and anything that can be ' +
        'found privately. Where the car has not been built yet, that can mean a ' +
        'factory order with the specification fixed at the point of order.',
    },
    {
      title: 'History and documents are reviewed',
      body:
        'Configuration records, service history and ownership records are read where ' +
        'they exist, and what is missing is reported as missing. An independent ' +
        'inspection can be arranged, and you see the report as it was issued.',
    },
    {
      title: 'Before you commit',
      body:
        'You get what is known about the car and what is not, in writing, while there ' +
        'is still time to walk away. Nothing is agreed on a phone call.',
    },
    {
      title: 'Handover',
      body:
        'Transport, paperwork and handover can be arranged and tracked through to the ' +
        'car arriving.',
    },
  ],

  briefs: {
    title: 'Representative briefs',
    intro:
      'Examples of the categories and vehicles a search may cover. Availability is ' +
      'established only after a brief is agreed.',
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
