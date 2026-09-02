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
  | 'Owner supplied — all rights reserved';

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

];

/** Ledger entry for a given public path, if one is recorded. */
export function imageSourceFor(path: string): ImageSource | undefined {
  return imageSources.find((s) => s.path === path);
}

/**
 * Entries whose licence obliges a visible credit.
 *
 * Currently empty, which is why there is no public credits page. Add an attributable
 * image and one has to come back — see the note in the README.
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
