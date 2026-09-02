/**
 * Design-token guarantees, checked numerically against the stylesheet.
 *
 * `steel-dim` was #6a6a70, which measures 3.4:1–3.7:1 against the three ink surfaces
 * and failed WCAG AA for normal text everywhere it was used — on captions, credits,
 * counters and footnotes, all of which carry meaning. Contrast is arithmetic, so it is
 * worth asserting rather than eyeballing: this test fails the build if a future palette
 * change drops a text colour back below AA.
 *
 * axe cannot cover this. jsdom applies no stylesheet, so its colour-contrast rule sees
 * transparent-on-transparent and reports nothing.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  fileURLToPath(new URL('../src/app/globals.css', import.meta.url)),
  'utf8',
);

/** Reads a `--color-x: #rrggbb;` declaration out of the stylesheet. */
function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token --color-${name} not found or not a hex literal`);
  return match[1]!;
}

/** sRGB channel → linear light, per WCAG 2.x. */
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** Every surface a body of text can sit on. */
const SURFACES = ['ink', 'ink-raised', 'ink-panel'] as const;

/** Every token used for text that carries meaning. */
const TEXT_COLOURS = ['bone', 'bone-dim', 'steel', 'steel-dim'] as const;

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

describe('colour contrast', () => {
  for (const fg of TEXT_COLOURS) {
    for (const bg of SURFACES) {
      it(`${fg} on ${bg} meets WCAG AA for normal text`, () => {
        const ratio = contrast(token(fg), token(bg));
        expect(
          ratio,
          `${fg} (${token(fg)}) on ${bg} (${token(bg)}) = ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(AA_NORMAL);
      });
    }
  }

  it('the accent is legible on the base surface', () => {
    // Giallo is used for focus rings and status marks, not body text, so the large
    // text / non-text threshold is the right bar for it.
    expect(contrast(token('giallo'), token('ink'))).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it('primary buttons are legible: ink text on a bone fill', () => {
    expect(contrast(token('ink'), token('bone'))).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('type scale', () => {
  it('the smallest label style is at least 12px', () => {
    // Below 12px, wide letter-spacing stops being legible and starts being decoration.
    const match = css.match(/\.label-xs\s*\{[^}]*font-size:\s*([\d.]+)rem/);
    expect(match, '.label-xs font-size not found').not.toBeNull();
    expect(Number(match![1])).toBeGreaterThanOrEqual(0.75);
  });

  it('no rule sets a font-size below 12px', () => {
    const sizes = [...css.matchAll(/font-size:\s*([\d.]+)rem/g)].map((m) =>
      Number(m[1]),
    );
    expect(sizes.length).toBeGreaterThan(0);
    const tooSmall = sizes.filter((rem) => rem < 0.75);
    expect(tooSmall, `font sizes below 0.75rem: ${tooSmall.join(', ')}`).toEqual([]);
  });
});
