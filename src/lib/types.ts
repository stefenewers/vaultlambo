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
  | 'vehicle-photograph'
  /** A photograph of *some* example of the model. Never implies possession. */
  | 'representative';

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
 * A model Marlowe can discuss or go and find. Explicitly NOT a car.
 *
 * There is no `availability`, no `price`, no `statusNote` and no `year` unless the
 * brief deliberately references a generation — because none of those can be true of a
 * model in the abstract.
 */
export type SourcingModel = BaseRecord & {
  kind: 'sourcing';
  /**
   * Only set when the brief intentionally refers to one generation, and then it is
   * rendered as "generation", never as a model year on a car in stock.
   */
  generation?: string;
  /** One factual model-level sentence, used on the card. */
  brief: string;
  /** Longer model-level notes for the brief page. Each string is one paragraph. */
  notes: string[];
  /** Model-level facts. Never presented as belonging to a particular example. */
  specs: SpecItem[];
  specGroups?: SpecGroup[];
  /** Representative imagery. Labelled as such wherever it appears. */
  image: VehicleImage;
};

/** Any record that describes one specific car. */
export type SpecificVehicle = InventoryVehicle | SoldVehicle;

/** Every record the site holds. */
export type VehicleRecord = InventoryVehicle | SoldVehicle | SourcingModel;
