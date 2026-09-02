/**
 * Vehicle domain types. Free of any React or Next.js dependency.
 *
 * The site holds three different kinds of content and they are NOT interchangeable:
 *
 *   InventoryVehicle — a specific car actually being offered
 *   SoldVehicle      — a specific car that has been sold, documented individually
 *   SourcingModel    — a model Marlowe can talk about or go and find; no specific car
 *
 * They are a discriminated union rather than one record with a status string, so a
 * model brief cannot be rendered anywhere a specific car is implied. The compiler,
 * not a code review, is what stops a Porsche 911 model page from appearing under
 * "Available".
 */

/** Statuses a *specific* car can hold. A model brief has none of these. */
export type Availability = 'available' | 'reserved' | 'sold';

/** Browsable categories. Every record belongs to exactly one. */
export type Category = 'Performance' | 'Grand Touring' | 'Luxury SUV' | 'Collector';

export type BodyStyle = 'Coupe' | 'Convertible' | 'Sedan' | 'SUV' | 'Wagon';

/**
 * How an image was produced. Rendered captions depend on this: a factory
 * configurator rendering is never described as a photograph of the car.
 */
export type ImageKind =
  /** Manufacturer configurator output for this exact specification. */
  | 'factory-render'
  /** A photograph of this exact car. */
  | 'vehicle-photograph';

export type VehicleImage = {
  /** Path under /public. */
  src: string;
  /** Descriptive alt text. Required — never decorative on this site. */
  alt: string;
  width: number;
  height: number;
  /** Short caption shown beneath the image in the gallery and lightbox. */
  caption?: string;
  kind: ImageKind;
};

/** At least one image. Publishing a specific car without photography is a type error. */
export type ImageSet = readonly [VehicleImage, ...VehicleImage[]];

/** One row of the metadata strip on a detail page. */
export type SpecItem = { label: string; value: string };

/** A titled group of equipment, rendered as a column block. */
export type SpecGroup = { title: string; items: string[] };

/** Fields every record shares, regardless of kind. */
type BaseRecord = {
  slug: string;
  make: string;
  model: string;
  /** Trim or variant, appended after the model in headings. */
  variant?: string;
  category: Category;
  bodyStyle: BodyStyle;
  /**
   * Drafts never reach a production route, the sitemap or structured data.
   * Set to true only once every claim on the record is supported.
   */
  published: boolean;
  /**
   * ISO date (YYYY-MM-DD) this record's facts were last verified or changed. Feeds
   * `lastModified` in the sitemap.
   *
   * Omit it rather than guessing. A fabricated freshness date is a small lie told to a
   * crawler, and the sitemap simply leaves the field out when it is absent.
   */
  updated?: string;
};

/**
 * A specific car currently offered.
 *
 * Publication requires: real photography, a verified year, a verified variant, and at
 * least three vehicle-specific facts. Mileage, VIN, stock number, price, ownership and
 * history are absent from the type entirely — there is nowhere to put an invented one.
 */
export type InventoryVehicle = BaseRecord & {
  kind: 'inventory';
  /** Verified model year. Required for inventory: an offered car has a known year. */
  year: number;
  /** Line under the H1, e.g. "Giallo Inti · Custom Commission". */
  subtitle?: string;
  availability: Extract<Availability, 'available' | 'reserved'>;
  /** Short qualifier beside the badge. Only set when factually supported. */
  statusNote?: string;
  /** Displayed where a price would go. No numeric prices are held in this data set. */
  priceDisplay: string;
  summary: string;
  /** Detail page body copy. Each string is one paragraph. */
  description: string[];
  /**
   * Verified, vehicle-specific facts. At least three, enforced by the tuple type —
   * a car with nothing specific to say about it is not ready to be listed.
   */
  specs: readonly [SpecItem, SpecItem, SpecItem, ...SpecItem[]];
  specGroups?: SpecGroup[];
  images: ImageSet;
};

/** A specific car that has been sold, documented individually. */
export type SoldVehicle = BaseRecord & {
  kind: 'sold';
  /** Optional: only present when the year is actually known. */
  year?: number;
  subtitle?: string;
  /** Short qualifier beside the SOLD badge, e.g. "Custom order fulfilled". */
  statusNote?: string;
  /**
   * The price the car actually sold for, exactly as the owner supplied it, e.g.
   * "$150,000 USD". A string rather than a number and a currency code: this is a
   * disclosed figure, not something to arithmetic on, and formatting it locally would
   * risk restating it as something the owner did not say.
   *
   * Omit entirely unless the figure is confirmed. Nothing derives or estimates it, and
   * the UI renders no price line at all when it is absent.
   */
  salePrice?: string;
  summary: string;
  description: string[];
  specs: SpecItem[];
  specGroups?: SpecGroup[];
  images: ImageSet;
  /**
   * Photographs of the car itself, kept apart from the configuration renderings so
   * the two are never presented as the same class of evidence.
   */
  documentaryImages?: VehicleImage[];
  /** Heading and intro for the specification block. */
  specSectionTitle?: string;
  specSectionIntro?: string;
  specSectionFootnote?: string;
};

/**
 * A category of brief the service can investigate. Explicitly NOT a car, and no longer
 * even a model page.
 *
 * This replaced a set of seven per-model records that each carried representative
 * photography and several paragraphs of manufacturer detail. That format had two
 * problems: the photography was unrelated stock that made the site look like a
 * classifieds listing, and generic model facts read as though they were evidence of
 * expertise nobody had verified.
 *
 * A category carries no image, no slug route, no availability, no price and no year.
 * `examples` are model names offered as illustrations of scope — the copy around them
 * states that availability is established only after a brief is agreed.
 */
export type SourcingCategory = {
  kind: 'sourcing-category';
  /** Stable key for React and for in-page anchors. Deliberately not a route. */
  id: string;
  category: Category;
  /** One factual sentence describing what the category covers. */
  summary: string;
  /**
   * Illustrative model names. Plain strings on purpose: there is no record behind
   * them, so there is nothing that could be mistaken for a car on the books.
   */
  examples: string[];
  published: boolean;
};

/**
 * Any record that describes one specific car.
 *
 * This is the only vehicle union there is. `SourcingCategory` is deliberately outside
 * it, so a category cannot be passed to anything that renders, links to or emits
 * structured data for a vehicle.
 */
export type SpecificVehicle = InventoryVehicle | SoldVehicle;
