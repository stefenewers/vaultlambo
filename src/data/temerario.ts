import type { SoldVehicle } from '@/lib/types';

const DIR = '/images/vehicles/lamborghini-temerario-giallo-inti';

/**
 * Lamborghini Temerario, configuration code AKTT2X. Sold.
 *
 * Every option below is transcribed from this car's official Lamborghini Car
 * Configurator summary, which is held in `private-source/` and is not published.
 *
 * The sale price is owner-supplied and published with the owner's instruction. Still
 * deliberately absent, because they are not known and will not be guessed: VIN,
 * mileage, registration, location, prior owner, history and transaction date.
 *
 * The gallery separates the two kinds of image it holds. Items marked `factory-render`
 * are configurator output for this exact specification; the photograph of the car is
 * held in `documentaryImages` and captioned as a photograph, so a rendering is never
 * presented as documentation of the finished car.
 */
export const temerario: SoldVehicle = {
  kind: 'sold',
  published: true,
  slug: 'lamborghini-temerario-giallo-inti',
  make: 'Lamborghini',
  model: 'Temerario',
  subtitle: 'Giallo Inti · Custom Commission',
  bodyStyle: 'Coupe',
  category: 'Performance',
  statusNote: 'Custom order fulfilled',

  /** Confirmed by the owner. See the note above the record. */
  salePrice: '$150,000 USD',

  summary:
    'Ordered to a customer specification in Giallo Inti over Nero Ade, with Giallo ' +
    'Taurus contrast stitching and piping throughout.',

  description: [
    'Configured in Giallo Inti over Nero Ade leather and Corsa Tex, with Giallo Taurus ' +
      'contrast stitching throughout. Shiny-black exterior detailing, Velador forged ' +
      'wheels and Nero Lucido carbon-ceramic calipers complete the specification.',

    'The car was built to a fixed customer specification under configuration code ' +
      'AKTT2X, delivered, and sold for $150,000 USD.',
  ],

  specs: [
    { label: 'Model', value: 'Temerario' },
    { label: 'Exterior', value: 'Giallo Inti' },
    {
      label: 'Interior',
      value: 'Nero Ade with Giallo Taurus contrast stitching and piping',
    },
    { label: 'Configuration Code', value: 'AKTT2X' },
  ],

  specSectionTitle: 'Configuration',
  specSectionIntro:
    'As specified at the point of order, taken from the car’s factory configuration summary.',
  specSectionFootnote: 'Option names follow the manufacturer’s configurator wording.',

  specGroups: [
    {
      title: 'Exterior',
      items: [
        'Giallo Inti exterior paint',
        'Roof, upper hood cover and kidney in shiny black',
        'High Gloss Black style package',
        'Rear bumper central area in shiny black',
        'Tailpipes in matt black',
        'Kickplates in matt carbon with backlit Temerario logo',
      ],
    },
    {
      title: 'Wheels and brakes',
      items: [
        'Velador forged 20"/21" wheels in shiny black',
        'Bridgestone Potenza Sport 20"/21" tyres',
        'Nero Lucido CCB brake calipers',
        'Wheel caps in matt carbon',
        'Rim bolts in titanium',
      ],
    },
    {
      title: 'Interior trim',
      items: [
        'Unicolor leather and Corsa Tex with contrast stitching and piping',
        'Nero Ade base and contrast colour',
        'Giallo Taurus stitching',
        'Nero Ade seat belts',
        'Floor mats with leather border and double stitching, matched to base colour',
        'Embroidered Lamborghini shield on the headrests',
      ],
    },
    {
      title: 'Seats and comfort',
      items: [
        'Comfort seats',
        'Fully electric, heated and ventilated seats',
        'Ambient Light RGB pack',
        'Auxiliary heater (HVPTC)',
      ],
    },
    {
      title: 'Technology',
      items: [
        'Sonus faber sound system',
        'Passenger display',
        'Smartphone interface and connected services',
        'Parking Pack',
        'Garage door opener',
        'Cup holders on the dashboard',
      ],
    },
    {
      title: 'Chassis',
      items: ['Lifting system with magneto-rheologic suspension'],
    },
  ],

  /**
   * Factory configuration renderings for this exact specification, extracted at full
   * resolution from the car's own configuration document. These are renderings, not
   * photographs, and every caption says so.
   */
  images: [
    {
      src: `${DIR}/01-front-three-quarter.jpg`,
      width: 1123,
      height: 794,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the Lamborghini Temerario in Giallo Inti, ' +
        'front three-quarter view, showing the gloss black roof and black forged wheels.',
      caption: 'Factory configuration rendering — front three-quarter',
    },
    {
      src: `${DIR}/02-rear-three-quarter.jpg`,
      width: 1123,
      height: 794,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering, rear three-quarter view of the yellow ' +
        'Temerario, showing the shiny black rear bumper centre section and matt black ' +
        'tailpipes.',
      caption: 'Factory configuration rendering — rear three-quarter',
    },
    {
      src: `${DIR}/03-forged-wheel-detail.jpg`,
      width: 1123,
      height: 553,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the front wheel: Velador forged wheel in ' +
        'shiny black with a matt carbon wheel cap and a Nero Lucido carbon-ceramic ' +
        'brake caliper.',
      caption: 'Factory configuration rendering — Velador forged wheel and CCB caliper',
    },
    {
      src: `${DIR}/04-roof-top-view.jpg`,
      width: 1123,
      height: 559,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering, overhead view showing the roof, upper hood ' +
        'cover and kidney finished in shiny black against the Giallo Inti bodywork.',
      caption: 'Factory configuration rendering — shiny black roof treatment',
    },
    {
      src: `${DIR}/05-cockpit.jpg`,
      width: 1123,
      height: 794,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the driver’s cockpit with the digital ' +
        'instrument cluster, centre touchscreen and Giallo Taurus stitching on the ' +
        'Nero Ade trim.',
      caption: 'Factory configuration rendering — Nero Ade cockpit',
    },
    {
      src: `${DIR}/06-seat-stitching-detail.jpg`,
      width: 561,
      height: 559,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the driver’s comfort seat in Nero Ade ' +
        'leather with an embroidered shield on the headrest and yellow contrast ' +
        'stitching and piping.',
      caption: 'Factory configuration rendering — embroidered headrest, Giallo Taurus piping',
    },
    {
      src: `${DIR}/07-cabin.jpg`,
      width: 561,
      height: 561,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of both seats and the centre console, trimmed ' +
        'in Nero Ade leather and Corsa Tex.',
      caption: 'Factory configuration rendering — Nero Ade cabin',
    },
    {
      src: `${DIR}/08-cabin-passenger-side.jpg`,
      width: 1123,
      height: 794,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the cabin viewed from the passenger side, ' +
        'showing the console, armrest and door trim with yellow contrast stitching.',
      caption: 'Factory configuration rendering — cabin from the passenger side',
    },
    {
      src: `${DIR}/09-console-passenger-display.jpg`,
      width: 370,
      height: 705,
      kind: 'factory-render',
      alt:
        'Factory configuration rendering of the centre console with the touchscreen, ' +
        'drive mode controls and the passenger display to the right.',
      caption: 'Factory configuration rendering — centre console and passenger display',
    },
  ],

  /**
   * The one photograph of the finished car. Portrait, taken on arrival, and shown in
   * its own documentary block rather than stretched across the main gallery.
   */
  documentaryImages: [
    {
      src: `${DIR}/10-delivery-photograph.jpg`,
      width: 960,
      height: 1280,
      kind: 'vehicle-photograph',
      alt:
        'Photograph of the Temerario’s cabin taken from the driver’s seat on delivery, ' +
        'showing the steering wheel and dashboard with yellow contrast stitching.',
      caption: 'Delivery photograph',
    },
  ],
};
