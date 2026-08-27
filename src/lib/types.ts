/** Vehicle domain types. Kept free of any React or Next.js dependency. */

export type Availability = 'available' | 'pending' | 'sold';

export type BodyStyle =
  | 'Coupe'
  | 'Convertible'
  | 'Sedan'
  | 'SUV'
  | 'Wagon';

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

/** A titled group of options, rendered as a column block. */
export type SpecGroup = { title: string; items: string[] };

export type Vehicle = {
  slug: string;
  /**
   * Model year. Optional on purpose: a vehicle only carries a year here when the year
   * is actually known. Nothing infers one.
   */
  year?: number;
  make: string;
  model: string;
  /** Optional trim or variant appended after the model in headings. */
  variant?: string;
  /** Short line under the H1, e.g. "Giallo Inti | Custom Commission". */
  subtitle?: string;
  bodyStyle: BodyStyle;
  category: string;
  availability: Availability;
  /**
   * Short status line shown next to the badge, e.g. "Custom order fulfilled".
   * Omit when the badge alone says enough.
   */
  statusNote?: string;
  /**
   * Displayed where a price would go. There are no numeric prices in this data set —
   * nothing here is a real offer.
   */
  priceDisplay: string;
  /** Lead paragraph on the card and at the top of the detail page. */
  summary: string;
  /** Body copy for the detail page. Each string is one paragraph. */
  description: string[];
  /** Key/value pairs shown in the metadata row. Only verified facts belong here. */
  specs: SpecItem[];
  /** Grouped option lists for the two-column configuration section. */
  specGroups?: SpecGroup[];
  images: VehicleImage[];
  /**
   * True for the placeholder listings that exist to demonstrate the marketplace.
   * Drives the "Sample listing" marker and excludes the record from JSON-LD.
   */
  isSample: boolean;
  /** Shown on the home page featured slot. At most one vehicle should set this. */
  featured?: boolean;
  /** Note rendered in the documentation block on the detail page. */
  documentation?: string;
};
