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
    soldCta: { label: 'View past commissions', href: '/commissions' },
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
    title: 'Recent Commissions',
    intro: 'Ordered to a client’s specification, and delivered.',
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
          'photography available for that car. If a fact has not been verified, it is ' +
          'left off the listing rather than estimated.',
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

  /*
   * Answers to the questions a buyer actually asks before making contact.
   *
   * Every answer here is either a description of the service or a statement about what
   * this site does — both of which are checkable against the repository. Two questions
   * a buyer would reasonably ask are deliberately absent because nobody has supplied
   * the answer: what Marlowe charges, and who operates it. Both are listed in
   * CONTENT_NEEDED.md. An invented fee structure or a fictional founder biography would
   * be the single most damaging thing on the page.
   */
  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'Is Marlowe a dealer or a sourcing service?',
        answer:
          'A sourcing and representation service. We are not a franchised or authorised ' +
          'dealer for any manufacturer, and we are not affiliated with one. Where a ' +
          'specific car is offered here, the listing says so explicitly.',
      },
      {
        question: 'How does a search start?',
        answer:
          'With a brief. Tell us the model and how you want it specified, including ' +
          'where you have latitude and where you do not, and how the timing works. The ' +
          'tighter the brief, the shorter the search.',
      },
      {
        question: 'Do you only source the models listed under Sourcing?',
        answer:
          'No. Those are models we know well and are a useful starting point, not a ' +
          'catalogue of what we can look for. The photography on those pages is ' +
          'representative of the model and does not show a car we hold.',
      },
      {
        question: 'Why is nothing listed under Inventory?',
        answer:
          'A car appears under Inventory only when it is genuinely being offered, with ' +
          'its own photography and its own verified details. Most sourcing work is ' +
          'private and never reaches a public listing.',
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
          'shared for marketing. The privacy page sets out exactly what is collected ' +
          'and how to have it removed.',
      },
    ],
  },
} as const;

export const sourcingCopy = {
  headline: 'Sourcing',
  intro:
    'Models we know well and go looking for. Nothing on this page is a car we hold — ' +
    'these are briefs, and a search starts from one.',
  catalogueNote:
    'Photography on this page is representative of the model. It does not show a ' +
    'vehicle held by Marlowe Motorcars.',
  /*
   * Each step describes what is done for a client, in the conditional. Earlier drafts
   * asserted standing trade contacts, held order slots and an in-house logistics
   * operation — none of which is established, and all of which would be a claim about
   * the business rather than a description of the service.
   */
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
        'Cars publicly for sale, cars available to order, and anything that can be ' +
        'found privately. Where the car has not been built yet, that can mean a ' +
        'factory order with the specification fixed at the point of order.',
    },
    {
      title: 'Inspection',
      body:
        'An independent inspection and a documentation review can be arranged before ' +
        'anything is agreed. You see the inspector’s report as it was issued.',
    },
    {
      title: 'Handover',
      body:
        'Transport, paperwork and handover can be arranged and tracked through to the ' +
        'car arriving.',
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
  headline: 'Past Commissions',
  intro:
    'Cars ordered and delivered to a client’s specification. Each one is documented ' +
    'individually; most stay private, and only those a client is happy to have shown ' +
    'appear here.',
  empty: 'No commissions are published yet.',
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
