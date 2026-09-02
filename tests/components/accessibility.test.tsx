/**
 * @vitest-environment jsdom
 *
 * Automated accessibility checks.
 *
 * axe catches a specific and useful class of defect — missing names, broken ARIA
 * relationships, invalid roles, duplicated ids. It cannot judge focus order, keyboard
 * traps or whether a label makes sense, which is why the behavioural assertions in the
 * sibling files exist alongside it rather than being replaced by it.
 *
 * Colour-contrast rules are disabled here on purpose: jsdom applies no stylesheet, so
 * every element reports transparent-on-transparent and the result would be noise. The
 * palette is verified numerically instead, in `tests/design-tokens.test.ts`.
 */

import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { OptionGroup } from '@/components/forms/InquiryForm';
import type { VehicleImage } from '@/lib/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const { Header } = await import('@/components/site/Header');
const { InquiryForm } = await import('@/components/forms/InquiryForm');
const { VehicleGallery } = await import('@/components/vehicles/VehicleGallery');

/** Rules that cannot produce a meaningful result without a stylesheet or a full page. */
const DISABLED_RULES = {
  'color-contrast': { enabled: false },
  // These assert page-level structure; components are rendered in isolation here.
  region: { enabled: false },
  'landmark-one-main': { enabled: false },
  'page-has-heading-one': { enabled: false },
};

async function violationsIn(container: HTMLElement): Promise<string[]> {
  const results = await axe.run(container, {
    rules: DISABLED_RULES,
    resultTypes: ['violations'],
  });
  return results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`,
  );
}

const images: VehicleImage[] = Array.from({ length: 4 }, (_, i) => ({
  src: `/images/test/${i + 1}.jpg`,
  alt: `Alt text for image ${i + 1}`,
  caption: `Caption ${i + 1}`,
  width: 1200,
  height: 800,
  kind: 'factory-render' as const,
}));

const groups: OptionGroup[] = [
  {
    label: 'Models we source',
    options: [{ value: 'Porsche 911 GT3 Touring', label: 'Porsche 911 GT3 Touring' }],
  },
];

afterEach(cleanup);

describe('accessibility', () => {
  it('header has no axe violations', async () => {
    const { container } = render(<Header showInventory />);
    expect(await violationsIn(container)).toEqual([]);
  });

  it('header has no axe violations with the mobile panel open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Header showInventory />);
    await user.click(container.querySelector('button')!);
    expect(await violationsIn(container)).toEqual([]);
  });

  it('enquiry form has no axe violations', async () => {
    const { container } = render(<InquiryForm groups={groups} />);
    expect(await violationsIn(container)).toEqual([]);
  });

  it('enquiry form has no axe violations while showing errors', async () => {
    const user = userEvent.setup();
    const { container } = render(<InquiryForm groups={groups} />);
    await user.click(await screenSubmit(container));
    expect(await violationsIn(container)).toEqual([]);
  });

  it('gallery has no axe violations', async () => {
    const { container } = render(
      <VehicleGallery images={images} vehicleName="Test Car" />,
    );
    expect(await violationsIn(container)).toEqual([]);
  });

  it('gallery lightbox has no axe violations', async () => {
    const user = userEvent.setup();
    render(<VehicleGallery images={images} vehicleName="Test Car" />);

    const opener = document.querySelector<HTMLButtonElement>('.cursor-zoom-in')!;
    await user.click(opener);

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(await violationsIn(dialog)).toEqual([]);
  });
});

/** The submit button, found without depending on `screen` across containers. */
async function screenSubmit(container: HTMLElement): Promise<HTMLButtonElement> {
  const button = container.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!button) throw new Error('submit button not found');
  return button;
}
