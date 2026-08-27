import { temerario } from '@/data/temerario';
import type { Vehicle } from '@/lib/types';

/**
 * INVENTORY RECORDS.
 *
 * Descriptive copy and equipment lists below describe the model and its factory
 * specification. Per-car facts that are not held — mileage, service history,
 * registration, ownership, price — are deliberately absent rather than invented.
 * `priceDisplay` is a string for that reason; there are no numeric prices in this file.
 *
 * Photography: drop files into `public/images/vehicles/<slug>/` and add them to the
 * `images` array. While `images` is empty the card and gallery fall back to a
 * typographic panel, so adding real photography needs no design changes.
 */
const inventory: Vehicle[] = [
  {
    slug: 'porsche-911-gt3-touring',
    year: 2023,
    make: 'Porsche',
    model: '911 GT3',
    variant: 'Touring',
    bodyStyle: 'Coupe',
    category: 'Performance',
    availability: 'available',
    priceDisplay: 'Price on request',
    summary: 'The GT3 without the wing, and with none of the hardware removed.',
    description: [
      'Touring deletes the fixed rear wing and swaps the interior trim for leather, ' +
      'but leaves the mechanical package alone. The 4.0-litre naturally aspirated ' +
      'flat-six, the double-wishbone front axle and the rest of the GT department’s ' +
      'work carry over unchanged.',
      'It is the version most owners end up wanting: the same car to drive, without ' +
      'announcing itself in the rear-view mirror of everything in front of it.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre naturally aspirated flat-six' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Coupe' },
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
        title: 'Cabin and equipment',
        items: [
          'Touring package — no fixed rear wing',
          'Leather interior in place of the standard GT3 trim',
          'Front-axle lift available',
          'Carbon-ceramic brakes available',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'ferrari-296-gtb',
    year: 2024,
    make: 'Ferrari',
    model: '296 GTB',
    bodyStyle: 'Coupe',
    category: 'Performance',
    availability: 'available',
    priceDisplay: 'Price on request',
    summary: 'A short-wheelbase berlinetta with a 120-degree V6 and an electric motor.',
    description: [
      'The 296 GTB puts a twin-turbo V6 behind the seats with an electric motor ' +
      'between the engine and the eight-speed gearbox, driving the rear axle. The ' +
      'wheelbase is shorter than the V8 cars that preceded it, and it steers like it.',
      'Assetto Fiorano, where fitted, brings Multimatic dampers, additional carbon and ' +
      'a lighter overall specification.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 plug-in hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Berlinetta coupe' },
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
        title: 'Cabin and equipment',
        items: [
          'Assetto Fiorano package available',
          'Carbon fibre exterior and cabin details',
          'Front-axle lifting system',
          'Racing seats available',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'mclaren-artura',
    year: 2024,
    make: 'McLaren',
    model: 'Artura',
    bodyStyle: 'Coupe',
    category: 'Performance',
    availability: 'reserved',
    statusNote: 'Deposit taken',
    priceDisplay: 'Price on request',
    summary: 'Carbon tub, twin-turbo V6, and an electric motor inside the gearbox.',
    description: [
      'The Artura is built on McLaren’s Carbon Lightweight Architecture rather than a ' +
      'carried-over platform. The axial-flux motor sits inside the eight-speed ' +
      'transmission, which keeps the extra mass low and central.',
      'It is the lightest way into a modern hybrid supercar, and the least ' +
      'complicated to live with day to day.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Coupe' },
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
        title: 'Cabin and equipment',
        items: [
          'Performance, TechLux and Vision specifications',
          'Vehicle lift',
          'Electrochromic roof available',
          'Bowers & Wilkins audio available',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'bentley-continental-gt-speed',
    year: 2024,
    make: 'Bentley',
    model: 'Continental GT',
    variant: 'Speed',
    bodyStyle: 'Coupe',
    category: 'Grand Touring',
    availability: 'available',
    priceDisplay: 'Price on request',
    summary: 'Twelve cylinders, four driven wheels, and the range to use them.',
    description: [
      'Speed is the sharpest setup of the W12 Continental: rear-wheel steering, an ' +
      'electronic limited-slip differential and a firmer calibration of the 48-volt ' +
      'anti-roll system, without giving up what the car is for.',
      'It covers long distances at a pace that is difficult to argue with, and does it ' +
      'quietly.',
    ],
    specs: [
      { label: 'Engine', value: '6.0-litre twin-turbo W12' },
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'Coupe' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '6.0-litre twin-turbo W12',
          'Eight-speed dual-clutch transmission',
          'Rear-wheel steering',
          '48-volt active anti-roll control',
        ],
      },
      {
        title: 'Cabin and equipment',
        items: [
          'Electronic limited-slip differential',
          'Carbon-ceramic brakes available',
          'Mulliner Driving Specification available',
          'Naim for Bentley audio available',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'mercedes-amg-g-63',
    year: 2024,
    make: 'Mercedes-AMG',
    model: 'G 63',
    bodyStyle: 'SUV',
    category: 'Luxury SUV',
    availability: 'available',
    priceDisplay: 'Price on request',
    summary: 'Three locking differentials, a ladder frame, and a hand-built V8.',
    description: [
      'The G 63 keeps everything that makes a G-Class a G-Class — ladder frame, low ' +
      'range, three locking differentials — and adds AMG’s twin-turbo V8 and a cabin ' +
      'finished to a standard the original never anticipated.',
      'Nothing else in the segment is built this way, which is most of the reason ' +
      'people buy them.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre twin-turbo V8' },
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'SUV' },
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
        title: 'Cabin and equipment',
        items: [
          'AMG Night packages',
          'Nappa leather with contrast stitching',
          'Burmester surround audio',
          'Carbon or open-pore wood trim',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'land-rover-range-rover-sv',
    year: 2024,
    make: 'Land Rover',
    model: 'Range Rover',
    variant: 'SV',
    bodyStyle: 'SUV',
    category: 'Luxury SUV',
    availability: 'reserved',
    statusNote: 'Deposit taken',
    priceDisplay: 'Price on request',
    summary: 'The long-wheelbase Range Rover, specified around the rear compartment.',
    description: [
      'SV is the specialist-vehicle specification: its own materials palette, ceramic ' +
      'switchgear, and the option of a four-seat rear compartment with a folding ' +
      'club table between the seats.',
      'On the long wheelbase it is one of very few cars that works equally well driven ' +
      'or ridden in.',
    ],
    specs: [
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'SUV, long wheelbase available' },
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
        title: 'Cabin and equipment',
        items: [
          'SV Signature Suite rear seating',
          'Ceramic and metal switchgear',
          'Meridian Signature audio',
          'Executive-class comfort-plus seating',
        ],
      },
    ],
    images: [],
  },
  {
    slug: 'bmw-m3-cs',
    year: 2023,
    make: 'BMW',
    model: 'M3',
    variant: 'CS',
    bodyStyle: 'Sedan',
    category: 'Collector',
    availability: 'sold',
    priceDisplay: 'Price on request',
    summary: 'A limited-run M3 with carbon panels and a chassis tune of its own.',
    description: [
      'CS takes the G80 M3 Competition, adds output, replaces the bonnet, roof and ' +
      'boot lid with carbon fibre, and retunes the chassis and exhaust. Production ' +
      'was limited.',
      'Cars built in small numbers with a specific engineering brief tend to hold ' +
      'their interest longer than the volume versions alongside them.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo inline-six' },
      { label: 'Drivetrain', value: 'All-wheel drive with rear-drive mode' },
      { label: 'Body', value: 'Sedan' },
    ],
    specGroups: [
      {
        title: 'Powertrain and chassis',
        items: [
          '3.0-litre twin-turbo inline-six',
          'M xDrive with a rear-wheel-drive mode',
          'Adaptive M suspension, CS-specific calibration',
          'M Carbon-ceramic brakes available',
        ],
      },
      {
        title: 'Cabin and equipment',
        items: [
          'Carbon fibre bonnet, roof and boot lid',
          'M Carbon bucket seats',
          'M Drive Professional',
          'Carbon interior trim',
        ],
      },
    ],
    images: [],
  },
];

/** The full data set. Order here is the default order in the inventory grid. */
export const vehicles: Vehicle[] = [...inventory, temerario];
