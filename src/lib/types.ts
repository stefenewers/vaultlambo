/** Vehicle domain types. Kept free of any React or Next.js dependency. */

export type Availability = 'available' | 'reserved' | 'sold';

/** Browsable categories. Every vehicle belongs to exactly one. */
export type Category = 'Performance' | 'Grand Touring' | 'Luxury SUV' | 'Collector';

export type BodyStyle = 'Coupe' | 'Convertible' | 'Sedan' | 'SUV' | 'Wagon';

export type VehicleImage = {
  /** Path under /public. */
  src: string;
  /** Descriptive alt text. Required — never decorative on this site. */
  alt: string;
  width: number;
  height: number;
  /** Short caption shown beneath the image in the lightbox. */
  caption?: string;
};

/** One row of the metadata strip on a detail page. */
export type SpecItem = { label: string; value: string };

/** A titled group of equipment, rendered as a column block. */
export type SpecGroup = { title: string; items: string[] };

export type Vehicle = {
  slug: string;
  /**
   * Model year. Optional on purpose: a vehicle carries a year here only when the year
   * is actually known. Nothing infers one.
   */
  year?: number;
  make: string;
  model: string;
  /** Trim or variant, appended after the model in headings. */
  variant?: string;
  /** Line under the H1, e.g. "Giallo Inti · Custom Commission". */
  subtitle?: string;
  bodyStyle: BodyStyle;
  category: Category;
  availability: Availability;
  /** Short qualifier beside the badge, e.g. "Custom order fulfilled". */
  statusNote?: string;
  /** Displayed where a price would go. No numeric prices are held in this data set. */
  priceDisplay: string;
  /** Lead line on the card and at the top of the detail page. */
  summary: string;
  /** Detail page body copy. Each string is one paragraph. */
  description: string[];
  /** Key/value pairs for the metadata strip. Only verified facts belong here. */
  specs: SpecItem[];
  /** Grouped equipment lists for the two-column specification section. */
  specGroups?: SpecGroup[];
  images: VehicleImage[];
  /** Note rendered in the documentation block on the detail page. */
  documentation?: string;
};
