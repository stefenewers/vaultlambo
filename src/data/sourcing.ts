import type { SourcingCategory } from '@/lib/types';

/**
 * REPRESENTATIVE BRIEFS — the categories a search can cover.
 *
 * This replaced a catalogue of seven per-model records, each with a photograph and
 * several paragraphs of manufacturer detail. Two things were wrong with that:
 *
 *   1. The photography was unrelated third-party imagery of other people's cars,
 *      shot in different places under different light. Assembled into a grid it made
 *      the site look like a classifieds page rather than a sourcing firm.
 *   2. Reciting how a 911 GT3 is built is not evidence that anyone here can find one.
 *      Generic model facts presented as a capability claim are a claim nobody has
 *      verified.
 *
 * What remains is scope, stated plainly. `examples` are model names and nothing more:
 * no record sits behind them, so there is nothing to mistake for stock. The page copy
 * states that availability is established only after a brief is agreed.
 *
 * Adding a category is fine. Adding claims about relationships, access, allocations or
 * expertise is not, unless the owner has supplied something that supports it.
 */
export const sourcingCategories: SourcingCategory[] = [
  {
    kind: 'sourcing-category',
    published: true,
    id: 'performance',
    category: 'Performance',
    summary:
      'Mid- and rear-engined cars where specification changes the car materially — ' +
      'transmission, aero, seats, brakes.',
    examples: [
      'Porsche 911 GT3 and GT3 Touring',
      'Ferrari 296 GTB',
      'McLaren Artura',
      'Lamborghini Huracán and Temerario',
    ],
  },
  {
    kind: 'sourcing-category',
    published: true,
    id: 'grand-touring',
    category: 'Grand Touring',
    summary:
      'Cars built for distance, where trim, acoustics and options matter more than lap ' +
      'time.',
    examples: [
      'Bentley Continental GT',
      'Aston Martin DB12',
      'Ferrari Roma',
      'Porsche Panamera',
    ],
  },
  {
    kind: 'sourcing-category',
    published: true,
    id: 'luxury-suv',
    category: 'Luxury SUV',
    summary:
      'Full-size cars specified around the rear compartment as often as the driver’s ' +
      'seat.',
    examples: [
      'Range Rover SV',
      'Mercedes-AMG G 63',
      'Bentley Bentayga',
      'Porsche Cayenne Turbo',
    ],
  },
  {
    kind: 'sourcing-category',
    published: true,
    id: 'collector',
    category: 'Collector',
    summary:
      'Limited-run and end-of-line cars, where provenance and documentation decide ' +
      'whether a car is worth pursuing.',
    examples: [
      'BMW M3 CS',
      'Porsche 911 S/T',
      'Limited-run editions and final-series cars',
    ],
  },
];
