import type { InventoryVehicle } from '@/lib/types';

/**
 * ACTIVE INVENTORY — specific cars currently being offered.
 *
 * This array is empty because no vehicle currently meets the bar for publication. It
 * is not a placeholder to be filled with plausible-looking cars: every entry has to be
 * one particular car, with its own photography and its own verified facts.
 *
 * Before adding a record, all of the following must be true:
 *
 *   1. It is a unique, identifiable vehicle — not a model.
 *   2. Real photography of that car exists in `public/images/vehicles/<slug>/`. The
 *      `images` type requires at least one, so this is enforced at compile time.
 *   3. The year is verified.
 *   4. Make, model and variant are verified.
 *   5. Availability is verified — the car is genuinely available or genuinely reserved.
 *      'reserved' and any "deposit taken" note are only used when that has happened.
 *   6. There are at least three meaningful, vehicle-specific facts. The `specs` tuple
 *      requires three, so this is enforced at compile time too.
 *   7. A real enquiry destination is configured (see `npm run verify:production`).
 *
 * Never invent mileage, VIN, stock number, price, ownership, history or specification.
 * If a fact is not known, leave it out — the layout is built to omit rather than pad.
 *
 * While this array is empty, the homepage inventory section hides itself, `/inventory`
 * renders an honest empty state, and no inventory routes are generated.
 */
export const inventory: InventoryVehicle[] = [];
