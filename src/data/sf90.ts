import type { SoldVehicle, VehicleImage } from '@/lib/types';

const DIR = '/images/vehicles/ferrari-sf90-spider-assetto-fiorano';
const CREDIT = 'Photograph courtesy of Exotic Cars';

/**
 * Ferrari SF90 Spider Assetto Fiorano. A joint commission with Exotic Cars,
 * confirmed by the owner on 2026-09-29.
 *
 * Every fact below is either confirmed by the owner or visible in the photographs.
 * The photographs are Exotic Cars' own, used with their permission and credited in
 * each caption (see src/data/image-sources.ts).
 *
 * The supplied listing text was not used as a source of fact about this car. It is
 * a sales listing, and it disagrees with itself and with the photographs:
 *
 *   - mileage: listed as 70 km; the odometer photograph reads 711 km. Neither figure
 *     is published — the data model has no mileage field, deliberately;
 *   - interior colour: "White with Red accents" in the prose, "Ivory" in the spec
 *     table. The record says what the photographs show: white with red detailing;
 *   - "Warranty: Available", the sale location and "900+ HP": not claims this site
 *     makes. Output is given only as Ferrari's figure for the model, labelled so;
 *   - carbon-fibre wheels: stated in the listing, not verifiable from the supplied
 *     photographs, so not stated.
 *
 * Still to confirm before these can be added: sale price, delivery date, the exact
 * Ferrari paint name for "Pearl White", and whether the wheels are carbon fibre.
 * CONTENT_NEEDED.md §4 lists them.
 */
const photo = (
  file: string,
  alt: string,
  caption: string,
  focus?: string,
): VehicleImage => ({
  src: `${DIR}/${file}.jpg`,
  width: 1500,
  height: 1000,
  kind: 'vehicle-photograph',
  alt,
  ...(focus ? { focus } : {}),
  caption: `${caption}. ${CREDIT}.`,
});

export const sf90: SoldVehicle = {
  kind: 'sold',
  published: true,
  slug: 'ferrari-sf90-spider-assetto-fiorano',
  year: 2023,
  make: 'Ferrari',
  model: 'SF90 Spider',
  variant: 'Assetto Fiorano',
  subtitle: 'Pearl White · Joint Commission',
  bodyStyle: 'Convertible',
  category: 'Performance',
  /* Set explicitly so the UI never falls back to an assumed "Delivered". */
  statusNote: 'Joint commission with Exotic Cars',

  summary:
    'An SF90 Spider in Assetto Fiorano specification: Pearl White with a Silver ' +
    'stripe, over a white cabin with red detailing and carbon fibre throughout.',

  description: [
    'Assetto Fiorano is the most focused form of the SF90 Spider, and this car carries ' +
      'the specification to match: Pearl White bodywork with a Silver stripe through the ' +
      'centre and a red accent across the nose, carbon-fibre aerodynamic elements front ' +
      'and rear, and the Assetto Fiorano script on carbon-fibre sill plates.',
    'Inside, white upholstery with red strap detailing sits in carbon-fibre seat shells, ' +
      'alongside a carbon-fibre steering-wheel rim with red leather grips, a carbon-fibre ' +
      'centre tunnel, red door pulls and red seat belts.',
    'Handled as a joint commission with Exotic Cars.',
  ],

  specs: [
    { label: 'Model', value: 'SF90 Spider' },
    { label: 'Package', value: 'Assetto Fiorano' },
    { label: 'Exterior', value: 'Pearl White with Silver stripe' },
    { label: 'Interior', value: 'White with red detailing' },
  ],

  specSectionTitle: 'Specification',
  specSectionIntro:
    'What the photographs of this car show, and Ferrari’s published figures for the model.',
  specSectionFootnote:
    'Performance figures are Ferrari’s own for the SF90 Spider, not results measured on ' +
    'this car.',

  specGroups: [
    {
      title: 'Exterior',
      items: [
        'Pearl White paint with a Silver centre stripe',
        'Red accent across the nose',
        'Carbon-fibre front splitter',
        'Carbon-fibre rear diffuser',
        'Retractable hardtop',
      ],
    },
    {
      title: 'Interior',
      items: [
        'White upholstery with red perforated strap detailing',
        'Carbon-fibre seat shells',
        'Carbon-fibre steering-wheel rim with red leather grips',
        'Carbon-fibre centre tunnel',
        'Carbon-fibre sill plates with Assetto Fiorano script',
        'Red door pulls and red seat belts',
      ],
    },
    {
      title: 'Powertrain (manufacturer figures)',
      items: [
        '4.0-litre twin-turbocharged V8 with three electric motors',
        '1,000 cv combined (780 cv V8, 220 cv electric)',
        'Eight-speed dual-clutch transmission',
        'Electrically driven front axle',
      ],
    },
    {
      title: 'Performance (manufacturer figures)',
      items: ['0–100 km/h in 2.5 seconds', '0–200 km/h in 7.0 seconds', '340 km/h maximum'],
    },
  ],

  images: [
    photo(
      '01-nose-detail',
      'Photograph of the SF90 Spider’s nose in Pearl White, with the Silver centre stripe, ' +
        'red accent line, headlamp and carbon-fibre front splitter.',
      'Nose, Silver stripe and red accent',
      '50% 45%',
    ),
    photo(
      '02-cabin-door-open',
      'Photograph through the open driver’s door of the SF90 Spider, showing the white and ' +
        'red seats, red-gripped steering wheel and carbon-fibre door card.',
      'Cabin through the driver’s door',
    ),
    photo(
      '03-cockpit',
      'Photograph of the SF90 Spider cockpit: carbon-fibre steering wheel with red leather ' +
        'grips, curved digital display and white seats with red strap detailing.',
      'Cockpit',
    ),
    photo(
      '04-dashboard',
      'Photograph of the SF90 Spider dashboard from the passenger side, with the passenger ' +
        'display, red stitching and carbon-fibre centre tunnel.',
      'Dashboard from the passenger side',
    ),
    photo(
      '05-seats',
      'Photograph of both SF90 Spider seats in white with red perforated straps, carbon-fibre ' +
        'shells and red seat belts, roof retracted.',
      'Seats, white with red detailing',
    ),
    photo(
      '06-centre-console',
      'Photograph of the SF90 Spider’s carbon-fibre centre tunnel and gate-style selector ' +
        'between the white and red seats.',
      'Carbon-fibre centre tunnel',
    ),
    photo(
      '07-seat-shell',
      'Photograph of the back of the SF90 Spider driver’s seat, a gloss carbon-fibre shell, ' +
        'with the cockpit beyond.',
      'Carbon-fibre seat shell',
    ),
    photo(
      '08-assetto-fiorano-sill',
      'Photograph of the SF90 Spider’s carbon-fibre sill plate carrying the Assetto Fiorano ' +
        'script.',
      'Assetto Fiorano sill plate',
    ),
  ],
};
