import type { SourcingModel } from '@/lib/types';

/**
 * SOURCING CATALOGUE — models Marlowe can discuss or go and find.
 *
 * These are model briefs, not cars. Nothing here is held, reserved or for sale, and
 * the type has nowhere to say otherwise: there is no `availability`, no price and no
 * model year on a `SourcingModel`.
 *
 * Everything written below is model-level fact — how the car is built and what the
 * factory offers — and applies to any properly specified example. Nothing describes a
 * particular car's condition, mileage, history or ownership, because no particular car
 * is being described.
 *
 * Imagery is representative photography of the model, licensed for commercial reuse
 * and recorded in `src/data/image-sources.ts`. It is labelled as representative
 * wherever it appears so it cannot be mistaken for a car on the books.
 */
export const sourcingCatalogue: SourcingModel[] = [
  {
    kind: 'sourcing',
    published: true,
    slug: 'porsche-911-gt3-touring',
    make: 'Porsche',
    model: '911 GT3',
    variant: 'Touring',
    generation: '992',
    category: 'Performance',
    bodyStyle: 'Coupe',
    brief:
      'The GT3 with the fixed rear wing deleted and the mechanical package left alone.',
    notes: [
      'Touring drops the fixed rear wing and retrims the interior in leather, but the ' +
        'GT department’s hardware carries over untouched: the 4.0-litre naturally ' +
        'aspirated flat-six, the double-wishbone front axle, rear-axle steering.',
      'It is usually the version people settle on. Same car to drive, considerably ' +
        'less conspicuous. Manual and PDK were both offered, and which one a car has ' +
        'narrows a search quickly — worth deciding early.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre naturally aspirated flat-six' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Transmission', value: 'Six-speed manual or seven-speed PDK' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '4.0-litre naturally aspirated flat-six',
          'Six-speed manual or seven-speed PDK',
          'Double-wishbone front suspension',
          'Rear-axle steering',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'Touring package — no fixed rear wing',
          'Leather interior in place of the standard GT3 trim',
          'Front-axle lift',
          'Carbon-ceramic brakes',
        ],
      },
    ],
    image: {
      src: '/images/marque/porsche-911-gt3-touring.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt: 'A red Porsche 911 GT3 with the Touring package, rear three-quarter view.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'ferrari-296-gtb',
    make: 'Ferrari',
    model: '296 GTB',
    category: 'Performance',
    bodyStyle: 'Coupe',
    brief:
      'A short-wheelbase berlinetta with a 120-degree V6 and an electric motor on the rear axle.',
    notes: [
      'The 296 puts a twin-turbo V6 behind the seats with an electric motor between the ' +
        'engine and the eight-speed gearbox. The wheelbase is shorter than the V8 cars ' +
        'that came before it, and it steers like it.',
      'Assetto Fiorano is the specification to ask about: Multimatic dampers, extra ' +
        'carbon, less weight. It changes the character enough that it is worth deciding ' +
        'whether you want one before the search starts.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 plug-in hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Transmission', value: 'Eight-speed dual-clutch' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '120-degree twin-turbo V6 with electric motor',
          'Eight-speed dual-clutch transmission',
          'Electric-only driving mode',
          'Carbon-ceramic braking system',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'Assetto Fiorano package',
          'Carbon fibre exterior and cabin details',
          'Front-axle lifting system',
          'Racing seats',
        ],
      },
    ],
    image: {
      src: '/images/marque/ferrari-296-gtb.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt: 'A silver Ferrari 296 GTB photographed from the rear three-quarter.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'mclaren-artura',
    make: 'McLaren',
    model: 'Artura',
    category: 'Performance',
    bodyStyle: 'Coupe',
    brief:
      'Carbon tub, twin-turbo V6, and an electric motor packaged inside the gearbox.',
    notes: [
      'The Artura sits on McLaren’s Carbon Lightweight Architecture rather than a ' +
        'carried-over platform. The axial-flux motor lives inside the eight-speed ' +
        'transmission, which keeps the extra mass low and central.',
      'It is the least complicated modern hybrid supercar to actually live with. Later ' +
        'cars received a meaningful software and output revision, so build date matters ' +
        'more here than it does on most things.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Structure', value: 'Carbon Lightweight Architecture monocoque' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          'Carbon Lightweight Architecture monocoque',
          'Axial-flux electric motor within the transmission',
          'Electronic limited-slip differential',
          'Proactive damping control',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'Performance, TechLux and Vision specifications',
          'Vehicle lift',
          'Electrochromic roof',
          'Bowers & Wilkins audio',
        ],
      },
    ],
    image: {
      src: '/images/marque/mclaren-artura.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt: 'A white McLaren Artura photographed from the front three-quarter on grass.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'bentley-continental-gt',
    make: 'Bentley',
    model: 'Continental GT',
    category: 'Grand Touring',
    bodyStyle: 'Coupe',
    brief:
      'A genuine two-door grand tourer: all-wheel drive, rear-wheel steering and the range to use them.',
    notes: [
      'Speed is the sharpest setup of the Continental — rear-wheel steering, an ' +
        'electronic limited-slip differential and a firmer calibration of the 48-volt ' +
        'anti-roll system — without giving up what the car is for.',
      'The W12 cars and the later V8 and hybrid versions drive quite differently and ' +
        'are worth separating before a search starts. Mulliner specification is the one ' +
        'that changes the cabin most.',
    ],
    specs: [
      { label: 'Engine', value: 'Twin-turbo W12, V8 or V6 plug-in hybrid' },
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Transmission', value: 'Eight-speed dual-clutch' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          'Eight-speed dual-clutch transmission',
          'Rear-wheel steering',
          '48-volt active anti-roll control',
          'Electronic limited-slip differential',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'Mulliner Driving Specification',
          'Carbon-ceramic brakes',
          'Naim for Bentley audio',
          'Rotating dashboard display',
        ],
      },
    ],
    image: {
      src: '/images/marque/bentley-continental-gt.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt:
        'A Bentley Continental GT in two-tone green, photographed from the rear ' +
        'three-quarter at a motor show.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'mercedes-amg-g-63',
    make: 'Mercedes-AMG',
    model: 'G 63',
    category: 'Luxury SUV',
    bodyStyle: 'SUV',
    brief:
      'Ladder frame, three locking differentials and a hand-built twin-turbo V8.',
    notes: [
      'The G 63 keeps everything that makes a G-Class a G-Class — ladder frame, low ' +
        'range, three locking differentials — and adds AMG’s twin-turbo V8 and a cabin ' +
        'finished to a standard the original never anticipated.',
      'Nothing else in the segment is built this way, which is most of the reason people ' +
        'buy them. Specification varies enormously between cars; the Night packages and ' +
        'the interior trim are where most of the difference sits.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre twin-turbo V8' },
      { label: 'Drivetrain', value: 'All-wheel drive with low range' },
      { label: 'Differentials', value: 'Three locking differentials' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '4.0-litre twin-turbo V8',
          'Three locking differentials',
          'Low-range transfer case',
          'AMG Ride Control adaptive damping',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'AMG Night packages',
          'Nappa leather with contrast stitching',
          'Burmester surround audio',
          'Carbon or open-pore wood trim',
        ],
      },
    ],
    image: {
      src: '/images/marque/mercedes-amg-g-63.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt:
        'A dark grey Mercedes-AMG G 63 photographed from the front three-quarter.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'range-rover-sv',
    make: 'Land Rover',
    model: 'Range Rover',
    variant: 'SV',
    category: 'Luxury SUV',
    bodyStyle: 'SUV',
    brief:
      'The specialist-vehicle Range Rover, usually specified around the rear compartment.',
    notes: [
      'SV brings its own materials palette, ceramic switchgear, and the option of a ' +
        'four-seat rear compartment with a folding club table between the seats.',
      'On the long wheelbase it is one of very few cars that works equally well driven ' +
        'or ridden in. Which of those two a car was specified for is the first thing to ' +
        'establish, because it determines the seating layout.',
    ],
    specs: [
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'SUV, standard or long wheelbase' },
      { label: 'Seating', value: 'Four- or five-seat layouts' },
    ],
    specGroups: [
      {
        title: 'Chassis and refinement',
        items: [
          'Air suspension with adaptive damping',
          'Four-corner air levelling',
          'Acoustic laminated glazing',
          'Active noise cancellation',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'SV Signature Suite rear seating',
          'Ceramic and metal switchgear',
          'Meridian Signature audio',
          'Executive-class comfort-plus seating',
        ],
      },
    ],
    image: {
      src: '/images/marque/range-rover-sv.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt:
        'A white long-wheelbase Range Rover SV photographed head-on in a showroom.',
    },
  },

  {
    kind: 'sourcing',
    published: true,
    slug: 'bmw-m3-cs',
    make: 'BMW',
    model: 'M3',
    variant: 'CS',
    generation: 'G80',
    category: 'Collector',
    bodyStyle: 'Sedan',
    brief:
      'A limited-run M3 with carbon panels, more output and a chassis tune of its own.',
    notes: [
      'CS takes the G80 M3 Competition, raises output, replaces the bonnet, roof and ' +
        'boot lid with carbon fibre, and retunes the chassis and exhaust. Production was ' +
        'limited.',
      'Cars built in small numbers to a specific engineering brief tend to hold their ' +
        'interest longer than the volume versions alongside them, which is the usual ' +
        'reason for looking at one.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo inline-six' },
      { label: 'Drivetrain', value: 'M xDrive with a rear-wheel-drive mode' },
      { label: 'Body', value: 'Carbon bonnet, roof and boot lid' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '3.0-litre twin-turbo inline-six',
          'M xDrive with a rear-wheel-drive mode',
          'Adaptive M suspension, CS-specific calibration',
          'M Carbon-ceramic brakes',
        ],
      },
      {
        title: 'Options worth specifying',
        items: [
          'Carbon fibre bonnet, roof and boot lid',
          'M Carbon bucket seats',
          'M Drive Professional',
          'Carbon interior trim',
        ],
      },
    ],
    image: {
      src: '/images/marque/bmw-m3-cs.webp',
      width: 1400,
      height: 933,
      kind: 'representative',
      alt:
        'A white BMW M3 CS photographed from the front three-quarter, showing the ' +
        'carbon bonnet and bronze wheels.',
    },
  },
];
