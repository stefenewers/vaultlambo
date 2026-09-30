/**
 * IMAGE SOURCE LEDGER.
 *
 * Every image on this site that was not supplied by the owner is recorded here, with
 * the source it came from, who made it, the licence it is used under and the date it
 * was obtained. Nothing is hotlinked; every file listed here was downloaded and is
 * served from `public/`.
 *
 * At present there are no external images at all. A set of Creative Commons marque and
 * editorial photographs was removed: the licences were fine, but the pictures were of
 * other people's cars, shot by different photographers in different places, and
 * assembled into a grid they made the site look like a classifieds page rather than a
 * sourcing firm. The rules below still apply to anything added later.
 *
 * Rules this ledger exists to keep honest:
 *
 *   - No dealership inventory photography, auction listings (Bring a Trailer, Cars &
 *     Bids or otherwise), social-media images, watermarked images, or any image whose
 *     licensing could not be established.
 *   - Representative model photography is never used to imply that the pictured car is
 *     held by Marlowe. Those images are labelled where they appear.
 *   - Owner-supplied material carries no external attribution and is marked
 *     `attributionRequired: false`.
 *
 * Attribution is rendered on /credits, and beneath the image wherever a licence
 * requires it in context. `ShareAlike` licences apply to the adapted files too: the
 * cropped and re-encoded derivatives published here remain under the same licence as
 * their source.
 */

export type ImageLicense =
  /* Kept for anything added later, and for the rules above to have teeth. */
  | 'CC BY-SA 4.0'
  | 'CC BY-SA 3.0'
  | 'CC BY 4.0'
  | 'CC BY 2.0'
  | 'CC0 1.0'
  | 'Owner supplied — all rights reserved'
  /*
   * Another rights holder's photograph of a car this business handled, published with
   * that rights holder's permission. Requires a source URL and a credit, which is
   * carried in the image's own caption wherever it appears.
   */
  | 'Used with permission of the rights holder';

export type ImageSource = {
  /** Path under /public, exactly as referenced by the data records. */
  path: string;
  /** Page the original was obtained from. Empty for owner-supplied material. */
  sourceUrl?: string;
  /** Creator or rights holder, as credited by the source. */
  creator: string;
  license: ImageLicense;
  licenseUrl?: string;
  /** Whether the licence obliges us to display a credit. */
  attributionRequired: boolean;
  /** ISO date the file was obtained. */
  accessed: string;
  /** What was done to the original. Relevant to ShareAlike terms. */
  modifications?: string;
};

export const imageSources: ImageSource[] = [
  // ---------------------------------------------------------------------------
  // Owner-supplied. Lamborghini Temerario, configuration code AKTT2X.
  // Items 01–09 are renderings taken from the car's own factory configuration
  // document; item 10 is a photograph of the car itself.
  // ---------------------------------------------------------------------------
  ...[
    '01-front-three-quarter',
    '02-rear-three-quarter',
    '03-forged-wheel-detail',
    '04-roof-top-view',
    '05-cockpit',
    '06-seat-stitching-detail',
    '07-cabin',
    '08-cabin-passenger-side',
    '09-console-passenger-display',
    '10-delivery-photograph',
  ].map<ImageSource>((name) => ({
    path: `/images/vehicles/lamborghini-temerario-giallo-inti/${name}.jpg`,
    creator: 'Supplied by the vehicle’s owner',
    license: 'Owner supplied — all rights reserved',
    attributionRequired: false,
    accessed: '2026-08-27',
    modifications:
      name === '10-delivery-photograph'
        ? 'Exported from the supplied original.'
        : 'Extracted at full resolution from the supplied factory configuration document.',
  })),

  // ---------------------------------------------------------------------------
  // Ferrari SF90 Spider Assetto Fiorano — a joint commission with Exotic Cars,
  // Photographed by Exotic Cars for their listing and used here with their
  // permission, as confirmed by the owner on 2026-09-29. Credited in each caption.
  // The as-supplied set, including frames not published here, is kept in
  // private-source/ferrari-sf90-spider-assetto-fiorano/.
  // ---------------------------------------------------------------------------
  ...(
    [
      ['01-nose-detail', 'image-24396667'],
      ['02-cabin-door-open', 'image-6646024'],
      ['03-cockpit', 'image-3892844'],
      ['04-dashboard', 'image-12191565'],
      ['05-seats', 'image-1632261'],
      ['06-centre-console', 'image-4933115'],
      ['07-seat-shell', 'image-7341846'],
      ['08-assetto-fiorano-sill', 'image-5790058'],
    ] as const
  ).map<ImageSource>(([name, original]) => ({
    path: `/images/vehicles/ferrari-sf90-spider-assetto-fiorano/${name}.jpg`,
    sourceUrl: `https://exoticcars.ae/uploads/cars/ferrari-sf90-spider-assetto-fiorano/${original}.jpg`,
    creator: 'Exotic Cars',
    license: 'Used with permission of the rights holder',
    attributionRequired: true,
    accessed: '2026-09-29',
    modifications: 'None. Renamed only.',
  })),

  // ---------------------------------------------------------------------------
  // BMW M5 (2025). Marlowe's own photography, confirmed by the owner 2026-09-29.
  // The as-supplied set is in private-source/bmw-m5-2025/.
  // ---------------------------------------------------------------------------
  ...[
    '01-front-three-quarter',
    '02-side-profile',
    '03-front',
    '04-carbon-roof',
    '05-carbon-mirror',
    '06-carbon-spoiler',
    '07-wheel-and-brake',
    '08-dashboard',
    '09-cabin',
    '10-front-seats',
    '11-seat-detail',
  ].map<ImageSource>((name) => ({
    path: `/images/vehicles/bmw-m5-2025/${name}.jpg`,
    creator: 'Marlowe Motorcars',
    license: 'Owner supplied — all rights reserved',
    attributionRequired: false,
    accessed: '2026-09-29',
    modifications:
      name === '09-cabin' ? 'Cropped to exclude a door-jamb sticker.' : 'None. Renamed only.',
  })),

  // ---------------------------------------------------------------------------
  // Lamborghini Sián Roadster — a joint commission with Exotic Cars.
  // Exotic Cars' own photography, used with their permission (confirmed by the
  // owner, 2026-09-29) and credited in each caption. Supplied without embedded
  // metadata; the as-supplied set is in private-source/lamborghini-sian-roadster/.
  // ---------------------------------------------------------------------------
  ...(
    [
      ['01-front-three-quarter', 'None. Renamed only.'],
      ['02-side-profile', 'None. Renamed only.'],
      ['03-front', 'None. Renamed only.'],
      ['04-rear-wing-and-lights', "Cropped to exclude the supplying dealer's number plate."],
      ['05-wheel-and-brake', 'None. Renamed only.'],
      ['06-cockpit', 'None. Renamed only.'],
      ['07-cabin-from-above', 'None. Renamed only.'],
      ['08-seats', 'None. Renamed only.'],
      ['09-carbon-bulkhead', 'None. Renamed only.'],
      ['10-door', 'None. Renamed only.'],
    ] as const
  ).map<ImageSource>(([name, modifications]) => ({
    path: `/images/vehicles/lamborghini-sian-roadster/${name}.jpg`,
    sourceUrl: 'https://exoticcars.ae',
    creator: 'Exotic Cars',
    license: 'Used with permission of the rights holder',
    attributionRequired: true,
    accessed: '2026-09-29',
    modifications,
  })),

];

/** Ledger entry for a given public path, if one is recorded. */
export function imageSourceFor(path: string): ImageSource | undefined {
  return imageSources.find((s) => s.path === path);
}

/**
 * Entries whose licence obliges a visible credit.
 *
 * Credits are given in context — in the caption beneath each image — rather than on a
 * separate credits page. A test asserts every attributable image in use carries its
 * creator in its caption.
 */
export function attributableSources(): ImageSource[] {
  return imageSources.filter((s) => s.attributionRequired);
}

/** Short inline credit line, e.g. "Alexander Migl (Wikimedia Commons) · CC BY-SA 4.0". */
export function creditLine(path: string): string | null {
  const source = imageSourceFor(path);
  if (!source || !source.attributionRequired) return null;
  return `${source.creator} · ${source.license}`;
}
