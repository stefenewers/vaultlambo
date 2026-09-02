/**
 * IMAGE SOURCE LEDGER.
 *
 * Every image on this site that was not supplied by the owner is recorded here, with
 * the source it came from, who made it, the licence it is used under and the date it
 * was obtained. Nothing is hotlinked; every file listed here was downloaded and is
 * served from `public/`.
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

const COMMONS = 'Wikimedia Commons';

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
  // Editorial photography — homepage and section imagery.
  // ---------------------------------------------------------------------------
  {
    path: '/images/editorial/hero-performance.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:2025_Porsche_992_GT3_with_touring_package_DSC_2717.jpg',
    creator: `Alexander Migl (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to a square and re-encoded as WebP.',
  },
  {
    path: '/images/editorial/hero-craftsmanship.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:2022_Aston_Martin_V12_Speedster_interior.jpg',
    creator: `Pelicanactor (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to portrait and re-encoded as WebP.',
  },
  {
    path: '/images/editorial/hero-grand-touring.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:2022_Bentley_Flying_Spur_Hybrid_in_Ghost_White,_Odyssean_Specs,_front_right.jpg',
    creator: `Mr.choppers (${COMMONS})`,
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to a square and re-encoded as WebP.',
  },
  {
    path: '/images/editorial/hero-luxury-suv.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Land_Rover_Range_Rover_P615_SV_LWB_L460_Ostuni_Pearl_White_(10).jpg',
    creator: `Damian B Oh (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to a panoramic band and re-encoded as WebP.',
  },
  {
    path: '/images/editorial/sourcing-band.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ferrari_296_GTB_1X7A6377.jpg',
    creator: `Alexander Migl (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to a panoramic band and re-encoded as WebP.',
  },

  // ---------------------------------------------------------------------------
  // Representative model photography — sourcing catalogue only.
  // None of these cars is, or has been, held by Marlowe. They illustrate the model.
  // ---------------------------------------------------------------------------
  {
    path: '/images/marque/porsche-911-gt3-touring.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Porsche_992_GT3_with_touring_package_1X7A6511.jpg',
    creator: `Alexander Migl (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/ferrari-296-gtb.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ferrari_296_GTB_IMG_8865_(cropped).jpg',
    creator: `Alexander-93 (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/mclaren-artura.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2023_McLaren_Artura_10.jpg',
    creator: `Calreyn88 (${COMMONS})`,
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    attributionRequired: false,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/bentley-continental-gt.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Bentley_Continental_GT_Number_9_Edition_Genf_2019_1Y7A5879.jpg',
    creator: `Alexander Migl (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/mercedes-amg-g-63.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:2018_Mercedes-AMG_G_63_4MATIC_Automatic_4.0_Front.jpg',
    creator: `Vauxford (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/range-rover-sv.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Land_Rover_Range_Rover_P615_SV_LWB_L460_Ostuni_Pearl_White_(2).jpg',
    creator: `Damian B Oh (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
  {
    path: '/images/marque/bmw-m3-cs.webp',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:2024_BMW_M3_CS_xDrive_Auto_7.jpg',
    creator: `Calreyn88 (${COMMONS})`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
    accessed: '2026-08-30',
    modifications: 'Cropped to 3:2 and re-encoded as WebP.',
  },
];

/** Ledger entry for a given public path, if one is recorded. */
export function imageSourceFor(path: string): ImageSource | undefined {
  return imageSources.find((s) => s.path === path);
}

/** Entries whose licence obliges a visible credit. Drives /credits. */
export function attributableSources(): ImageSource[] {
  return imageSources.filter((s) => s.attributionRequired);
}

/** Short inline credit line, e.g. "Alexander Migl (Wikimedia Commons) · CC BY-SA 4.0". */
export function creditLine(path: string): string | null {
  const source = imageSourceFor(path);
  if (!source || !source.attributionRequired) return null;
  return `${source.creator} · ${source.license}`;
}
