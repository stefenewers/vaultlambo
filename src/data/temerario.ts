import type { Vehicle } from '@/lib/types';

const DIR = '/images/vehicles/lamborghini-temerario-giallo-inti';

/**
 * Lamborghini Temerario, configuration code AKTT2X.
 *
 * This is the only non-sample record in the data set. Every option below is transcribed
 * from the vehicle's official Lamborghini Car Configurator summary, which is held in
 * `private-source/` and is not published. Deliberately absent, because they are not
 * known to this site: VIN, price, mileage, registration, location, seller, owner,
 * history and any transaction date.
 *
 * To change the public status of this vehicle, edit `availability` and `statusNote`.
 */
export const temerario: Vehicle = {
  slug: 'lamborghini-temerario-giallo-inti',
  make: 'Lamborghini',
  model: 'Temerario',
  subtitle: 'Giallo Inti | Custom Commission',
  bodyStyle: 'Coupe',
  category: 'Supersport',
  availability: 'sold',
  statusNote: 'Custom order fulfilled',
  priceDisplay: 'Not published',
  isSample: false,
  featured: true,

  summary:
    'A bespoke customer commission specified through the factory configurator in ' +
    'Giallo Inti over Nero Ade, with Giallo Taurus contrast stitching and piping.',

  description: [
    'This Temerario was built to a customer commission rather than taken from a ' +
    'standing allocation. The specification was set at the point of order under ' +
    'configuration code AKTT2X, and the car was produced to that configuration: ' +
    'Giallo Inti over a Nero Ade cabin in unicolor leather and Corsa Tex, with ' +
    'Giallo Taurus contrast stitching and piping running through the interior.',

    'The exterior brief is consistent throughout. The roof, upper hood cover and ' +
    'kidney are finished in shiny black, the High Gloss Black style package carries ' +
    'that treatment across the body details, and the Velador forged wheels, wheel ' +
    'caps, tailpipes and rear bumper centre section follow the same dark theme against ' +
    'the yellow. Nero Lucido carbon-ceramic calipers sit behind the forged rims.',

    'It is presented here as an entry in the collection’s archive of vehicles that ' +
    'are no longer available, and is documented for reference only. No sale price, ' +
    'transaction detail or information about any owner is published on this site.',
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

  documentation:
    'The original factory configuration summary for code AKTT2X is held on file, ' +
    'together with the import documentation for this vehicle.',

  /**
   * Gallery. Items 1–9 are the configuration renders for this exact specification,
   * extracted at full resolution from the vehicle’s own configuration document.
   * Item 10 is a photograph of the car itself. No imagery here is generated or stock.
   */
  images: [
    {
      src: `${DIR}/01-front-three-quarter.jpg`,
      width: 1123,
      height: 794,
      alt:
        'Lamborghini Temerario in Giallo Inti, front three-quarter view, showing the ' +
        'gloss black roof and black forged wheels.',
      caption: 'Front three-quarter — Giallo Inti over shiny black roof',
    },
    {
      src: `${DIR}/02-rear-three-quarter.jpg`,
      width: 1123,
      height: 794,
      alt:
        'Rear three-quarter view of the yellow Lamborghini Temerario, showing the ' +
        'gloss black rear bumper centre section and matt black tailpipes.',
      caption: 'Rear three-quarter — shiny black bumper centre, matt black tailpipes',
    },
    {
      src: `${DIR}/03-forged-wheel-detail.jpg`,
      width: 1123,
      height: 553,
      alt:
        'Close view of the front wheel: Velador forged wheel in shiny black with a ' +
        'matt carbon wheel cap and a Nero Lucido carbon-ceramic brake caliper.',
      caption: 'Velador forged 20"/21" in shiny black, Nero Lucido CCB caliper',
    },
    {
      src: `${DIR}/04-roof-top-view.jpg`,
      width: 1123,
      height: 559,
      alt:
        'Overhead view of the Temerario showing the roof, upper hood cover and kidney ' +
        'finished in shiny black against the Giallo Inti bodywork.',
      caption: 'Roof, upper hood cover and kidney in shiny black',
    },
    {
      src: `${DIR}/05-cockpit.jpg`,
      width: 1123,
      height: 794,
      alt:
        'Driver’s cockpit with the digital instrument cluster, centre touchscreen and ' +
        'Giallo Taurus stitching on the Nero Ade trim.',
      caption: 'Cockpit — Nero Ade with Giallo Taurus stitching',
    },
    {
      src: `${DIR}/06-seat-stitching-detail.jpg`,
      width: 561,
      height: 559,
      alt:
        'Driver’s comfort seat in Nero Ade leather with an embroidered shield on the ' +
        'headrest and yellow contrast stitching and piping.',
      caption: 'Embroidered headrest shield, Giallo Taurus piping',
    },
    {
      src: `${DIR}/07-cabin.jpg`,
      width: 561,
      height: 561,
      alt:
        'Both seats and the centre console of the Temerario cabin, trimmed in Nero Ade ' +
        'leather and Corsa Tex.',
      caption: 'Cabin — unicolor leather and Corsa Tex',
    },
    {
      src: `${DIR}/08-cabin-passenger-side.jpg`,
      width: 1123,
      height: 794,
      alt:
        'Cabin viewed from the passenger side, showing the console, armrest and door ' +
        'trim with yellow contrast stitching.',
      caption: 'Cabin from the passenger side',
    },
    {
      src: `${DIR}/09-console-passenger-display.jpg`,
      width: 370,
      height: 705,
      alt:
        'Centre console detail with the touchscreen, drive mode controls and the ' +
        'passenger display to the right.',
      caption: 'Centre console and passenger display',
    },
    {
      src: `${DIR}/10-delivery-photograph.jpg`,
      width: 960,
      height: 1280,
      alt:
        'Photograph of the Temerario’s cabin taken from the driver’s seat, showing the ' +
        'steering wheel and dashboard with yellow contrast stitching.',
      caption: 'Photographed on arrival',
    },
  ],
};
