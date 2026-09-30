import type { VehicleImage } from '@/lib/types';

/**
 * Cropping rules shared by every frame that shows a vehicle image.
 *
 * Two kinds of source arrive: ordinary photographs and renderings (about 3:2 or 4:3),
 * and studio turntable panoramas (about 2.3:1) with the car small in the middle. A
 * panorama cropped into a 3:2 or square box loses the ends of the car and fills the
 * frame with turntable, so panoramas are only ever shown in wide frames, and square
 * detail crops skip them altogether.
 */

/** Wider than this is treated as a studio panorama. */
const PANORAMA_RATIO = 1.9;

export function isPanorama(image: VehicleImage): boolean {
  return image.width / image.height >= PANORAMA_RATIO;
}

/** Inline style that points a cropped image at its subject. */
export function focusStyle(image: VehicleImage): { objectPosition: string } {
  return { objectPosition: image.focus ?? '50% 50%' };
}
