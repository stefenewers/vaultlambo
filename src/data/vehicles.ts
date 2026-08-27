import { temerario } from '@/data/temerario';
import type { Vehicle } from '@/lib/types';

/**
 * SAMPLE INVENTORY — placeholder records.
 *
 * These six listings exist so the marketplace has something to browse. They are not
 * vehicles held for sale, and nothing here is a claim about a real car:
 *
 *   - no prices, VINs, mileage, registrations, locations or history
 *   - equipment lines describe the model, not an individual example
 *   - `isSample: true` drives the "Sample listing" marker in the UI and keeps these
 *     records out of the structured data emitted for search engines
 *
 * Replace them with real listings, set `isSample: false`, and turn off
 * `showSampleInventoryNotice` in `src/site.config.ts`.
 *
 * Imagery: drop files into `public/images/vehicles/<slug>/` and add them to `images`.
 * While `images` is empty the UI falls back to a neutral placeholder panel.
 */
const sampleVehicles: Vehicle[] = [
  {
    slug: 'porsche-911-gt3-touring',
    year: 2023,
    make: 'Porsche',
    model: '911 GT3',
    variant: 'Touring',
    bodyStyle: 'Coupe',
    category: 'Driver',
    availability: 'available',
    priceDisplay: 'Price on request',
    isSample: true,
    summary:
      'The GT3 without the wing: the same naturally aspirated flat-six and chassis, ' +
      'in the quieter bodywork.',
    description: [
      'Sample listing. The Touring package deletes the fixed rear wing and softens the ' +
      'GT3’s presentation without changing what sits underneath it — the 4.0-litre ' +
      'naturally aspirated flat-six, the double-wishbone front axle and the rest of ' +
      'the GT department’s work are unchanged.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre naturally aspirated flat-six' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Coupe' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Touring package — no fixed rear wing',
          'Double-wishbone front suspension',
          'Carbon-ceramic brake option',
          'Lightweight glass and rear silencer',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'Six-speed manual or PDK',
          'Front axle lift',
          'Full bucket seats or comfort seats',
          'Extended leather interior',
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
    category: 'Supersport',
    availability: 'available',
    priceDisplay: 'Price on request',
    isSample: true,
    summary:
      'Ferrari’s twin-turbo V6 plug-in hybrid berlinetta, with a short wheelbase and a ' +
      'rear-drive layout.',
    description: [
      'Sample listing. The 296 GTB pairs a 120-degree twin-turbo V6 with an electric ' +
      'motor between the engine and the eight-speed gearbox, driving the rear axle.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 plug-in hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Berlinetta coupe' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Twin-turbo V6 with electric motor',
          'Eight-speed dual-clutch transmission',
          'Electric-only driving mode',
          'Carbon-ceramic braking system',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'Assetto Fiorano package',
          'Carbon fibre exterior and cabin details',
          'Lifting system',
          'Racing seats',
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
    category: 'Supersport',
    availability: 'pending',
    statusNote: 'Reserved pending inspection',
    priceDisplay: 'Price on request',
    isSample: true,
    summary:
      'McLaren’s carbon-tubbed V6 hybrid, built around a new lightweight architecture.',
    description: [
      'Sample listing. The Artura is built on McLaren’s Carbon Lightweight Architecture ' +
      'with a twin-turbo V6 and an axial-flux electric motor integrated into the ' +
      'eight-speed transmission.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo V6 hybrid' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Body', value: 'Coupe' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Carbon Lightweight Architecture monocoque',
          'Axial-flux electric motor',
          'Electronic differential',
          'Proactive damping control',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'Performance, TechLux or Vision specification',
          'Vehicle lift',
          'Electrochromic roof',
          'Bowers & Wilkins audio',
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
    category: 'Luxury utility',
    availability: 'available',
    priceDisplay: 'Price on request',
    isSample: true,
    summary:
      'The hand-assembled V8 G-Class: three locking differentials under a heavily ' +
      'trimmed cabin.',
    description: [
      'Sample listing. The G 63 keeps the ladder frame, the low-range transfer case and ' +
      'the three locking differentials, and adds AMG’s twin-turbo V8 and a considerably ' +
      'more elaborate interior.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Engine', value: '4.0-litre twin-turbo V8' },
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'SUV' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Three locking differentials',
          'Low-range transfer case',
          'AMG Ride Control adaptive damping',
          'Ladder-frame construction',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'AMG Night packages',
          'Nappa leather interior with contrast stitching',
          'Burmester audio',
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
    category: 'Luxury utility',
    availability: 'pending',
    statusNote: 'Reserved pending inspection',
    priceDisplay: 'Price on request',
    isSample: true,
    summary:
      'The long-wheelbase Range Rover at its most heavily specified, built around the ' +
      'rear compartment.',
    description: [
      'Sample listing. SV is the specialist-vehicle specification of the Range Rover, ' +
      'with its own materials palette, ceramic switchgear and the option of a four-seat ' +
      'rear compartment.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Drivetrain', value: 'All-wheel drive' },
      { label: 'Body', value: 'SUV, long wheelbase available' },
      { label: 'Seating', value: 'Four- or five-seat layouts' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Air suspension with adaptive damping',
          'Four-corner air levelling',
          'Acoustic laminated glazing',
          'Active noise cancellation',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'SV Signature Suite rear seating',
          'Ceramic and metal switchgear',
          'Meridian Signature audio',
          'Executive-class comfort-plus seats',
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
    category: 'Driver',
    availability: 'sold',
    statusNote: 'Sample archive entry',
    priceDisplay: 'Not published',
    isSample: true,
    summary:
      'The limited CS version of the M3: more power, carbon body panels and a firmer ' +
      'chassis tune.',
    description: [
      'Sample listing. The M3 CS is a limited version of the G80 M3 with additional ' +
      'output, carbon fibre body panels and a revised chassis and exhaust specification.',
      'Specification shown is representative of the model. It does not describe an ' +
      'individual vehicle, and no history, mileage or ownership detail is implied.',
    ],
    specs: [
      { label: 'Engine', value: '3.0-litre twin-turbo inline-six' },
      { label: 'Drivetrain', value: 'All-wheel drive with rear-drive mode' },
      { label: 'Body', value: 'Sedan' },
    ],
    specGroups: [
      {
        title: 'Model equipment',
        items: [
          'Carbon fibre bonnet, roof and boot lid',
          'M xDrive with rear-wheel-drive mode',
          'Adaptive M suspension, CS-specific tune',
          'M Carbon bucket seats',
        ],
      },
      {
        title: 'Typical options',
        items: [
          'M Carbon-ceramic brakes',
          'M Drive Professional',
          'Track tyre specification',
          'Carbon interior trim',
        ],
      },
    ],
    images: [],
  },
];

/**
 * The full data set. The Temerario is first so it leads the inventory grid and the
 * home page. Everything after it is sample content.
 */
export const vehicles: Vehicle[] = [temerario, ...sampleVehicles];
