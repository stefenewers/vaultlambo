import { m5 } from '@/data/m5';
import { sf90 } from '@/data/sf90';
import { sian } from '@/data/sian';
import { temerario } from '@/data/temerario';
import type { SoldVehicle } from '@/lib/types';

/**
 * COMPLETED VEHICLES — specific cars that have been sold, documented individually.
 *
 * A record only belongs here when there is evidence for that particular car: its own
 * photography or factory documentation, and facts that are true of it rather than of
 * its model. "Sold" is a claim about a transaction, so it needs the same standard of
 * support as "available" does.
 *
 * The BMW M3 CS that previously appeared here was a model description with no
 * vehicle-specific evidence and no photography, so it is not published as a completed
 * sale. It now lives in the sourcing catalogue as a model brief, where it is honest.
 */
/**
 * Order matters: the first published record is the homepage feature. The Temerario
 * stays first until the owner confirms which commission is the more recent.
 */
export const soldVehicles: SoldVehicle[] = [temerario, sf90, sian, m5];
