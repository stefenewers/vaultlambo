import type { SoldVehicle, VehicleImage } from '@/lib/types';

const DIR = '/images/vehicles/lamborghini-sian-roadster';
const CREDIT = 'Photograph courtesy of Exotic Cars';

/**
 * Lamborghini Sián Roadster. A joint commission with Exotic Cars, confirmed
 * by the owner on 2026-09-29.
 *
 * Facts about this car are what the photographs show. Model-level facts — the
 * production run of 19 and the powertrain — are Lamborghini's published figures for
 * the model and are labelled as such. The photographs are Exotic Cars' own, used with
 * their permission and credited in each caption (see src/data/image-sources.ts).
 *
 * The supplied listing text was not used as a source of fact about this car:
 *
 *   - "100 kilometres", "brand-new", "delivery-mileage": condition and mileage claims.
 *     The data model has no mileage field, deliberately, and nothing here restates
 *     condition;
 *   - the sale location, "Warranty: Available", "Specs: GCC": listing terms, not
 *     claims this site makes;
 *   - "800 - 900 HP": a range; output is given only as Lamborghini's own figures;
 *   - paint name: "White" is the listing's word, not necessarily Lamborghini's.
 *
 * The seatbacks carry an embroidered monogram that may be a previous owner's
 * initials. It is visible in the photographs but not mentioned or described here.
 *
 * Still to confirm: sale price, delivery date, the Lamborghini paint and trim names.
 */
const photo = (
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
  focus?: string,
): VehicleImage => ({
  src: `${DIR}/${file}.jpg`,
  width,
  height,
  kind: 'vehicle-photograph',
  alt,
  ...(focus ? { focus } : {}),
  caption: `${caption}. ${CREDIT}.`,
});

export const sian: SoldVehicle = {
  kind: 'sold',
  published: true,
  slug: 'lamborghini-sian-roadster',
  year: 2021,
  make: 'Lamborghini',
  model: 'Sián Roadster',
  subtitle: 'White · Joint Commission',
  bodyStyle: 'Convertible',
  category: 'Collector',
  /* Set explicitly so the UI never falls back to an assumed "Delivered". */
  statusNote: 'Joint commission with Exotic Cars',

  summary:
    'One of 19 Sián Roadsters built. White over an ivory cabin with turquoise ' +
    'stitching, bronze-finished wheels and copper-toned detailing.',

  description: [
    'Lamborghini built 19 Sián Roadsters, making it one of the rarest road cars of the ' +
      'marque’s modern era: a roofless few-off, and the first open Lamborghini to pair ' +
      'the naturally aspirated V12 with supercapacitor hybrid assistance.',
    'This car is finished in white with bronze-finished wheels over carbon-ceramic ' +
      'brakes, a carbon-fibre rear wing and the six hexagonal tail lights. Inside, ivory ' +
      'leather and grey Alcantara are picked out with turquoise stitching and piping, ' +
      'with copper-toned door pulls, gear selector and console trim, and exposed carbon ' +
      'fibre across the doors, console and bulkhead.',
    'Handled as a joint commission with Exotic Cars.',
  ],

  specs: [
    { label: 'Model', value: 'Sián Roadster' },
    { label: 'Production', value: '19 Roadsters built' },
    { label: 'Exterior', value: 'White, bronze-finished wheels' },
    { label: 'Interior', value: 'Ivory with turquoise stitching' },
  ],

  specSectionTitle: 'Specification',
  specSectionIntro:
    'What the photographs of this car show, and Lamborghini’s published figures for the ' +
    'model.',
  specSectionFootnote:
    'Production and performance figures are Lamborghini’s own for the Sián Roadster, ' +
    'not results measured on this car.',

  specGroups: [
    {
      title: 'Exterior',
      items: [
        'White paint',
        'Bronze-finished wheels with centre-lock hubs',
        'Lamborghini carbon-ceramic brakes',
        'Carbon-fibre rear wing',
        'Six hexagonal tail lights in carbon-fibre surrounds',
        'Carbon-fibre side intakes',
      ],
    },
    {
      title: 'Interior',
      items: [
        'Ivory leather with grey Alcantara',
        'Turquoise contrast stitching and piping',
        'Turquoise embroidered Lamborghini shields on the headrests',
        'Copper-toned door pulls, gear selector and console trim',
        'Carbon-fibre door cards, centre console and rear bulkhead',
        'Alcantara steering wheel with turquoise centre marker',
      ],
    },
    {
      title: 'Powertrain (manufacturer figures)',
      items: [
        '6.5-litre naturally aspirated V12, 785 cv',
        '48-volt electric motor in the gearbox, 34 cv, fed by a supercapacitor',
        '819 cv combined',
        'Seven-speed ISR transmission',
        'Permanent four-wheel drive',
      ],
    },
    {
      title: 'Performance (manufacturer figures)',
      items: ['Maximum speed above 350 km/h'],
    },
  ],

  images: [
    photo(
      '01-front-three-quarter',
      1500,
      652,
      'Photograph of the white Lamborghini Sián Roadster from the front three-quarter on ' +
        'a studio turntable, showing its bronze-finished wheels and open cockpit.',
      'Front three-quarter',
      '40% 55%',
    ),
    photo(
      '02-side-profile',
      1500,
      655,
      'Photograph of the white Sián Roadster in full side profile, with bronze-finished ' +
        'wheels, carbon-fibre side intake and rear wing.',
      'Side profile',
      '50% 55%',
    ),
    photo(
      '03-front',
      1500,
      654,
      'Photograph of the white Sián Roadster head-on, showing the Y-shaped headlights and ' +
        'ivory cabin behind the windscreen.',
      'Front',
    ),
    photo(
      '04-rear-wing-and-lights',
      1140,
      900,
      'Photograph of the Sián Roadster’s carbon-fibre rear wing and hexagonal tail lights ' +
        'set into carbon-fibre surrounds.',
      'Rear wing and tail lights',
    ),
    photo(
      '05-wheel-and-brake',
      1498,
      946,
      'Photograph of a bronze-finished wheel on the Sián Roadster, with a Lamborghini ' +
        'carbon-ceramic brake behind it.',
      'Wheel and carbon-ceramic brake',
    ),
    photo(
      '06-cockpit',
      1498,
      983,
      'Photograph of the Sián Roadster cockpit: Alcantara steering wheel, digital ' +
        'instruments, ivory dashboard with turquoise piping and copper-toned console trim.',
      'Cockpit',
    ),
    photo(
      '07-cabin-from-above',
      1500,
      985,
      'Photograph of the Sián Roadster cabin from above, showing both ivory seats, the ' +
        'carbon-fibre centre console and copper-toned trim.',
      'Cabin from above',
    ),
    photo(
      '08-seats',
      1498,
      974,
      'Photograph of the Sián Roadster’s ivory seats with turquoise piping and embroidered ' +
        'Lamborghini shields on the headrests.',
      'Seats',
    ),
    photo(
      '09-carbon-bulkhead',
      1500,
      987,
      'Photograph of the carbon-fibre rear bulkhead behind the Sián Roadster’s seats, with ' +
        'a turquoise-embroidered headrest in the foreground.',
      'Carbon-fibre bulkhead',
    ),
    photo(
      '10-door',
      1498,
      971,
      'Photograph of the Sián Roadster’s raised scissor door, showing the carbon-fibre and ' +
        'ivory door card with a copper-toned pull.',
      'Scissor door',
    ),
  ],
};
