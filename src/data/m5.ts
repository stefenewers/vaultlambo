import type { SoldVehicle, VehicleImage } from '@/lib/types';

const DIR = '/images/vehicles/bmw-m5-2025';

/**
 * BMW M5, 2025. A completed commission, confirmed by the owner on 2026-09-29.
 * Photographs are Marlowe's own.
 *
 * Facts about this car are what the photographs show. Powertrain and performance are
 * BMW's published figures for the model, labelled as such.
 *
 * Deliberately not taken from the supplied listing text: the mileage, the warranty,
 * the listing's "Specs: Others", its "700 - 800 HP" range, and any location. Also not
 * stated: the Bowers & Wilkins audio system, which the listing claims but the
 * photographs do not show (add it once confirmed from the build sheet), and BMW's
 * exact paint and upholstery names.
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
  caption,
});

export const m5: SoldVehicle = {
  kind: 'sold',
  published: true,
  slug: 'bmw-m5-2025',
  year: 2025,
  make: 'BMW',
  model: 'M5',
  subtitle: 'Matte Black · Carbon Specification',
  bodyStyle: 'Sedan',
  category: 'Performance',
  /* Set explicitly so the UI never falls back to an assumed "Delivered". */
  statusNote: 'Commission completed',

  summary:
    'The plug-in hybrid M5 in matte black with a carbon roof and carbon exterior ' +
    'detailing, over a red and black interior.',

  description: [
    'The latest M5 pairs a twin-turbocharged V8 with an electric motor, and this car is ' +
      'specified to look the part: matte black paint, a carbon-fibre roof, carbon mirror ' +
      'caps and a carbon boot-lid spoiler, gloss black wheels and red M brake callipers.',
    'Inside, red and black leather M seats with illuminated M5 badges, and carbon-fibre ' +
      'trim across the dashboard.',
  ],

  specs: [
    { label: 'Model', value: 'M5' },
    { label: 'Exterior', value: 'Matte black, carbon roof' },
    { label: 'Interior', value: 'Red and black leather' },
    { label: 'Powertrain', value: 'V8 plug-in hybrid' },
  ],

  specSectionTitle: 'Specification',
  specSectionIntro:
    'What the photographs of this car show, and BMW’s published figures for the model.',
  specSectionFootnote:
    'Powertrain and performance figures are BMW’s own for the M5, not results measured ' +
    'on this car.',

  specGroups: [
    {
      title: 'Exterior',
      items: [
        'Matte black paint',
        'Carbon-fibre roof',
        'Carbon-fibre mirror caps',
        'Carbon-fibre boot-lid spoiler',
        'Gloss black multi-spoke wheels',
        'Red M brake callipers',
      ],
    },
    {
      title: 'Interior',
      items: [
        'Red and black leather M seats',
        'Illuminated M5 badges in the front seatbacks',
        'Carbon-fibre dashboard trim',
        'Curved display with ambient lighting',
      ],
    },
    {
      title: 'Powertrain — manufacturer figures',
      items: [
        '4.4-litre twin-turbocharged V8 with an electric motor in the transmission',
        '727 PS and 1,000 Nm combined',
        'Eight-speed M Steptronic transmission',
        'M xDrive all-wheel drive',
      ],
    },
    {
      title: 'Performance — manufacturer figures',
      items: ['0–100 km/h in 3.5 seconds'],
    },
  ],

  images: [
    photo(
      '01-front-three-quarter',
      1500,
      639,
      'Photograph of the matte black BMW M5 from the front three-quarter on a studio ' +
        'turntable, showing the gloss black wheels and red brake callipers.',
      'Front three-quarter',
      '40% 55%',
    ),
    photo(
      '02-side-profile',
      1498,
      612,
      'Photograph of the matte black BMW M5 in full side profile.',
      'Side profile',
      '50% 55%',
    ),
    photo(
      '03-front',
      1500,
      649,
      'Photograph of the matte black BMW M5 head-on, showing the kidney grille and ' +
        'red seats through the windscreen.',
      'Front',
    ),
    photo(
      '04-carbon-roof',
      1500,
      955,
      'Photograph of the BMW M5’s carbon-fibre roof panel against matte black bodywork.',
      'Carbon roof',
    ),
    photo(
      '05-carbon-mirror',
      1498,
      975,
      'Photograph of a carbon-fibre mirror cap on the BMW M5.',
      'Carbon mirror cap',
    ),
    photo(
      '06-carbon-spoiler',
      1492,
      950,
      'Photograph of the BMW M5’s carbon-fibre boot-lid spoiler and M5 badge on matte ' +
        'black paint.',
      'Carbon spoiler and badge',
    ),
    photo(
      '07-wheel-and-brake',
      1500,
      944,
      'Photograph of a gloss black wheel on the BMW M5 with a red M brake calliper.',
      'Wheel and M brake',
    ),
    photo(
      '08-dashboard',
      1486,
      956,
      'Photograph of the BMW M5 dashboard: curved display, carbon-fibre trim and ' +
        'ambient lighting, with red seats in the foreground.',
      'Dashboard',
    ),
    photo(
      '09-cabin',
      1240,
      971,
      'Photograph of the BMW M5 cabin through the driver’s door, with red and black M ' +
        'seats and the steering wheel.',
      'Cabin',
    ),
    photo(
      '10-front-seats',
      1498,
      968,
      'Photograph of the BMW M5’s red and black front seats with illuminated M5 badges.',
      'Front seats',
    ),
    photo(
      '11-seat-detail',
      1498,
      956,
      'Photograph of a red and black BMW M5 front seat and its M5 badge.',
      'Seat detail',
    ),
  ],
};
